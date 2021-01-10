const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
const items = ["Wake Up at 05:00 am"];





app.get("/", (req, res) =>{
    const date = new Date();
    const options = {
      weekday : "long",
      day : "numeric",
      month : "long"
    };
    day = date.toLocaleDateString("en-US", options);
    res.render("list", {today : day, newListItems : items});
})

app.post("/", (req, res) => {
  var item = req.body.newItem;
  items.push(item);
  res.redirect("/");
})





app.listen(3000, (req, res) =>{
  console.log("Server is running on port 3000");
})
