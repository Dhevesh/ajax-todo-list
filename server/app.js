const express = require("express");
const app     = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost:27017/todo_app", { useNewUrlParser : true } );
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

const todoSchema = new mongoose.Schema({
  text: String,
});

const Todo = mongoose.model("Todo", todoSchema);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.get("/todos", function(req, res){
  Todo.find({}, function(err, todos){
    if(err){
      console.log(err);
    } else {
        res.json(todos);
      } 
  });
});


app.post("/todos", function(req, res){
 req.body.todo.text = req.sanitize(req.body.todo.text);
 var formData = req.body.todo;
 Todo.create(formData, function(err, newTodo){
    if(err){
      console.log(err);
    } else {
        res.json(newTodo);
      } 
  });
});


app.put("/todos/:id", function(req, res){
 Todo.findByIdAndUpdate(req.params.id, req.body.todo, { new : true }, function(err, todo){
   if(err){
     console.log(err);
   } else {
       res.json(todo);
     }   
 });
});

app.delete("/todos/:id", function(req, res){
 Todo.findByIdAndRemove(req.params.id, function(err, todo){
   if(err){
     console.log(err);
   } else {
        res.json(todo);
      } 
 }); 
});


app.listen(3000, function() {
  console.log('Server running on port 3000');
});

// // Uncomment the three lines of code below and comment out or remove lines 84 - 86 if using cloud9
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("The server has started!");
// });
