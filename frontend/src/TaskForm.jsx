import { useState } from "react";

const TaskForm = ({ tasks, existingTask = {}, updateCallback }) => {
    const [taskCategory, setTaskCategory] = useState(existingTask.taskCategory || "");
    const [startTime, setStartTime] = useState(existingTask.startTime || "");
    const [endTime, setEndTime] = useState(existingTask.endTime || "");
    const [completed, setCompleted] = useState(existingTask.completed || "")

    let categories = new Set()
    let categoryArray = []
    let thisValue = false

    const updating = Object.entries(existingTask).length !== 0

    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            taskCategory,
            startTime,
            endTime,
            completed
        }
        const url = "http://127.0.0.1:5000/" + (updating ? `update_task/${existingTask.id}` : "create_task")
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } else {
            updateCallback()
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="taskCategory">Choose a task:</label>
                <input list="tasks" id="taskCategory" name="taskCategory" value={taskCategory} onChange={(e) => setTaskCategory(e.target.value)}/>
                <datalist id="tasks">
                    {tasks.map((task) => (
                        categories.add(task.taskCategory)
                    ))}
                    <script>
                        {categoryArray = Array.from(categories)}
                    </script>
                    {categoryArray.map((category)=>(
                        <option value={category} key={category}>{category}</option>
                    ))}
                </datalist>
            </div>
            <div>
                <label htmlFor="startTime">Choose a start time for your task:</label>
                <input 
                    type="time" 
                    id="startTime" 
                    name="startTime" 
                    min="00:00" 
                    max="23:59" 
                    required 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="endTime">Choose an end time for your task:</label>
                <input 
                    type="time" 
                    id="endTime" 
                    name="endTime" 
                    min="00:00" 
                    max="23:59" 
                    required 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="completed">Check this box if you've already completed the task you are adding</label>
                <input 
                    type="checkbox" 
                    id="completed" 
                    name="completed" 
                    value="True"
                />
            </div>
            <button 
            type="submit"
            onClick={(e) => {
                if(document.getElementById("completed").checked){
                    thisValue = true
                }else{
                    thisValue = false
                }
                setCompleted(thisValue)
            }}
            >{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default TaskForm