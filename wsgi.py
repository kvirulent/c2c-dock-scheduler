# wsgi.py
# Entry point for the flask server

# Import libraries
from flask import Flask, render_template, request, jsonify
from json import dumps, loads
from datetime import datetime as dt
import secrets
import bin.scheduler as scheduler

# Create a new Flask instance, set the app's secret key
app = Flask(__name__)
app.secret_key = secrets.token_urlsafe(16)
server_time = 0

# Function to bundle data into JSON for network transfer
def ajax_response(data: dict[any,any],headers: dict[str, any], status: int, error: str = None):
    if error:
        response = jsonify({"error":error})
        response.status_code = status
        return response
    try:
        response = jsonify(data)
        response.error = error
        for i in enumerate(headers):
            response.headers[i]
        response.status_code = status
        return response
    except Exception as e:
        print(str(e))
        response = jsonify({"error":"No Context Provided"})
        response.status_code = 500
        return response

# Pages

# Returns the index page
@app.route("/", methods=['GET'])
def index():

    # Handle GET requests
    return render_template('index.html',bays=scheduler)

# API Routes
# Returns current server time 
@app.route("/scheduler/get_server_time", methods=['GET'])
def get_server_time():
    return ajax_response({"time":dt.now().hour},{}, 200)

# Returns the requested bay
@app.route("/scheduler/get_hydrate_data", methods=['GET'])
def get_hydrate_data():
    try:
        bay_id = int(request.args.get("bay_id"))
    except:
        return ajax_response({},{},400,"Malformed Identifier")

    bay = scheduler.GetBay(bay_id)
    if not bay:
        return ajax_response({},{},404,"Bay Not Found")
    
    return ajax_response({"bay":bay.jsonify()},{},200)

# Returns all bays
@app.route("/scheduler/get_all_bays", methods=['GET'])
def get_all_bays():
    bays = scheduler.bays.copy()
    for i,v in enumerate(bays):
        bays[i] = v.jsonify()
    

    return ajax_response({"bays":bays},{},200)

# Sets the requested bay's schedule
@app.route("/scheduler/set_schedule", methods=['POST'])
def set_schedule():
    data = request.json
    if "bay_id" not in data:
        return ajax_response({},{},400,"Identifier Not Provided")
    
    if "schedule" not in data:
        return ajax_response({},{},400,"Schedule Not Provided")
    
    bay_id = data["bay_id"]
    bay = scheduler.GetBay(bay_id)
    if not bay:
        return ajax_response({},{},404,"Bay Not Found")
    
    try:
        for _,sch in enumerate(bay.Schedule):
            if (sch[0] < data["schedule"][0] and sch[1] > data["schedule"][0]) or (sch[0] < data["schedule"][1] and sch[1] > data["schedule"][1]):
                return ajax_response({},{},400,"Schedule Conflict")
    except:
        return ajax_response({},{},400,"Malformed Schedule Data")
    try:
        scheduler.SetBaySchedule(bay_id, data["schedule"][1], data["schedule"][0])
    except:
        return ajax_response({},{},500,"Scheduler Error")
    
    return ajax_response({},{},200)

# Run the flask server
if __name__ == '__main__':
    app.run()