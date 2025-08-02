const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./connect_server_and_database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());

// Secret for JWT
const JWT_SECRET =
  "7d6f6832d1a286d2e338aa8904bd9c50ec6f6e4561d32d5d9c125100dd6e6b2f";

// Register User
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log("Register attempt:", { username, password }); // Add this line
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    console.log("User created:", newUser.rows[0]); // Add this line
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error("Registration error:", err.message); // Add this line
    res.status(500).send("Server Error");
  }
});

// Login User
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (user.rows.length === 0) return res.status(400).send("User not found");
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(400).send("Invalid password");
    const token = jwt.sign({ id: user.rows[0].user_id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied");
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
};

// Create a todo (protected route)
app.post("/todos", authenticateToken, async (req, res) => {
  const { description, due_date, priority, category } = req.body;
  console.log("Add todo attempt:", {
    description,
    due_date,
    priority,
    category,
    user_id: req.user.id,
  });
  try {
    const newTodo = await pool.query(
      "INSERT INTO todo (user_id, description, due_date, priority, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user.id, description, due_date, priority || "Low", category]
    );
    console.log("Todo created:", newTodo.rows[0]);
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error("Todo creation error:", err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/todos", authenticateToken, async (req, res) => {
  console.log("Fetch todos attempt for user:", req.user.id);
  try {
    const allTodos = await pool.query(
      "SELECT * FROM todo WHERE user_id = $1 ORDER BY due_date ASC NULLS LAST",
      [req.user.id]
    );
    console.log("Todos fetched:", allTodos.rows);
    res.json(allTodos.rows);
  } catch (err) {
    console.error("Todo fetch error:", err.message);
    res.status(500).send("Server Error");
  }
});

// Update a todo (protected route)
app.put("/todos/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, due_date, priority, category, completed } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1, due_date = $2, priority = $3, category = $4, completed = $5 WHERE todo_id = $6 AND user_id = $7 RETURNING *",
      [description, due_date, priority, category, completed, id, req.user.id]
    );
    res.json(updateTodo.rows[0]);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Delete a todo (protected route)
app.delete("/todos/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );
    res.json("Todo was deleted!");
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Export todos
app.get("/export", authenticateToken, async (req, res) => {
  try {
    const todos = await pool.query("SELECT * FROM todo WHERE user_id = $1", [
      req.user.id,
    ]);
    res.json(todos.rows);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Import todos
app.post("/import", authenticateToken, async (req, res) => {
  const { todos } = req.body;
  try {
    for (let todo of todos) {
      await pool.query(
        "INSERT INTO todo (user_id, description, due_date, priority, category, completed) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          req.user.id,
          todo.description,
          todo.due_date,
          todo.priority,
          todo.category,
          todo.completed,
        ]
      );
    }
    res.send("Todos imported successfully");
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
