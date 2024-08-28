# main endpoints (any url that comes after the domain)
#This file handles our API 
#Requests are what we send to the API
# - Gets (trying to get info)
# - Posts (trying to create something new)
# - Put/Patch (trying to update something that already exists)
# - Delete (trying to delete something that already exists)
# On Requests, we send the relevant data in JSON format
# Then we get Response that contains:
# - Status (was the request successful)
# - Json (information that the request was asking for in appropriate format)

#create

# - first name
# - last name
# - email


#Read
#Update
#Delete


from flask import request, jsonify
from config import app, db
from models import Task


@app.route("/tasks", methods=["GET"])
def get_tasks():
    #gives us a list of all the different contacts in python objects (contact objects)
    tasks = Task.query.all()

    #calls to_json for each task in tasks (x) and returns each result of this method in a map that we then convert into a list
    #to_json returns a python dictionary that can be converted into a json
    json_tasks = list(map(lambda x: x.to_json(), tasks))

    #converts the list of python dictionaries into jsons
    return jsonify({"tasks": json_tasks})


@app.route("/create_task", methods=["POST"])
def create_task():
    task_category = request.json.get("taskCategory")
    start_time = request.json.get("startTime")
    end_time = request.json.get("endTime")
    completed = request.json.get("completed")
    date = request.json.get("date")

    temp_start = int(start_time.replace(":", ""))
    temp_end = int(end_time.replace(":", ""))

    if not task_category or not start_time or not end_time or not date:
        return (
            jsonify({"message": "You must include a task category, start time, end time, completion status, and date"}),
            400,
        )
    if temp_end < temp_start:
        return (
            jsonify({"message": "Please pick an end time after your start time"}),
            400,
        )

    new_task = Task(task_category=task_category, start_time=start_time, end_time=end_time, completed=completed, date=date)
    try:
        #makes new contact read to write into the database
        db.session.add(new_task)
        #writes into the database permanently
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "User created!"}), 201

#Need to know what contact we are updating and content to update with
@app.route("/update_task/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    #find the user with the passed in ID
    task = Task.query.get(task_id)

    #if there is no user with that id
    if not task:
        return jsonify({"message": "Task not found"}), 404

    #data holds the python dictionary
    data = request.json

    #edit python dictionary at key "firstName" with the first_name passed in by the query
    task.task_category = data.get("taskCategory", task.task_category)
    task.start_time = data.get("startTime", task.start_time)
    task.end_time = data.get("endTime", task.end_time)
    task.completed = data.get("completed", task.completed)
    task.date = data.get("date", task.date)

    #Don't need to add to session because this contact already existed
    #commits the changes to the database session
    db.session.commit()

    return jsonify({"message": "Task updated."}), 200


@app.route("/delete_task/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"message": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted!"}), 200

@app.route("/stats", methods=["GET"])
def get_stats():
    tasks = Task.query.all()
    planned_days = {}
    completed_days = {}
    stats = {}
    for task in tasks:
        numerical_end_time = (int(task.end_time[:2])*60) + int(task.end_time[3:])
        numerical_start_time = (int(task.start_time[:2])*60) + int(task.start_time[3:])
        if task.completed:
            #completed
            if task.date not in completed_days.keys():
                completed_days[task.date] = {}

            if task.task_category not in completed_days[task.date].keys():
                completed_days[task.date][task.task_category] = (numerical_end_time - numerical_start_time)
            else:
                completed_days[task.date][task.task_category] += (numerical_end_time - numerical_start_time)
        else:
            #planned
            if task.date not in planned_days.keys():
                planned_days[task.date] = {}

            if task.task_category not in planned_days[task.date].keys():
                planned_days[task.date][task.task_category] = (numerical_end_time - numerical_start_time)
            else:
                planned_days[task.date][task.task_category] += (numerical_end_time - numerical_start_time)
    for day, planned_tasks in planned_days.items():
        accuracy_score = float(0)
        count = 0
        for task in planned_tasks:
            if day in completed_days.keys():
                if task in completed_days[day]:
                    task_completion_rate = float(completed_days[day][task] / planned_days[day][task])
                else:
                    task_completion_rate = 0
                accuracy_score += task_completion_rate
            count +=1
        accuracy_score = float(accuracy_score / count)
        stats[day] = round(accuracy_score, 2) * 100
    message = {
        "status": 200,
        "stats": stats
    }
    json_stats = jsonify(message)
    return json_stats



# makes sure we aren't running the file if we just import it rather than specifically choosing to run it
if __name__ == "__main__":
    with app.app_context():
        #create all the models defined in database that aren't already created.
        db.create_all()

    app.run(debug=True)