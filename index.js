const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const port = 8080;
const ExpressError = require("./ExpressError");
const ChatModel = require("./models/chat");

main()
    .then(() => {
        console.log("Connection successful");
    })
    .catch((err) => {
        console.error("Connection error:", err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Routes
app.get("/chat", async (req, res, next) => {
    try {
        let chats = await ChatModel.find();
        res.render("showchats.ejs", { chats });
    } catch (err) {
        next(err);
    }
});

app.get("/chat/new", (req, res) => {
    res.render("newChat.ejs");
});

app.post("/chat/new/add", async (req, res, next) => {
    let { from, to, message } = req.body;
    let newChat = new ChatModel({
        from,
        message,
        to,
        created_at: new Date(),
    });
    try {
        await newChat.save();
        console.log("Chat saved");
        res.redirect("/chat");
    } catch (err) {
        next(err);
    }
});

app.get("/chat/:id/edit", async (req, res, next) => {
    let { id } = req.params;
    try {
        let chat = await ChatModel.findById(id);
        if (!chat) throw new ExpressError(404, "Chat not found");
        res.render("edit.ejs", { chat });
    } catch (err) {
        next(err);
    }
});

app.put("/chat/:id", async (req, res, next) => {
    let { id } = req.params;
    let { newChat } = req.body;

    try {
        let updatedChat = await ChatModel.findByIdAndUpdate(
            id,
            { message: newChat, updated_at: Date.now() },
            { runValidators: true, new: true }
        );

        if (!updatedChat) throw new ExpressError(404, "Chat not found");

        res.redirect("/chat");
    } catch (err) {
        next(err);
    }
});

app.delete("/chat/:id", async (req, res, next) => {
    let { id } = req.params;
    try {
        let deletedChat = await ChatModel.findByIdAndDelete(id);
        if (!deletedChat) throw new ExpressError(404, "Chat not found");
        res.redirect("/chat");
    } catch (err) {
        next(err);
    }
});

// 404 Handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).send(`
        <h1>Error ${status}</h1>
        <p>${message}</p>
        <a href="/chat">Go back to chats</a>
    `);
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
