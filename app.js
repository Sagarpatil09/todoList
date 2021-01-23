const express = require('express');
const bodyParser = require('body-parser');
// const date = require( __dirname + "/date.js");
const app = express();
const mongoose = require('mongoose');
const _ = require('lodash');


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-sagar:admin@cluster0.nny9u.mongodb.net/todoListDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = mongoose.Schema({
  name : {
    type : String
  }
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name : "Welcome to Your Todolist!"
});

const item2 = new Item({
  name : "Hit the + button to add a new Item"
});

const item3 = new Item({
  name : "Hit <-- to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = mongoose.Schema({
  name : String,
  items : [itemsSchema]
});



const List = mongoose.model("List", listSchema);

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const newItem = new Item({
    name : itemName
  });
  if (listName === "Today") {
    newItem.save();
    res.redirect("/")
  } else {
    List.findOne({name : listName}, (err, result) => {
      result.items.push(newItem);
      result.save();
      res.redirect("/" + listName);
    });
  }



});

app.post("/delete", (req, res) => {
  const itemId =req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(itemId, (err) => {
      if (err) {
        console.log(err);
      }
    })
    res.redirect("/")
  } else {
    List.findOneAndUpdate({name : listName}, {$pull : {items : {_id : itemId}}}, (err, result) => {
      if(!err){
        res.redirect("/" + listName);
      }
    })
  }


});



app.get("/", (req, res) => {
  Item.find({}, (err, result) => {
    if(result.length === 0){
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Items Sucessfully Saved");
        }
      });
      res.redirect("/");
    }else {
      res.render("list", {
        header: "Today",
        newListItems: result
      });
    }

  });


})

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);


  List.findOne({name : customListName}, (err, result) => {
    if (!result) {
      const list = new List({
        name : customListName,
        items : defaultItems
      })
      list.save();
      res.redirect("/" + customListName)
    } else {
      res.render("list", {
        header: result.name,
        newListItems: result.items
      });

    }
  })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
})
