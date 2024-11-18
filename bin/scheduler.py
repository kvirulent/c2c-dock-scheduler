# Handles scheduling data for bays

# Import Modules
from enum import Enum
from datetime import datetime as dt
import random
import traceback

# Define a class to keep track of the docking bays
class Bay():
    def __init__(self, schedule: list, size: str):
        self.Size = size
        self.Schedule = schedule

    # Return a JSON object for network transfer
    def jsonify(self):
        return {"id":bays.index(self), 'size':self.Size, 'schedule':self.Schedule}

# Define a function to generate a randomized set of schedules
def seed():
    bay_seed_list = []
    bay_qty = random.randint(7,14)

    def range_overlap(r1,r2):
        for n in range(int(r1[0]), int(r1[1])):
            if n in range(int(r2[0]), int(r2[1])):
                return True
            
        return False
    
    def get_unique_sch(sch_qty):
        seed_schedules = []
        attempts = 0
        max_attempts = sch_qty * 10

        for _ in range(0,sch_qty+1):
            start = random.randint(0,25)
            end = random.randint(0,25)

            if start > end:
                start, end = end, start

            sch = [start, end]
            
            if not any(range_overlap(sch, existing) for existing in seed_schedules):
                seed_schedules.append(sch)

            attempts += 1
            if attempts > max_attempts:
                seed_schedules.append([])
                continue

        return seed_schedules

    for _ in range(0,bay_qty+1):
        bay_schedules = get_unique_sch(random.randint(0,2))
        bay_size = ["small", "medium", "large"][random.randint(0,2)]
        bay_seed_list.append(Bay(bay_schedules, bay_size))

    return bay_seed_list
        
# Define the bays that we will use to track the data
bays = [Bay([], ["small","medium","large"][random.randint(0,2)]) for _ in range(random.randint(6,14))]

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
    bay.Schedule.append([start,end])