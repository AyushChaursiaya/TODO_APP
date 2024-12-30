import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.scss'; 

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch tasks from the backend
    axios.get('http://localhost:5000/tasks').then((response) => {
      setTasks(response.data);
    });
  }, []);

  const addTask = () => {
    if (newTask) {
      axios.post('http://localhost:5000/tasks', { text: newTask }).then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask('');
      });
    }
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`).then(() => {
      setTasks(tasks.filter((task) => task._id !== id));
    });
  };

  const toggleDone = (id) => {
    axios.put(`http://localhost:5000/tasks/${id}`).then((response) => {
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    });
  };

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      <h1>Things to do:</h1>

      {/* Search Input */}
      <div className="search">
        <input
          type="text"
          placeholder="Search a task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>🔍</button>
      </div>

      {/* Add Task Input */}
      <div className="add-task">
        <input
          type="text"
          placeholder="Enter new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Tasks List */}
      <div className="task-list">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className={`task ${task.done ? 'done' : 'pending'}`}
          >
            <span>{task.text}</span>
            <div className="actions">
              <button className="done" onClick={() => toggleDone(task._id)}>
                ✔️
              </button>
              <button className="delete" onClick={() => deleteTask(task._id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
