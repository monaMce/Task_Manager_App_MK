import React from "react"

const TaskList = ({ tasks, updateTask, updateCallback, stats }) => {
    
    let completedTasks = []
    let plannedTasks = []
    let setDay = "2024-07-31"
    let dayTasks = []
    let rowIDs = []
    let statKeys = []

    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_task/${id}`, options)
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
    }

    const onDateUpdate = async(dateValue) =>{
        try{
            const options = {
                method: "POST"
            }
            try{
                //Grab the date that was filtered to
                document.getElementById("day").value = dateValue
                setDay = dateValue
                document.getElementById("setDate").innerText = dateValue

                //compile lists of tasks for that day
                tasks.map((task)=>{
                    if(task.date === dateValue){
                        dayTasks.push(task)
                        rowIDs.push(task.id)
                        //console.log(dayTasks)
                    }else if(dayTasks.includes(task)){
                        dayTasks.pop(task)
                    }
                })

                //compare all planned tasks to those for today's date, hide and unhide appropriate tasks
                let plannedTable = document.getElementById("plannedTbody")
                let tableLength = plannedTable.rows.length 
                for (let i = 0; i < tableLength; i++){
                    let rowID = plannedTable.getElementsByTagName("tr")[i].id
                    if(!(rowIDs.includes(Number(rowID)))){
                        plannedTable.getElementsByTagName("tr")[i].style.display = 'none' 
                    }else{
                        plannedTable.getElementsByTagName("tr")[i].style.display = ''
                    }
                }

                //compare all planned tasks to those for today's date, hide and unhide appropriate tasks
                let completedTable = document.getElementById("completedTbody")
                tableLength = completedTable.rows.length 
                for (let i = 0; i < tableLength; i++){
                    let rowID = completedTable.getElementsByTagName("tr")[i].id
                    if(!(rowIDs.includes(Number(rowID)))){
                        completedTable.getElementsByTagName("tr")[i].style.display = 'none' 
                    }else{
                        completedTable.getElementsByTagName("tr")[i].style.display = ''
                    }
                }

                //hide all stat rows except the row selected
                let statsTable = document.getElementById("statsTbody")
                tableLength = statsTable.rows.length
                for (let i = 0; i < tableLength; i++){
                    let rowID = statsTable.getElementsByTagName("tr")[i].id
                    if (rowID === dateValue){
                        statsTable.getElementsByTagName("tr")[i].style.display = ''
                    }else{
                        statsTable.getElementsByTagName("tr")[i].style.display = 'none'
                    }
                    
                }

                updateCallback()
            }catch{
                console.error("Failed to update with date")
                alert(error)
            }

        }catch(error){
            alert(error)
        }
    }

    return <div>
        <div>
            <label htmlFor="day">Task List for Day:</label>
            <input
                type="date"
                id="day"
                name="day"
                min="2024-07-01" 
                max="2045-12-31"
                onChange={(e)=>{
                    console.log(document.getElementById("day").value)
                    onDateUpdate(document.getElementById("day").value)
                }}
            />
            <h3 id="setDate"></h3>
         
        </div>
        <h2>Planned Tasks</h2>
        <table id="plannedTasksTable">
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="plannedTbody">
                { tasks.map((task)=>{
                    if(task.completed){
                        completedTasks.push(task)
                    }else{
                        plannedTasks.push(task)
                    }
                })}
                {plannedTasks.map((task) => (
                    <tr key={task.id} id={task.id}>
                        <td>{task.taskCategory}</td>
                        <td>{task.startTime}</td>
                        <td>{task.endTime}</td>
                        <td>
                            <button onClick={() => updateTask(task)}>Update</button>
                            <button onClick={() => onDelete(task.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <h2>Completed Tasks</h2>
        <table id="completedTasksTable">
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="completedTbody">
                {completedTasks.map((task) => (
                    <tr key={task.id} id={task.id}>
                        <td>{task.taskCategory}</td>
                        <td>{task.startTime}</td>
                        <td>{task.endTime}</td>
                        <td>
                            <button onClick={() => updateTask(task)}>Update</button>
                            <button onClick={() => onDelete(task.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <h2>Stats</h2>
        <table>
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Percent Completion</th>
                </tr>
            </thead>
            <tbody id="statsTbody">
                <script>
                    {statKeys = Object.keys(stats)}
                </script>
                {statKeys.map((key) => (
                    <tr id={key}>
                        <td>{key}</td>
                        <td>{stats[key]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default TaskList