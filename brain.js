const natural = require("natural");

const fs = require("fs");
const { json } = require("stream/consumers");
const path = require("path");

const filePath = path.join(__dirname, 'knowledge.json');
const knowledge = fs.readFileSync(filePath, 'utf8');

function saveKnowledge() {
    fs.writeFileSync("knowledge.json", JSON.stringify(knowledge, null, 2))
};

let memory = {
    name: null,
    character: null
};

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const greetings = ["Hello!", "Hey there!", "Hello Boss👋"];

// const intents = [
//     {
//         patterns: ["hello", "hi", "hey", "good morning"],
//         response: "Hello Boss👋"
//     },
//         {
//         patterns: ["what is your name", "who are you"],
//         response: "I am your personal assistant Jarvis."
//     },
//         {
//         patterns: ["how are you", "how you doing"],
//         response: "I'm functioning perfectly. What about you?"
//     }
// ];

function preprocess(text) {
const tokens = tokenizer.tokenize(text.toLowerCase());
return tokens.map((word) => stemmer.stem(word)).join(" ");
}

function getResponse(message) {
    const preprocessMessage = preprocess(message);
    message = message.toLowerCase();

    // Teach mode
    try {
        if(message.startsWith("teach:")){
            const parts = message
            .replace("teach:", "")
            .trim()
            .split("reply")
        if(!parts[1]) {
            return "Teach format incorrect. Use: teach: if i say X reply Y";
        }
        const trigger = parts[0].replace("if i say", "").trim();
        const preprocessTrigger = preprocess(trigger)
        const reply = parts[1].trim();
        knowledge[preprocessTrigger] = reply; // setting up new property
        saveKnowledge();
        return "Got it! I learn something new."
        } else if(message.startsWith("if i say")) {
            const parts = 
            message
            .split("reply");
            const trigger = parts[0].replace("if i say", "").trim();
            const preprocessTrigger = preprocess(trigger);
            const reply = parts[1].trim();
            knowledge[preprocessTrigger] = reply;
            saveKnowledge()
            return "Got it! I learn something new."
        }
    } catch(err) {
        return "Teach format incorrect. use teach: when i say x you reply y"
    }

for (let key in knowledge) {
    const processedKey = preprocess(key);

    if (preprocessMessage.includes(processedKey)) {
        return knowledge[key];
    }
}

    // Greeting
    // if(message.includes("hi") || message.includes("hello")) {
    //     return greetings[Math.floor(Math.random() * greetings.length)]
    // }
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
    if(message.includes("i am a ")) {
        const character = message.split("i am a ")[1].trim();
        memory.character = character
        return `okay got it`
    }
        if(message.includes("i am")) {
        const character = message.split("i am")[1].trim();
        memory.character = character
        return `okay got it`
    }
    if(message.includes("who am i")) {
        if(memory.character) {
            return `you are a ${memory.character}`
        } else {
            return `I don't know who you are! would you tell me so that i could remembder!`
        }
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
    if(message.includes("date") || message.includes("today")) {
        const today = new Date();
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
        return `today is ${today.toLocaleDateString("en-US", options)}`
    }

    if(message.includes("time") || message.includes("current time") || message.includes("what time")) {
        const now = new Date();
        const options = {hour: "2-digit", minute: "2-digit"}
        return `it's ${now.toLocaleTimeString("en-US", options)}`
    }

    // for(let intent of intents) {
    //     for(let pattern of intent.patterns) {
    //         const processPattern = preprocess(pattern);
    //         const similarity = natural.JaroWinklerDistance(preprocessMessage, processPattern);
    //         if(similarity > 0.75) {
    //             return intent.response
    //         }
    //     }
    // }
    return "I am still learning. Teach me using: teach: if i say hello reply hi...";
}


module.exports = {getResponse};