# Entry point for the flask server

# Import libraries
from flask import Flask, render_template, request, jsonify
from json import dumps, loads
from datetime import datetime as dt
import secrets
import traceback
import bin.scheduler as scheduler

# Create a new Flask instance, set the app's secret key
app = Flask(__name__)
app.secret_key = secrets.token_urlsafe(16)

# Function to bundle data into JSON for network transfer
def ajax_response(data: dict[any,any],headers: dict[str, any], status: int, error: str = None):
    if error: # Return an error if an error was produced
        response = jsonify({"error":error})
        response.status_code = status
        return response
    try: # Attempt to return the data
        response = jsonify(data)
        response.error = error
        for i in enumerate(headers):
            response.headers[i]
        response.status_code = status
        return response
    except Exception as e: # Return an error if the response fails to construct
        print(str(e))
        response = jsonify({"error":"Internal Server Error"})
        response.status_code = 500
        return response

# Pages
# Returns the index page
@app.route("/", methods=['GET'])
def index():
    return render_template('index.html',bays=scheduler.bays)

# API Routes
# Returns current server time 
@app.route("/scheduler/get_server_time", methods=['GET'])
def get_server_time():
    return ajax_response({"time":dt.now().hour},{}, 200)

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
    if "bay_id" not in data: # Check if the bay identifier was provided
        return ajax_response({},{},400,"Identifier Not Provided")
    
    if "schedule" not in data: # Check if the schedule was provided
        return ajax_response({},{},400,"Schedule Not Provided")
    
    bay_id = int(data["bay_id"])
    bay = scheduler.GetBay(bay_id)
    if not bay: # Check if the bay identifier is valid
        return ajax_response({},{},404,"Bay Not Found")
    
    # Define a function to check for schedule conflicts
    def range_overlap(r1,r2):
        for n in range(int(r1[0]), int(r1[1])):
            if n in range(int(r2[0]), int(r2[1])):
                return True
            
        return False
    
    if bay.Schedule: # Check for schedule conflicts
        try:
            for _,sch in enumerate(bay.Schedule):
                if range_overlap(sch, data['schedule']): # Return an error if a schedule conflict was found
                    return ajax_response({},{},409,"Schedule Conflict")
        except: # Return an error if a schedule comparison failed to be made
            print(traceback.format_exc())
            return ajax_response({},{},400,"Malformed Schedule Data")
        
    try: # Attempt to update the scheduler
        scheduler.SetBaySchedule(bay_id, data["schedule"][1], data["schedule"][0])
    except: # Return an error if the scheduler fails to update
        return ajax_response({},{},500,"Scheduler Error")
    
    # Return a 200 OK response
    return ajax_response({},{},200)

# Run the flask server
if __name__ == '__main__':
    app.run()