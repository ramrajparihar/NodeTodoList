const express = require("express");
const app = express();

app.set('view engine','ejs');
app.use('/static',express.static('public'))
//app.use(express.urlencoded({ extended: true }));
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const dotenv = require('dotenv')

dotenv.config();
const mongoose = require("mongoose");
//connection to db
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
console.log("Connected to db!");

});
const TodoTask = require("./models/TodoTask");


app.get('/',(req,res)=>{
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks,
        name:"RAMRAJ" });
        });
    // res.render('todo.ejs',{
    // name: "ramraj"
    // });
   // res.send('Hello from server');
})



app.post('/',async(req,res)=>{

    const todoTask = new TodoTask({
        content: req.body.content
        });
        try {
        await todoTask.save();
        res.redirect("/");
        } catch (err) {
        res.redirect("/");
        }
})

app.route("/edit/:id").get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

app.route("/delete/:id").get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndRemove(id, (err) => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });


app.listen('8080',()=>console.log('Server up and running..'));