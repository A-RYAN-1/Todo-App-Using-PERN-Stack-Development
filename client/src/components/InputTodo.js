import React, { Fragment, useState } from "react";

const InputTodo = () => {
  const [description, setDescription] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { description };
      const response = await fetch("https://todo-app-using-pern-stack-development.onrender.com/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5 text-primary">Todo List</h1>
      <form
        className="d-flex mt-5 justify-content-center"
        onSubmit={onSubmitForm}
      >
        <input
          type="text"
          className="form-control w-50 mr-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a new todo"
        />
        <button className="btn btn-success px-4 py-2">
          <i className="fas fa-plus-circle"></i> Add
        </button>
      </form>
    </Fragment>
  );
};

export default InputTodo;
