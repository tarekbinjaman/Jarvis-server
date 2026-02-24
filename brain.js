const natural = require("natural");

let memory = {
    name: null,
};

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const greetings = ["Hello!", "Hey there!", "Hello Boss👋"];

const intents = [
    {
        patterns: ["hello", "hi", "hey", "good morning"],
        response: "Hello Boss👋"
    },
        {
        patterns: ["what is your name", "who are you"],
        response: "I am your personal assistant Jarvis."
    },
        {
        patterns: ["how are you", "how you doing"],
        response: "I'm functioning perfectly. What about you?"
    }
];

function preprocess(text) {
const tokens = tokenizer.tokenize(text.toLowerCase());
return tokens.map((word) => stemmer.stem(word)).join(" ");
}

function getResponse(message) {
    const preprocessMessage = preprocess(message);
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

    for(let intent of intents) {
        for(let pattern of intent.patterns) {
            const processPattern = preprocess(pattern);
            const similarity = natural.JaroWinklerDistance(preprocessMessage, processPattern);
            if(similarity > 0.75) {
                return intent.response
            }
        }
    }
    return "I am still learning...";
}


module.exports = {getResponse};