import React, { createContext, useEffect, useMemo, useState } from "react";

export const TaskContext = createContext();

const API_URL = "http://localhost:6001/tasks";

export function TaskProvider({ children }) {
	const [tasks, setTasks] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	// Load the initial task list once so every component can read from shared state.
	useEffect(() => {
		fetch(API_URL)
			.then((response) => response.json())
			.then((data) => {
				// Merge server data with local changes so a late fetch does not overwrite user updates.
				setTasks((currentTasks) => {
					if (currentTasks.length === 0) {
						return data;
					}

					const existingIds = new Set(currentTasks.map((task) => task.id));
					const mergedTasks = [...currentTasks];

					data.forEach((task) => {
						if (!existingIds.has(task.id)) {
							mergedTasks.push(task);
						}
					});

					// Persist a new task on the server, then append the created record to context state.
					return mergedTasks;
				});
			});
	}, []);

	async function addTask(taskTitle) {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ title: taskTitle, completed: false }),
		});

		const createdTask = await response.json();
		setTasks((currentTasks) => [...currentTasks, createdTask]);
	}

	// Toggle the completion state in both the backend and the in-memory task list.
	async function toggleComplete(taskId) {
		const task = tasks.find((currentTask) => currentTask.id === taskId);

		if (!task) {
			return;
		}

		const response = await fetch(`${API_URL}/${taskId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ completed: !task.completed }),
		});

		const updatedTask = await response.json();
		setTasks((currentTasks) =>
			currentTasks.map((currentTask) =>
				currentTask.id === taskId ? updatedTask : currentTask
			)
		);
	}

	// Keep filtering inside context so every consumer sees the same search results.
	const filteredTasks = useMemo(() => {
		const normalizedSearch = searchTerm.toLowerCase();

		return tasks.filter((task) =>
			task.title.toLowerCase().includes(normalizedSearch)
		);
	}, [tasks, searchTerm]);

	return (
		<TaskContext.Provider
			value={{
				tasks: filteredTasks,
				addTask,
				toggleComplete,
				setSearchTerm,
			}}
		>
			{children}
		</TaskContext.Provider>
	);
}
