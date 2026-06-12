import React, { useContext } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskList() {
  const { tasks, toggleComplete } = useContext(TaskContext);

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {/* Completed tasks get a visual state instead of separate markup. */}
          <span className={task.completed ? "completed" : ""}>
            {task.title}
          </span>
          {/* Each button updates the matching task in context and on the backend. */}
          <button
            className="complete-btn"
            data-testid={task.id}
            onClick={() => toggleComplete(task.id)}
          >
            {task.completed ? "Undo" : "Complete"}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
