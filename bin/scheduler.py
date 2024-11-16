# scheduler.py
# Handles scheduling data for bays
# Data is only updated when a request is made to the server

# Import Modules
from enum import Enum
from datetime import datetime as dt

# Define an Enum for ship sizes to help improve readability

# Define a class to keep track of the docking bays
class Bay():
    def __init__(self, size: str):
        self.Size = size
        self.Schedule = []

    # Return a JSON object for network transfer
    def jsonify(self):
        return {"id":bays.index(self), 'size':self.Size, 'schedule':self.Schedule}

# Define the bays that we will use to track the data
# The index of each bay is immutable, so we can use the index of each bay to differentiate between them, 
# instead of tracking the index using the class, so we don't need to iterate through and find the right bay.
bays = [
    Bay("small"),
    Bay("small"),
    Bay("medium")
]

# Define a function to get a bay
def GetBay(index: int):
    try:
        return bays[index]
    except IndexError:
        return None

# Define a function to update bay schedules
# Start and end should be in unix epoch format
def SetBaySchedule(index: Bay | int, end: int, start: int = dt.now()):
    bay = bays[index] or bays[bays.index(index)]

    bay.Schedule[0] = start
    bay.Schedule[1] = end
    bays[bays.index(bay)] = bay