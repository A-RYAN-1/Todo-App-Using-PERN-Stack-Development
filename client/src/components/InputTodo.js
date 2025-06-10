import React, { Fragment, useState } from "react";

const InputTodo = ({ getTodos }) => {
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
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
      const body = { description, due_date: dueDate, priority };
      const response = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to add todo: ${response.status} - ${errorText}`
        );
      }
      const data = await response.json();
      if (!data) {
        throw new Error("No data returned from server.");
      }
      setDescription("");
      setDueDate("");
      setPriority("Low");
      setError("");
      getTodos();
    } catch (err) {
      console.error("Error in InputTodo:", err.message);
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <Fragment>
      <h1 className="text-4xl font-semibold text-center mb-8 text-white tracking-wide">
        Todo List
      </h1>
      {error && (
        <p className="text-red-400 text-center mb-4 text-sm font-medium">
          {error}
        </p>
      )}
      <div className="flex justify-center items-center gap-4 mb-8">
        <input
          type="text"
          className="w-full max-w-md p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base placeholder-gray-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a new todo"
        />
        <input
          type="date"
          className="p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          className="p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 hover-scale flex items-center gap-2 text-base font-medium"
          onClick={onSubmitForm}
        >
          <i className="fas fa-plus"></i> Add
        </button>
      </div>
    </Fragment>
  );
};

export default InputTodo;
