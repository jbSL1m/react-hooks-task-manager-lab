import React, { useState, useId, useContext } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskForm() {
  const [taskName, setTaskName] = useState("");
  const taskInputId = useId();
  const { addTask } = useContext(TaskContext);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedTaskName = taskName.trim();

    // Ignore empty submissions so the list only receives real task titles.
    if (trimmedTaskName === "") return;

    await addTask(trimmedTaskName);
    setTaskName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* useId keeps the label and input connected without manually managing a static id. */}
      <label htmlFor={taskInputId}>New Task:</label>
      <input
        id={taskInputId}
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Add a new task..."
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
