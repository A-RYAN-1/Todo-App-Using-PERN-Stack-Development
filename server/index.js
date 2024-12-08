const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./connect_server_and_database")

//middleware
app.use(cors());
app.use(express.json());

//ROUTES

//Create a todo
app.post("/todos", async (req,res) => {
    try 
    {
        const { description } = req.body;
        const new_todo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *",[ description]);
        res.json(new_todo.rows[0]);
    }
    catch (err)
    {
        console.error(err.message);
    }
});

//Select all todos
app.get("/todos", async (req,res) => {
    try 
    {
        const all_todos = await pool.query("SELECT * FROM todo");
        res.json(all_todos.rows);
    }
    catch (err)
    {
        console.error(err.message);
    } 
});

//Select a todo
app.get("/todos/:id", async (req,res) => {
    try
    {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE id=($1)",[id]);
        res.json(todo.rows[0]);
    }
    catch (err)
    {
        console.error(err.message);
    }
});

//Update a todo
app.get("/todos/:id", async (req,res) => {
    try
    {
        const { id } = req.params;
        const description = req.body;
        const update_todo = await pool.query("UPDATE todo SET desciption=($1) WHERE id=($2)",[description,id]);
        res.json("Todo updated");
    }
    catch (err)
    {
        console.error(err.message);
    }
});

//Delete a todo
app.update("/todos/:id", async (req,res) => {
    try
    {
        const { id } = req.params;
        const delete_todo = await pool.query("DELETE FROM todo WHERE id=($1)",[id]);
        res.json("Todo deleted");

    }
    catch (err)
    {
        console.error(err.message);
    }
});

app.listen(5000, () => {
    console.log("Server has started on port number 5000");
})