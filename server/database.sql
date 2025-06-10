CREATE DATABASE store;
CREATE TABLE todo (
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(300),
    due_date DATE,
    priority VARCHAR(10) DEFAULT 'Low' CHECK (priority IN ('Low', 'Medium', 'High'))
);