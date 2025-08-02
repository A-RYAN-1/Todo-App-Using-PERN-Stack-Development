import React, { Fragment, useState } from "react";

const InputTodo = ({ getTodos }) => {
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [category, setCategory] = useState("Personal");
  const [error, setError] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Description cannot be empty.");
      return;
    }
    if (description.trim().length < 3) {
      setError("Description must be at least 3 characters long.");
      return;
    }
    try {
      const body = { description, due_date: dueDate, priority, category };
      const response = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to add todo");
      setDescription("");
      setDueDate("");
      setPriority("Low");
      setCategory("Personal");
      setError("");
      getTodos();
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <Fragment>
      {error && (
        <p className="text-red-400 text-center mb-4 text-sm font-medium bg-red-900/50 p-2 rounded">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="text"
          className="w-full p-3 rounded-lg bg-gray-600 text-gray-200 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 placeholder-gray-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a new todo"
        />
        <input
          type="date"
          className="p-3 rounded-lg bg-gray-600 text-gray-200 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          className="p-3 rounded-lg bg-gray-600 text-gray-200 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select
          className="p-3 rounded-lg bg-gray-600 text-gray-200 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
        </select>
        <button
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 transform hover:scale-105 font-semibold"
          onClick={onSubmitForm}
        >
          Add
        </button>
      </div>
    </Fragment>
  );
};

export default InputTodo;
