# scheduler.py
# Handles scheduling data for bays
# Data is only updated when a request is made to the server

# Import Modules
from enum import Enum
from datetime import datetime as dt

# Define an Enum for ship sizes to help improve readability
class ShipSize(Enum):
    SMALL = 1
    MEDIUM = 2
    LARGE = 3

# Define a class to keep track of the docking bays
class Bay():
    def __init__(self, size: ShipSize):
        self.Size = size
        self.Schedule = [] # this[0] = time at start of occupation, this[1] = time at end of occupation

# Define the bays that we will use to track the data
# The index of each bay is immutable, so we can use the index of each bay to differentiate between them, 
# instead of tracking the index using the class, so we don't need to iterate through and find the right bay.
bays = (
    Bay(ShipSize.SMALL),
    Bay(ShipSize.SMALL),
    Bay(ShipSize.MEDIUM)
)

# Define a function to get a bay
def GetBay(index: int):
    return bays[index]

# Define a function to update bay schedules
# Start and end should be in unix epoch format
def SetBaySchedule(index: Bay | int, end: int, start: int = dt.now()):
    bay = bays[index] or bays[bays.index(index)]
    time = dt.now()

    if bay.Schedule[0] < time:
        pass # err: tried to schedule an occupation in the past

    if bay.Schedule[1] > time:
        pass # err: the bay is still occupied

    bay.Schedule[0] = start
    bay.Schedule[1] = end
    bays[bays.index(bay)] = bay