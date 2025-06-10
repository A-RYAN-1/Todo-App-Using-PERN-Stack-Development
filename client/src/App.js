import React, { useState, useEffect } from "react";
import "./App.css";
import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const getTodos = async () => {
    try {
      const response = await fetch("http://localhost:5000/todos");
      const jsonData = await response.json();
      setTodos(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPriority =
      priorityFilter === "All" || todo.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="container">
      <InputTodo getTodos={getTodos} />
      <div className="flex justify-between items-center gap-4 mb-6">
        <input
          type="text"
          className="w-full max-w-sm p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search todos..."
        />
        <select
          className="p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <ListTodos todos={filteredTodos} getTodos={getTodos} />
    </div>
  );
};

export default App;
