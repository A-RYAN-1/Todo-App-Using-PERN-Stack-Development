import React, { Fragment, useState } from "react";
import EditTodo from "./EditTodo";

const ListTodos = ({ todos, getTodos }) => {
  const [editingTodoId, setEditingTodoId] = useState(null);

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete todo");
      getTodos();
    } catch (err) {
      console.error(err.message);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
      default:
        return "bg-green-500";
    }
  };

  const getDueStatus = (dueDate, completed) => {
    if (!dueDate || completed) return { isOverdue: false, isDueSoon: false };
    const due = new Date(dueDate);
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const diff = (due - now) / oneDay;
    return {
      isOverdue: due < now,
      isDueSoon: diff > 0 && diff <= 1,
    };
  };

  return (
    <Fragment>
      <div className="mt-6">
        {todos.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <i className="fas fa-tasks text-4xl mb-4 opacity-50"></i>
            <p className="text-lg font-medium">No todos yet. Add one above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo, index) => {
              const { isOverdue, isDueSoon } = getDueStatus(
                todo.due_date,
                todo.completed
              );
              const isEditing = editingTodoId === todo.todo_id;
              return (
                <div
                  key={todo.todo_id}
                  className={`flex items-center justify-between p-4 rounded-lg hover-scale slide-in ${
                    isOverdue ? "bg-red-900/50" : "bg-gray-800"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {isEditing ? (
                    <EditTodo
                      todo={todo}
                      getTodos={getTodos}
                      setEditingTodoId={setEditingTodoId}
                      isEditing={isEditing}
                    />
                  ) : (
                    <>
                      <div className="flex items-center gap-3 flex-1">
                        <p
                          className={`text-gray-200 text-base font-medium ${
                            todo.completed ? "line-through text-gray-400" : ""
                          }`}
                        >
                          {todo.description}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {todo.due_date
                            ? todo.due_date.split("T")[0]
                            : "No Due Date"}
                        </p>
                        <span
                          className={`text-xs px-3 py-1 rounded-full text-white font-medium ${getPriorityColor(
                            todo.priority
                          )}`}
                        >
                          {todo.priority}
                        </span>
                        {isDueSoon && !isOverdue && (
                          <span className="text-xs px-3 py-1 rounded-full bg-orange-500 text-white font-medium">
                            Due Soon
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 hover-scale text-sm font-medium"
                          onClick={() => setEditingTodoId(todo.todo_id)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 hover-scale flex items-center gap-2 text-sm font-medium"
                          onClick={() => deleteTodo(todo.todo_id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default ListTodos;
