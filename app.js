const express = require("express");
const app = express();
const PORT = 4000;
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/B49-Blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.once('open', () => console.log("We are now connected to MongoDB"));

app.use(express.json());
app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));
app.listen(PORT, () => console.log("Server is now running in port " + PORT));