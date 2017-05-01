This is the repository for our project called Medtrics Automated Scheduling. The project allows the program coordinator in a medical residency program to automatically solve 90% of the schedule based on input constraint and deal with the rest 10% with a user-friendly GUI

# Installation

## Python

Most of the programs run on Python. As a result, you need to install all the Python packages. To do so, you have to use ```pip```. It is highly recommended to use ```virtualenv``` to separate your working environment from your system's default environment. To make things easier, we have also included pip ```requirements.txt```. The following commands assume that you are using a Windows machine with ```Python 3``` added to its environment path.
```
$ virtualenv env
$ source env/bin/activate
$ pip install -r requirements.txt
```

If you wish to install dependencies separately, here are the following necessary libraries to run the project

* ```Flask==0.11.1```
* ```numpy==1.12.0```
* ```Pillow==3.3.0```
* ```ortools==5.1.4045```
* ```pyglet==1.2.4``` (Optional)

## JavaScript

All JavaScript code necessary should already be included in the ```js``` folder. For future updates, here is a list of JS libraries used in the project

* ```jQuery```: For interaction with HTML elements
* ```PIXI.js```: For efficient rendering of graphic elements

# Running the software

In order to run the software, you need to run ```Visualization test.py``` file. This will open a local host server at port 5000. Then visit http://localhost:5000/ to use the software

# Running python visualization

For developers wishing to improve the existing algorithm in python, we also have a python visualization version so that developers don't need to run the server all the time. To run this, developers need to install ```pyglet``` library mentioned above.

Simply run ```Main.py``` to visualize a schedule. ```Constants.py``` should contains all information necessary about the scheduling problem.

There is a ```DEBUG_MODE``` boolean variable inside ```Constants.py``` for those who wish to show some debugging information about the schedule.

# Data format

(To be written)
