# Medtrics Automated Scheduling
## Team JAST: Jasper Ding, AC Li, Son Pham, Tung Phan
## Bucknell University Computer Science Engineering Senior Design CSCI475/476
## Professor Brian King

# Abstract
The client for our senior design project is Medtrics - a medical residency management software company based in Lewisburg, PA.
We engineered a software to solve medical residency rotation scheduling problems, transforming six weeks of mental work to seconds of automatic processing.

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

# File structure

* ```data```: This folder contains two example files called ```medtrics_problem.txt``` and ```yale_program.txt```, which can be used as sample problems for the GUI.
* ```docs```: Contain two manuals:
    * A User Manual that details how each feature is completed and details general problems for incompleted feature.
    * A Technical Manua that detailed the technique involved in executing the project
* ```node_modules```: Contains original JavaScript libraries used in the project.
* ```static```:
    * ```css```: Contains stylesheet
    * ```images```: Some image elements for the GUI such as favicon, image loader, Medtrics logo.
    * ```js```: JavaScript files. The 5 main files are ```Class.js```, ```Constants.js```, ```Helper.js```, ```Utility.js```, ```Visualization.js```. The rest are JS libraries.
* ```templates```: Contain the HTML file to be served by the server

```Class.py```, ```Constants.py```, ```Helper.py```, ```SolverUtil.py```, ```Visualization test.py``` are the Python codes for the scheduling server. 

```requirements.txt``` contains all python requirements and allow for quick installation.

# Data format
In order to make our program 'understand' the data you uploaded, please upload files that follow this kind of format:

On the first line, please indicate the number of blocks and the program's name in the format below.
```
Program,Psychiatry,13
```
On the next line, please specify what each column contains in the format below:
```
USER_ID,FIRST_NAME,LAST_NAME
```
After the first two lines, you can start inputing all the trainees. Remember to input trainees separately based on their roles. Before you start input trainees of different roles, please specify the number of trainees of a certain role:
```
Num_PGY1,40
```
Now you can input all the trainees of this role:
```
1,Santhosh,Cherian
2,Ron,Rivera
3,Todd,Wilkinson
4,Mary,Renner
5,Randy,Moss
6,Chris,Tokodi
7,Grant,Fuhr
8,Fred,Marston
9,Dodie,Woodman
10,Edie,Ballin
11,Christine,Weible
12,Corina,Colwell
13,Corrin,Ingersoll
14,Soledad,Levey
15,Ron,Dhillon
16,Eileen,Telford
17,In,Trimpe
18,Larisa,Owen
19,Gaynell,Vanleuven
20,Milagros,Tanner
21,Mila,Span
22,Patrina,Pettaway
23,Takako,Jarrells
24,Jenee,Lach
25,Santina,Gwynn
26,Alisia,Durbin
27,Carolyne,Backes
28,Reyes,Turberville
29,Mignon,Jesus
30,Carina,Milbourn
31,Erick,Mines
32,Timothy,Boyes
33,Dorothea,Steckler
34,Tony,Rizzio
35,Roxann,Schwanbeck
36,Fran,Schifo
37,Tawna,Roehrs
38,Evelynn,Sharp
39,Tawana,Vonbank
40,Tung,Phan
```
The same format applies to all roles.

