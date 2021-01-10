const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

const items = ["Wake Up at 05:00 am"];
const workList = [];

app.get("/", (req, res) => {
  const date = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  day = date.toLocaleDateString("en-US", options);
  res.render("list", {
    header: day,
    newListItems: items
  });
})

app.get("/work", (req, res) => {
  res.render("list", {
      header : "Work List",
      newListItems: workList
  })
})



app.post("/", (req, res) => {
  let item = req.body.newItem;
  if(req.body.list == 'Work List'){
    workList.push(item);
    res.redirect("/work");
  }else{
    items.push(item);
    res.redirect("/");
  }

})

app.listen(3000, (req, res) => {
  console.log("Server is running on port 3000");
})
