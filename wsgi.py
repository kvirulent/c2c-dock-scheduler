# wsgi.py
# Entry point for the flask server

# Import libraries
from flask import Flask, render_template, request
import bin.scheduler as scheduler

# Create a new Flask instance
app = Flask(__name__)

# Define the index route with methods POST and GET
@app.route("/", methods=['POST', 'GET'])
def hello_world():
    # Handle POST requests (for the bay form)
    if request.method == 'POST':
        data = request.form

    # Handle GET requests
    return render_template('index.html')
