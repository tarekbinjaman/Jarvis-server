# Day one

install
~~~
npm i cors express
npm init -y
~~~

server.js

~~~
const express = require("express");
const cors = require("cors");
const {getResponse} = require("./brain")

const app = express();
app.use(cors());
app.use(express.json());


app.post("/chat", (req, res) => {
    const userMessage = req.body.message;
    const jarvisReply = getResponse(userMessage)

    res.json({reply: jarvisReply})
})

app.get("/", (req, res) => {
  res.send("Jarvis server is running 🚀");
});

app.listen(5000, () => {
    console.log("Jarvis running on http://localhost:5000");
});
~~~

brain.js

~~~
let memory = {
    name: null,
};

const greetings = ["Hello!", "Hey there!", "Hello Boss👋"];

function getResponse(message) {
    message = message.toLowerCase();
    // Greeting
    if(message.includes("hi") || message.includes("hello")) {
        return greetings[Math.floor(Math.random() * greetings.length)]
    }
    // ask name
    if(message.includes("your name")) {
        return "I am your personal assistant Jarvis"
    }
    // if user tells thier name
    if(message.includes("my name is")) {
        const name = message.split("my name is")[1].trim();
        memory.name = name;
        return `Nice to meet you ${name}`
    }
    if(message.includes("my name")) {
        if(memory.name) {
            return `Your name is ${memory.name}`
        } else {
            return "Boss I don't know your name yet. Would you tell me your name so that i could remember"
        }
    }
    if(message.includes("what is my name")) {
        if(memory.name) {
            return `Your name is ${memory.name}`;
        } else {
            return "I don't know your name yet. Would you mind if i ask your name 😊"
        }

    }
    return "I am still learning...";
}


module.exports = {getResponse};
~~~

# Day two

Install NLP Library
We’ll use a lightweight library:

~~~
npm install natural
~~~
