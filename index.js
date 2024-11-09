const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const port = 8080;
const ChatModel = require("./models/chat"); 

main()
    .then(() => {
        console.log("Connection successful");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.get("/chat", async (req,res)=>{
    let chats = await ChatModel.find()
    res.render("showchats.ejs", {chats});
})

app.get("/chat/new", async (req,res)=>{
    let chats = await ChatModel.find()
    console.log("working");
    res.render("newChat.ejs");
})

app.post("/chat/new/add", (req, res)=>{
    let {from, to, message} = req.body;
    let newChat = new ChatModel({
        from: from,
        message: message,
        to: to,
        created_at: new Date(),
    });
    try {
        newChat.save()
            .then((result) => {
                console.log("chat saved");
            }).catch((error) => {
                throw error;
            })
    } catch (error) {
        console.log(error)
    }
    res.redirect("/chat");
})

app.get("/chat/:id/edit", async (req, res)=>{
    let {id} = req.params;
    let chat = await ChatModel.findById(id);
    res.render("edit.ejs", {chat});
})

app.put("/chat/:id", async (req, res) => {
    let { id } = req.params;
    let { newChat } = req.body;

    try {
        let updatedChat = await ChatModel.findByIdAndUpdate(
            id, 
            { message: newChat, updated_at: Date.now() }, 
            { runValidators: true, new: true }
        );

        if (!updatedChat) {
            return res.status(404).send("Chat not found.");
        }

        res.redirect("/chat");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating chat.");
    }
});

app.delete("/chat/:id", async (req, res)=>{
    let {id} = req.params;
    let deletedChat = await ChatModel.findByIdAndDelete(id);
    res.redirect("/chat");
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
