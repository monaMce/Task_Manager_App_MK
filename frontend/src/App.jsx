import { useState, useEffect } from "react";
import TaskList from "./TaskList";
import "./App.css";
import TaskForm from "./TaskForm";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState({})
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchTasks(),
    fetchStats()
  }, []);

  const fetchTasks = async () => {
    const response = await fetch("http://127.0.0.1:5000/tasks");
    const data = await response.json();
    setTasks(data.tasks);
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentTask({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (task) => {
    if (isModalOpen) return
    setCurrentTask(task)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchTasks()
    fetchStats()
  }

  const fetchStats = async () => {
    const options = {
      method: "GET"
    }
    const response = await fetch("http://127.0.0.1:5000/stats", options);
    console.log("Logging fetchStats response")
    const data = await response.json();
    console.log(data)
    setStats(data.stats);
    console.log(stats)
  };

  return (
    <>
      <TaskList tasks={tasks} updateTask={openEditModal} updateCallback={onUpdate} stats={stats} />
      <button onClick={openCreateModal}>Create New Task</button>
      {isModalOpen && <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <TaskForm tasks={tasks} existingTask={currentTask} updateCallback={onUpdate} />
        </div>
      </div>
      }
    </>
  );
}

export default App;