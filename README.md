# How to run
- Download the code by cloning it: ``git clone git@github.com:kvirulent/c2c-dock-scheduler.git``
- Create a virtual environment in the folder: ``python -m venv .venv``
- Navigate into and activate the environment: ``cd .venv/scripts | activate``
- Navigate back to the main folder: ``cd ../..``
- Install dependencies: ``pip install -r requirements.txt``
- Run the development server: ``flask run``
- Navigate to localhost:5000 to view the web page

# What is this
This is a web app built with flask for the Code2College November coding challenge. 
It's goal is to allow users to schedule ship docking at a space port/station.

# Development goals
- Create a map and position bay interaction buttons properly
- Implement scheduling backend
- Fill out the scheduling modal
  - Display already-scheduled hours and prevent users from creating scheduling conflicts
  - Display unscheduled hours and allow users to schedule those times
