//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-anry:362542192Qq@cluster0.zubyu.mongodb.net/todolistDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const itemsSchema = {
  name: String
}
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
    name: "Welcome to your ToDo List"
});

const item2 = new Item ({
  name: "Time to make some"
});

const item3 = new Item ({
  name: "Never give up"
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

  Item.find({}, (err, foundItems) => {
    if(foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if(err) {
          console.log(err);
        }
      });
      
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item ({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if(err) {
        console.log(err);
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
      if(!err) {
        res.redirect("/" + listName);
      }
    });
  }

  
});

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/:customListName", ((req,res) => {
  const customAddress = _.capitalize(req.params.customListName);

  List.findOne({name: customAddress}, (err, results) => {
    if(results) {
      res.render("list", {listTitle: results.name, newListItems: results.items});
    } else {

      const list = new List({
        name: customAddress,
        items: defaultItems
      });

      list.save();
      res.redirect(customAddress);
    }
  });
}));

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

