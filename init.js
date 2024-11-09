const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker'); 
const ChatModel = require("./models/chat"); // Import your Chat model

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

main()
    .then(() => {
        console.log("Connection successful");
        generateFakeChats(8); // Generate 10 fake chats
    })
    .catch((err) => {
        console.log(err);
    });

function generateFakeChats(num) {
    let chats = []; // Declare the chats array here
    for (let i = 0; i < num; i++) {
        chats.push({
            from: faker.person.fullName(), 
            to: faker.person.fullName(),
            message: faker.lorem.sentence(), 
            created_at: faker.date.past() 
        });
    }

ChatModel.insertMany(chats) // Use ChatModel here
        .then(res => {
            console.log('Chats inserted successfully:', res);
        })
        .catch(err => {
            console.log('Error inserting chats:', err);
        });
}