After inputting all the trainees, please use a line of dashes to separate the sections below so our program know you are done with inputting all the trainees. Then you can start inputting all the rotations' information by following the following format (please specify the number of rotations in the first line):
```
---
Num_rotations,8
ROTATION_ID, ROTATION,WORK_WITH_ALLOWED_VACATION,MINIMUM_BLOCK_LENGTH,MAX_BLOCKS_PER_YEAR,TYPE
0,Ambulatory Medicine Blocks,Yes,0.25,6,Core
1,Backup Staffing / Urgent Visit,No,1,6,Core
2,Coronary Care Unit,Yes,1,6,Core
3,Elective,No,0.25,1,Core
4,Emergency Medicine,No,1,6,Core
5,Inpatient Wards,No,1,6,Core
6,Medical Intensive Care Unit,No,0.5,6,Core
7,Neurology,Yes,1,6,Core
```
Next, please input the workforce requirements of all the rotations (please specify the number of rotations in the first line). MIN12 means the minimum number of PGY1 or PGY2 students in a certain rotation. Similarly, MAX23 means the maximum number of PGY2 or PGY3 students in a certain rotation. -1 simply means there is no such requirement:
```
---
Workforce_requirements,8
ROTATION_ID,ROTATION,MIN1,MAX1,MIN2,MAX2,MIN3,MAX3,MIN12,MAX12,MIN13,MIN13,MIN23,MAX23,MIN_TOTAL,MAX_TOTAL
0,Ambulatory Medicine Blocks,1,5,1,5,1,5,-1,-1,-1,-1,-1,-1,-1,-1
1,Backup Staffing / Urgent Visit,1,5,-1,-1,-1,-1,-1,-1,-1,-1,2,10,-1,-1
2,Coronary Care Unit,1,7,1,7,1,7,-1,-1,-1,-1,-1,-1,-1,-1
3,Elective,2,7,-1,-1,-1,-1,-1,-1,-1,-1,4,14,-1,-1
4,Emergency Medicine,1,5,1,5,1,5,-1,-1,-1,-1,-1,-1,-1,-1
5,Inpatient Wards,-1,-1,-1,-1,3,7,6,14,-1,-1,-1,-1,-1,-1
6,Medical Intensive Care Unit,1,5,1,5,1,5,-1,-1,-1,-1,-1,-1,-1,-1
7,Neurology,1,5,1,5,1,5,-1,-1,-1,-1,-1,-1,-1,-1
```
Next, please input the requirements of each rotation for each role:
```
---
ROTATION,MIN_BLOCKS_REQUIRED
PGY1_REQUIREMENT,8
Ambulatory Medicine Blocks,1.25
Backup Staffing / Urgent Visit,1
Coronary Care Unit,2
Elective,2
Emergency Medicine,1
Inpatient Wards,2
Medical Intensive Care Unit,1.5
Neurology,1
PGY2_REQUIREMENT,8
Ambulatory Medicine Blocks,1.25
Backup Staffing / Urgent Visit,1
Coronary Care Unit,2
Elective,2
Emergency Medicine,1
Inpatient Wards,2
Medical Intensive Care Unit,1.5
Neurology,1
PGY3_REQUIREMENT,8
Ambulatory Medicine Blocks,1.25
Backup Staffing / Urgent Visit,1
Coronary Care Unit,2
Elective,2
Emergency Medicine,1
Inpatient Wards,2
Medical Intensive Care Unit,1.5
Neurology,1
```
Next, please specify the limitation of all the rotations for all the roles:
```
---
ROTATION,LIMITATION
PGY1_LIMITATION,8
Ambulatory Medicine Blocks,10
Backup Staffing / Urgent Visit,10
Coronary Care Unit,10
Elective,10
Emergency Medicine,10
Inpatient Wards,10
Medical Intensive Care Unit,10
Neurology,10
PGY2_LIMITATION,8
Ambulatory Medicine Blocks,10
Backup Staffing / Urgent Visit,10
Coronary Care Unit,10
Elective,10
Emergency Medicine,10
Inpatient Wards,10
Medical Intensive Care Unit,10
Neurology,10
PGY3_LIMITATION,8
Ambulatory Medicine Blocks,10
Backup Staffing / Urgent Visit,10
Coronary Care Unit,10
Elective,10
Emergency Medicine,10
Inpatient Wards,10
Medical Intensive Care Unit,10
Neurology,10
```
Finally, please input the pre-filled schedule for all the trainees. (Remember to specify the number of blocks that are pre-filled) -1 here means that block is empty. For this section, you don't need to separate trainees by roles. Just make sure the id for each trainee is correct. Also, you can always pre-fill the schedule in an easier way on our GUI. It might be easier for you to input -1's to start with and make modifications once this file is uploaded.
```
---
Prefilled,0
USERID,BLOCK,ROTATION,WHERE_IN_BLOCK_RANG
1,Santhosh Cherian,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
2,Ron Rivera,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
3,Todd Wilkinson,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
4,Mary Renner,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
5,Randy Moss,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
6,Chris Tokodi,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
7,Grant Fuhr,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
8,Fred Marston,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
9,Dodie Woodman,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
10,Edie Ballin,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
11,Christine Weible,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
12,Corina Colwell,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
13,Corrin Ingersoll,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
14,Soledad Levey,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
15,Ron Dhillon,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
16,Eileen Telford,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
17,In Trimpe,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
18,Larisa Owen,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
19,Gaynell Vanleuven,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
20,Milagros Tanner,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
21,Mila Span,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
22,Patrina Pettaway,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
23,Takako Jarrells,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
24,Jenee Lach,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
25,Santina Gwynn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
26,Alisia Durbin,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
27,Carolyne Backes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
28,Reyes Turberville,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
29,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
30,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
31,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
32,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
33,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
34,Patrina Pettaway,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
35,Takako Jarrells,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
36,Jenee Lach,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
37,Santina Gwynn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
38,Alisia Durbin,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
39,Carolyne Backes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
40,Reyes Turberville,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1
```
Great job on making this data file! You can name it whatever you want, but please make sure save it as a .txt file.
