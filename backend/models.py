#All of our database models, class that represents a row in our database
from config import db
#database model represented as a python class
class Task(db.Model):
    #primary key is going to be used to index the column and each will be unique
    id = db.Column(db.Integer, primary_key=True)
    #other data that we want in each row of the table
    #when we do a string we have to give a maximum length
    task_category = db.Column(db.String(80), unique=False, nullable=False)
    start_time = db.Column(db.Integer(), unique=False, nullable=False)
    end_time = db.Column(db.Integer(), unique=False, nullable=False)
    completed = db.Column(db.Boolean(), unique=False, nullable=False)
    #first_name = db.Column(db.String(80), unique=False, nullable=False)
    #last_name = db.Column(db.String(80), unique=False, nullable=False)
    #email = db.Column(db.String(120), unique=True, nullable=False)

    #This takes the fields above and converts to python dictionary. We can then convert it to a JSON which is passable using our API
    def to_json(self):
        #returning the dictionary, converting to JSON naming convention - camel case
        return {
            "id": self.id,
            "taskCategory": self.task_category,
            "startTime": self.start_time,
            "endTime": self.end_time,
            "completed": self.completed
        }