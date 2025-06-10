const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./connect_server_and_database");

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES

// Create a todo
app.post("/todos", async (req, res) => {
  const { description, due_date, priority } = req.body;
  try {
    const newTodo = await pool.query(
      "INSERT INTO todo (description, due_date, priority) VALUES ($1, $2, $3) RETURNING *",
      [description, due_date, priority || "Low"]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get all todos sorted by due_date
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query(
      "SELECT * FROM todo ORDER BY due_date ASC NULLS LAST"
    );
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, due_date, priority } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1, due_date = $2, priority = $3 WHERE todo_id = $4 RETURNING *",
      [description, due_date, priority, id]
    );
    res.json(updateTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
      [id]
    );
    res.json("Todo was deleted!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
