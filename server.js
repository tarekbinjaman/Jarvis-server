const express = require("express");
const cors = require("cors");
const {getResponse} = require("./brain")

const app = express();
app.use(cors(
    {
    origin: "https://tarek-jarvis-client-b5ulq2v6p-tarek-jamans-projects.vercel.app",
    credentials: true
  }
));
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