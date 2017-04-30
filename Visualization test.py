# ---------------------------------
# IMPORT LIBRARIES AND DEPENDENCIES
# ---------------------------------

from flask import Flask, render_template, request
import json
import io

import random
import operator
import copy
import time

from Constants import *
from Window import *
import Class
import Helper
import SolverUtil

# -----------------------------
# Prepare some global variables
# -----------------------------

trainees = []
trainees_dict = {}
rotations = []
rotations_dict = {}
rotations_id = {}
core_rotations = []
elective_rotations = []
elective_dict = {}
elective_id = {}
# Note: elective_rotations will be specified in rotations list as Elective.

# --------------------
# Reset some constants
# --------------------

num_pgy1 = 0
num_pgy2 = 0
num_pgy3 = 0
num_trainees = 0
num_block = 0

rotations_list = []

# -------------------------
# CREATE SCHEDULE FROM FILE
# -------------------------

app = Flask(__name__)

isScheduled = False
scheduleText = ''

@app.route('/requestToSchedule/<string:method>', methods = ['POST', 'GET'])
def request_schedule(method):
    if request.method == 'POST':
        data = request.json["title"]
        print(data)

        with io.StringIO(data) as f:

            # --------------
            # Rest variables
            # --------------
            trainees = []
            rotations = []

            # ---------------------
            # Read the program name
            # ---------------------
            line_data = f.readline().rstrip('\n').split(",")
            program_name = line_data[1]
            num_block = int(line_data[2]) * 4 # Fucking hack
            print("SHIT-FUCK")
            print(num_block)
            f.readline()

            # ------------------------
            # Read and create trainees
            # ------------------------
            line_data = f.readline().rstrip('\n').split(",")
            num_pgy1 = int(line_data[1])
            for i in range(num_pgy1):
                # Get the data field
                line_data = f.readline().rstrip('\n').split(",")
                id = line_data[0]
                first_name = line_data[1]
                last_name = line_data[2]

                # Create trainee
                new_trainee = Class.Trainee(first_name + " " + last_name, "PGY1", id=id, num_block=num_block)
                trainees.append(new_trainee)
                trainees_dict[id] = new_trainee

            line_data = f.readline().rstrip('\n').split(",")
            num_pgy2 = int(line_data[1])
            for i in range(num_pgy2):
                # Get the data field
                line_data = f.readline().rstrip('\n').split(",")
                id = line_data[0]
                first_name = line_data[1]
                last_name = line_data[2]

                # Create trainee
                new_trainee = Class.Trainee(first_name + " " + last_name, "PGY2", id=id, num_block=num_block)
                trainees.append(new_trainee)
                trainees_dict[id] = new_trainee

            line_data = f.readline().rstrip('\n').split(",")
            num_pgy3 = int(line_data[1])
            for i in range(num_pgy3):
                # Get the data field
                line_data = f.readline().rstrip('\n').split(",")
                id = line_data[0]
                first_name = line_data[1]
                last_name = line_data[2]

                # Create trainee
                new_trainee = Class.Trainee(first_name + " " + last_name, "PGY3", id=id, num_block=num_block)
                trainees.append(new_trainee)
                trainees_dict[id] = new_trainee

            num_trainees = num_pgy1 + num_pgy2 + num_pgy3
            f.readline()

            # -------------------------
            # Read and create rotations
            # -------------------------
            line_data = f.readline().rstrip('\n').split(",")
            num_rotations = int(line_data[1])
            f.readline()
            for i in range(num_rotations):
                # Get the data field
                line_data = f.readline().rstrip('\n').split(",")
                rot_id = int(line_data[0])
                rot_name = line_data[1]
                vacation_allowed = True if line_data[2] == "Yes" else False
                min_block_length = float(line_data[3])
                max_block_per_year = float(line_data[4])  # Note: In conflict with limitations
                type = line_data[5]

                # Create rotation
                new_rotation = Class.Rotation(rot_name, rot_id,
                                              vacation_allowed,
                                              min_block_length,
                                              type,
                                              num_block=num_block)

                if type == "Elective":
                    elective_rotations.append(new_rotation)
                    elective_dict[rot_id] = new_rotation
                    elective_id[rot_name] = rot_id
                else:
                    core_rotations.append(new_rotation)

                rotations.append(new_rotation)
                rotations_dict[rot_id] = new_rotation
                rotations_id[rot_name] = rot_id

            # Create a representative elective rotations
            # elective_rot = Class.Rotation("Elective", rot_id + 1, "No", 10, "Core", num_block=num_block)
            # rotations.append(elective_rot)
            # rotations_id["Elective"] = rot_id + 1
            # core_rotations.append(elective_rot)

            # Set rotations to all trainees
            for trainee in trainees:
                trainee.set_rotations(rotations)

            # Skip a line
            f.readline()

            # ----------------------
            # Workforce requirements
            # ----------------------
            line_data = f.readline().rstrip('\n').split(",")
            num_reqs = int(line_data[1])
            f.readline()
            elec_min1, elec_min2, elec_min3 = 0, 0, 0
            elec_max1, elec_max2, elec_max3 = 0, 0, 0

            for i in range(num_reqs):
                # Get the data field
                line_data = f.readline().rstrip('\n').split(",")
                rot_id = int(line_data[0])
                rot_name = line_data[1]
                min1 = int(line_data[2])
                max1 = int(line_data[3])
                min2 = int(line_data[4])
                max2 = int(line_data[5])
                min3 = int(line_data[6])
                max3 = int(line_data[7])
                min12 = int(line_data[8])
                max12 = int(line_data[9])
                min13 = int(line_data[10])
                max13 = int(line_data[11])
                min23 = int(line_data[12])
                max23 = int(line_data[13])
                mintotal = int(line_data[14])
                maxtotal = int(line_data[15])

                if (max1 == -1): max1 = num_trainees
                if (max2 == -1): max2 = num_trainees
                if (max3 == -1): max3 = num_trainees
                if (max12 == -1): max12 = num_trainees
                if (max13 == -1): max13 = num_trainees
                if (max23 == -1): max23 = num_trainees
                if (maxtotal == -1): maxtotal = num_trainees

                # Assign min max to rotation if is a core rotation
                if rot_id in rotations_dict:
                    rotations_dict[rot_id].set_min(min1, min2, min3, min12, min13, min23, mintotal)
                    rotations_dict[rot_id].set_max(max1, max2, max3, max12, max13, max23, maxtotal)

                else:
                    elec_min1 += min1
                    elec_max1 += max1
                    elec_min2 += min2
                    elec_max2 += max2
                    elec_min3 += min3
                    elec_max3 += max3

            # Set min max for elective rotation
            # elective_rot.set_min(elec_min1, elec_min2, elec_min3)
            # elective_rot.set_max(elec_max1, elec_max2, elec_max3)
            f.readline()

            # --------------------
            # Student requirements
            # --------------------
            f.readline()

            # Create a generic requirements that contains all requirements
            generic_reqs = {}
            for rot in rotations:
                generic_reqs[rot.name] = 0

            # PGY1 Requirements
            pgy1_req = copy.deepcopy(generic_reqs)
            line_data = f.readline().rstrip("\n").split(",")
            num_reqs = int(line_data[1])
            for i in range(num_reqs):
                # Get the data field
                line_data = f.readline().rstrip('\n').split(",")
                rot_name = line_data[0]
                num_blocks = float(line_data[1])

                # Assign requirement to num_reqs
                pgy1_req[rot_name] = num_blocks
                pass

            # PGY2 Requirements
            pgy2_req = copy.deepcopy(generic_reqs)
            line_data = f.readline().rstrip("\n").split(",")
            num_reqs = int(line_data[1])
            for i in range(num_reqs):
                # Get the data field
                line_data = f.readline().rstrip('\n').split(",")
                rot_name = line_data[0]
                num_blocks = float(line_data[1])

                # Assign requirement to num_reqs
                pgy2_req[rot_name] = num_blocks

            # PGY3 Requirements
            pgy3_req = copy.deepcopy(generic_reqs)
            line_data = f.readline().rstrip("\n").split(",")
            num_reqs = int(line_data[1])
            for i in range(num_reqs):
                # Get the data field
                line_data = f.readline().rstrip('\n').split(",")
                rot_name = line_data[0]
                num_blocks = float(line_data[1])

                # Assign requirement to num_reqs
                pgy3_req[rot_name] = num_blocks
            f.readline()

            # -------------------
            # Students limitation
            # -------------------
            f.readline()

            # PGY1 Limitations
            pgy1_lim = {}
            line_data = f.readline().rstrip("\n").split(",")
            num_lims = int(line_data[1])
            for i in range(num_lims):
                # Get the data field
                line_data = f.readline().rstrip('\n').split(",")
                rot_name = line_data[0]
                num_blocks = float(line_data[1])

                # Assign requirement to num_reqs
                pgy1_lim[rot_name] = num_blocks
                pass

            # PGY2 Limitations
            pgy2_lim = {}
            line_data = f.readline().rstrip("\n").split(",")
            num_lims = int(line_data[1])
            for i in range(num_lims):
                # Get the data field
                line_data = f.readline().rstrip('\n').split(",")
                rot_name = line_data[0]
                num_blocks = float(line_data[1])

                # Assign requirement to num_reqs
                pgy2_lim[rot_name] = num_blocks
                pass

            # PGY3 Limitations
            pgy3_lim = {}
            line_data = f.readline().rstrip("\n").split(",")
            num_lims = int(line_data[1])
            for i in range(num_lims):
                # Get the data field
                line_data = f.readline().rstrip('\n').split(",")
                rot_name = line_data[0]
                num_blocks = float(line_data[1])

                # Assign requirement to num_reqs
                pgy3_lim[rot_name] = num_blocks
                pass

            print(pgy1_lim)
            print(pgy2_lim)
            print(pgy3_lim)

            # TODO: Create the prefilled code

            # -----------------------
            # Create greedy constants
            # -----------------------

            num_block_greedy = num_block

            pgy1_req_greedy = copy.deepcopy(pgy1_req)
            pgy2_req_greedy = copy.deepcopy(pgy2_req)
            pgy3_req_greedy = copy.deepcopy(pgy3_req)

            pgy1_lim_greedy = copy.deepcopy(pgy1_lim)
            pgy2_lim_greedy = copy.deepcopy(pgy2_lim)
            pgy3_lim_greedy = copy.deepcopy(pgy3_lim)

            for rot in pgy1_req_greedy:
                pgy1_req_greedy[rot] *= 4
                pgy2_req_greedy[rot] *= 4
                pgy3_req_greedy[rot] *= 4
                pgy1_lim_greedy[rot] *= 4
                pgy2_lim_greedy[rot] *= 4
                pgy3_lim_greedy[rot] *= 4
            #
            # TODO: Create limitation code
            for trainee in trainees:
                if trainee.role == "PGY1":
                    trainee.create_limitations(pgy1_lim_greedy)
                elif trainee.role == "PGY2":
                    trainee.create_limitations(pgy2_lim_greedy)
                elif trainee.role == "PGY3":
                    trainee.create_limitations(pgy3_lim_greedy)

            # Set all these requirements to trainees
            for trainee in trainees:
                if trainee.role == "PGY1":
                    trainee.create_requirements(pgy1_req_greedy)
                elif trainee.role == "PGY2":
                    trainee.create_requirements(pgy2_req_greedy)
                elif trainee.role == "PGY3":
                    trainee.create_requirements(pgy3_req_greedy)

            # -------------------
            # Create the schedule
            # -------------------

            schedule = Class.Schedule(trainees, rotations, num_block=num_block, rotations_id=rotations_id)

            # --------------------
            # Prefill the schedule
            # --------------------

            # Skip 3 lines
            f.readline()
            f.readline()
            f.readline()

            # Create blank prefilled schedule
            def create_blank_schedule(num_trainees, num_block):
                return [[-1 for i in range(num_block)] for j in range(num_trainees)]

            prefilled_schedule = create_blank_schedule(num_trainees, num_block)

            # Read in number of blocks:
            for i in range(num_trainees):
                line_data = f.readline().rstrip("\n").split(",")
                trainee_id = line_data[0]
                print(trainee_id)
                print(line_data)
                schedule_info = line_data[2].split(".")

                trainee = trainees_dict[trainee_id]

                for index in range(num_block):
                    # Schedule for the trainee using prefilled information
                    rot_id = int(schedule_info[index])
                    if rot_id != -1:
                        schedule.fill_in(trainee, index, rotations_dict[rot_id])
                        prefilled_schedule[i][index] = rot_id

            # TODO:
            # pgy1_req
            # pgy2_req
            # pgy3_req
            # num_block
            # pgy1_lim, pgy2_lim, pgy3_lim

            f.close()

        # --------------------------
        # FIX THE MESSED UP CONSTANT
        # --------------------------

        # ---------------------------------------------------------------
        # CREATE SCHEDULE WITH AVAILABLE INFORMATION FOR GREEDY ALGORITHM
        # ---------------------------------------------------------------

        if (method == "greedy"):

            start = time.time()

            #schedule.greedy_step0_4()
            schedule.greedy_step1_4()
            schedule.greedy_step2_4()
            schedule.greedy_step3_4()
            schedule.greedy_step4_4()
            schedule.greedy_step5_4()
            schedule.greedy_step6_4()
            schedule.greedy_step7_4()
            schedule.greedy_step8_4()
            schedule.sort_trainees()
            schedule.generate_info_file()

            end = time.time()
            print(end-start)

        # ---------------------------
        # CREATE SCHEDULE FOR SOLVERS
        # ---------------------------

        else:
            # Get the Full, Half, Quarter Requirements and Rotation Limit Counts
            pgy1_req_full, pgy1_req_half, pgy1_req_quarter = SolverUtil.generateFullHalfQuarterDict(pgy1_req)
            pgy1_lim_full, pgy1_lim_half, pgy1_lim_quarter = SolverUtil.generateFullHalfQuarterDict(pgy1_lim)
            pgy2_req_full, pgy2_req_half, pgy2_req_quarter = SolverUtil.generateFullHalfQuarterDict(pgy2_req)
            pgy2_lim_full, pgy2_lim_half, pgy2_lim_quarter = SolverUtil.generateFullHalfQuarterDict(pgy2_lim)
            pgy3_req_full, pgy3_req_half, pgy3_req_quarter = SolverUtil.generateFullHalfQuarterDict(pgy3_req)
            pgy3_lim_full, pgy3_lim_half, pgy3_lim_quarter = SolverUtil.generateFullHalfQuarterDict(pgy3_lim)

            # Random seed for pruning, to ensure replicability
            seed = 100
            num_trainee_list = (num_pgy1, num_pgy2, num_pgy3)
            fullPrefilled, halfPrefilled, quarterPrefilled = SolverUtil.generateFullHalfQuarterPrefilled(prefilled_schedule)

            # Solve the Full Schedule (13 resolution)
            presolve_schedule = fullPrefilled
            resultArray = SolverUtil.solveSchedule(presolve_schedule, num_block // 4, num_trainee_list, rotations,
                                                   pgy1_req_full, pgy1_lim_full,
                                                   pgy2_req_full, pgy2_lim_full,
                                                   pgy3_req_full, pgy3_lim_full)

            # Double to halves and solve (26 resolution)
            presolve_schedule = SolverUtil.pruneSchedule(SolverUtil.doubleSchedule(resultArray, halfPrefilled),
                                                         halfPrefilled, seed, num_trainee_list, rotations)
            resultArray = SolverUtil.solveSchedule(presolve_schedule, num_block // 2, num_trainee_list, rotations,
                                                   pgy1_req_half, pgy1_lim_half,
                                                   pgy2_req_half, pgy2_lim_half,
                                                   pgy3_req_half, pgy3_lim_half)

            # Double again to quarters and solve (52 resolution)
            presolve_schedule = SolverUtil.pruneSchedule(SolverUtil.doubleSchedule(resultArray, quarterPrefilled),
                                                         quarterPrefilled, seed, num_trainee_list, rotations)
            resultArray = SolverUtil.solveSchedule(presolve_schedule, num_block, num_trainee_list, rotations,
                                                   pgy1_req_quarter, pgy1_lim_quarter,
                                                   pgy2_req_quarter, pgy2_lim_quarter,
                                                   pgy3_req_quarter, pgy3_lim_quarter)

            # Filling the schedule class with the result schedule from Solver
            schedule = Class.Schedule(trainees, rotations)

            # A hack to allow vis to work for solver.
            rotations_dict[-1] = Class.Rotation("Blank", -1)

            # Fill in using idiomatic way
            for trainee_num in range(num_trainees):
                for block_num in range(num_block):
                    schedule.fill_in(trainees[trainee_num], block_num, rotations_dict[resultArray[trainee_num][block_num]])

        # ------------
        # Done scheduling, return the json object
        # ------------
        global scheduleText, isScheduled
        scheduleText = schedule.generate_info_file()
        isScheduled = True
        return json.dumps({'data': scheduleText})

@app.route('/')
def home_page():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()