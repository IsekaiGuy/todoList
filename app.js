const date = require(__dirname + '/date.js');
const express = require('express');
const app = express();

let items = [];
let itemsList = [];

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", (req, res) => {
    let currentDay = date.getDate();
    
    res.render('list', {whatADay: currentDay, TODO: items});
});

app.post("/", (req, res) => {
    let item = req.body.input;
    
    if (req.body.btn === "Work") {
        itemsList.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", (req, res) => {
    res.render("list", {whatADay: "Work", TODO: itemsList});
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});