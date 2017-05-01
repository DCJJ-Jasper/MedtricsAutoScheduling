This is the repository for our project called Medtrics Automated Scheduling. The project allows the program coordinator in a medical residency program to automatically solve 90% of the schedule based on input constraint and deal with the rest 10% with a user-friendly GUI

# Installation

Most of the programs run on Python. As a result, you need to install all the Python packages. To do so, you have to use ```pip```. It is highly recommended to use ```virtualenv``` to separate your working environment from your system's default environment. To make things easier, we have also included pip ```requirements.txt```. The following commands assume that you are using a Windows machine with ```Python 3``` added to its environment path.
```
$ virtualenv env
$ source env/bin/activate
$ pip install -r requirements.txt
```