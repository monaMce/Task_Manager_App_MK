#main configuration of our application

#building API first in flask

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#specifying location of database that we will be storing on our device
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
# We are not tracking all changes made to database
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Create instance of the database
db = SQLAlchemy(app)