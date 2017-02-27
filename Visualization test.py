from flask import Flask, render_template, request
import json
import io

# ---------------------------------
# IMPORT LIBRARIES AND DEPENDENCIES
# ---------------------------------

import random
import operator
import copy
import time

from Constants import *
from Window import *
import Class
import Helper

# -----------------------------
# Prepare some global variables
# -----------------------------

trainees = []
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

@app.route('/pushTrainees', methods=['GET'])
def push_trainees():
    data = {'sample_text': "13,3\n" + "29,7,4\n" + "Student, Role, Schedule\n" + "In Weatherly,0,PGY1,3.3.5.5.6.1.2.7.4.0.-1.2.-1\n" + "Bong Dubre,1,PGY1,3.3.5.5.2.1.6.-1.0.7.2.4.-1\n" + "Aleisha Platero,2,PGY1,5.1.4.3.3.2.5.6.2.-1.7.-1.0\n" + "Adria Guth,3,PGY1,5.5.2.3.2.1.3.-1.6.0.4.7.-1\n" + "Merlyn Mccarley,4,PGY1,5.5.2.4.3.3.7.-1.-1.2.1.0.6\n" + "Brady Teper,5,PGY1,6.2.3.5.1.0.4.3.5.-1.-1.2.7\n" + "Andy Kandoll,6,PGY1,7.5.3.0.1.4.3.5.2.6.2.-1.-1\n" + "Donetta Grafe,7,PGY1,-1.0.5.6.5.4.7.2.3.2.3.1.-1\n" + "Herbert Cendana,8,PGY1,2.0.6.1.5.2.5.4.3.3.-1.7.-1\n" + "Darron Linney,9,PGY1,4.0.7.-1.5.1.5.3.2.3.6.2.-1\n" + "Leroy Degroat,10,PGY1,-1.2.-1.0.7.3.6.2.5.5.1.3.4\n" + "Faviola Tullio,11,PGY1,-1.0.-1.7.6.5.2.5.3.3.2.4.1\n" + "Anette Simmions,12,PGY1,-1.6.2.7.3.0.-1.5.5.4.2.3.1\n" + "Mallory Kirley,13,PGY1,-1.7.1.3.2.5.4.2.-1.5.0.6.3\n" + "Toi Ehlen,14,PGY1,2.6.-1.1.0.5.4.-1.7.2.3.5.3\n" + "Louisa Botellio,15,PGY1,-1.7.0.-1.3.6.2.1.3.2.5.5.4\n" + "Kiesha Menlove,16,PGY1,0.7.1.-1.6.2.3.3.-1.4.5.2.5\n" + "Joella Middaugh,17,PGY1,-1.-1.3.3.2.2.7.6.4.1.0.5.5\n" + "Janean Skomsky,18,PGY2,1.2.4.-1.3.7.6.3.-1.2.5.0.5\n" + "Ramonita Gryniuk,19,PGY2,6.3.-1.2.5.0.-1.7.1.4.3.5.2\n" + "Teisha Stunkard,20,PGY3,6.5.-1.1.4.2.2.-1.7.5.0.3.3\n" + "Latesha Conteras,21,PGY2,4.5.7.3.5.0.-1.2.3.-1.2.6.1\n" + "Paris Sachse,22,PGY1,3.4.2.-1.3.5.-1.7.0.6.5.1.2\n" + "Tyisha Vandenacre,23,PGY3,1.4.5.6.5.2.3.7.0.-1.2.3.-1\n" + "Dewitt Petricone,24,PGY2,3.2.0.-1.3.4.-1.2.7.1.5.6.5\n" + "Trinidad Dunmead,25,PGY2,-1.7.3.4.2.-1.5.1.2.5.6.3.0\n" + "Lanette Schnitzler,26,PGY1,2.4.2.3.-1.7.1.-1.3.0.6.5.5\n" + "Jarod Schille,27,PGY1,3.1.2.-1.-1.4.5.5.6.3.0.2.7\n" + "Annemarie Warnecke,28,PGY3,7.4.1.6.-1.0.5.2.3.2.3.5.-1\n" + "Carla Tylor,29,PGY2,2.6.5.3.-1.5.1.3.2.-1.4.7.0\n" + "Randy Solas,30,PGY2,6.3.7.2.1.5.2.0.-1.-1.3.4.5\n" + "Cassie Mercy,31,PGY1,2.5.6.4.0.3.1.3.-1.2.7.5.-1\n" + "Gilberte Rezendes,32,PGY3,4.2.0.-1.5.5.2.1.-1.7.3.6.3\n" + "Tony Rizzio,33,PGY1,5.3.0.1.2.6.5.2.-1.-1.3.4.7\n" + "Roxann Schwanbeck,34,PGY1,1.5.3.5.-1.4.3.0.7.6.2.2.-1\n" + "Fran Schifo,35,PGY1,5.2.2.0.1.-1.-1.3.6.5.4.7.3\n" + "Tawna Roehrs,36,PGY1,2.3.5.-1.1.3.7.-1.2.0.5.4.6\n" + "Evelynn Sharp,37,PGY1,7.2.4.0.1.3.2.6.-1.5.-1.3.5\n" + "Tawana Vonbank,38,PGY1,2.7.3.-1.2.3.1.5.4.5.0.6.-1\n" + "Barb Tua,39,PGY1,7.4.5.5.-1.3.0.6.2.-1.1.2.3\n" + "Rotations,8\n" + "ID, Name, Min1, Max1, Min2, Max2, Min3, Max3\n" + "0,Ambulatory Medicine Blocks,1,5,0,0,0,0\n" + "1,Backup Staffing / Urgent Visit,1,6,0,0,0,0\n" + "2,Coronary Care Unit,1,7,0,0,0,0\n" + "3,Elective,2,7,0,0,0,0\n" + "4,Emergency Medicine,1,5,0,0,0,0\n" + "5,Inpatient Wards,3,7,0,0,0,0\n" + "6,Medical Intensive Car Unit,1,5,0,0,0,0\n" + "7,Neurology,1,5,0,0,0,0\n" + "Rotation ID, Name, Requirement\n" + "PGY1 Requirements\n" + "0,Ambulatory Medicine Blocks,1\n" + "1,Backup Staffing / Urgent Visit,1\n" + "2,Coronary Care Unit,2\n" + "3,Elective,2\n" + "4,Emergency Medicine,1\n" + "5,Inpatient Wards,2\n" + "6,Medical Intensive Car Unit,1\n" + "7,Neurology,1\n" + "PGY2 Requirements\n" + "0,Ambulatory Medicine Blocks,0\n" + "1,Backup Staffing / Urgent Visit,0\n" + "2,Coronary Care Unit,0\n" + "3,Elective,0\n" + "4,Emergency Medicine,0\n" + "5,Inpatient Wards,0\n" + "6,Medical Intensive Car Unit,0\n" + "7,Neurology,0\n" + "PGY3 Requirements\n" + "0,Ambulatory Medicine Blocks,0\n" + "1,Backup Staffing / Urgent Visit,0\n" + "2,Coronary Care Unit,0\n" + "3,Elective,0\n" + "4,Emergency Medicine,0\n" + "5,Inpatient Wards,0\n" + "6,Medical Intensive Car Unit,0\n" + "7,Neurology,0\n"}
    return json.dumps(data)

@app.route('/requestToSchedule', methods = ['POST'])
def request_schedule():
    if request.method == 'POST':
        data = request.json["title"]

        with io.StringIO(data) as f:

            # ---------------------
            # Read the program name
            # ---------------------
            line_data = f.readline().rstrip('\n').split(",")
            program_name = line_data[1]
            num_block = int(line_data[2]) * 4# Fucking hack
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
                                              max_block_per_year,
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

                # Assign min max to rotation if is a core rotation
                if rot_id in rotations_dict:
                    rotations_dict[rot_id].set_min(min1, min2, min3)
                    rotations_dict[rot_id].set_max(max1, max2, max3)
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
            # # TODO: Create limitation code
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

            # TODO:
            # pgy1_req
            # pgy2_req
            # pgy3_req
            # num_block
            # pgy1_lim, pgy2_lim, pgy3_lim

            # --------------------
            # Prefill the schedule
            # --------------------

            # TODO: Create the prefill code
            f.close()

        # --------------------------
        # FIX THE MESSED UP CONSTANT
        # --------------------------

        # ------------------------------------------
        # CREATE SCHEDULE WITH AVAILABLE INFORMATION
        # ------------------------------------------

        schedule = Class.Schedule(trainees, rotations, num_block=num_block, rotations_id=rotations_id)
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

        # -------------
        # VISUALIZATION
        # -------------

        # IMPORT

        import pyglet
        from pyglet.gl import gl

        # ADAPT THE CONSTANTS
        # Some graphic constants in the Constants file no longer apply to this case

        legend_top_left = [40, 40 + LABEL_HEIGHT * num_trainees + 40]
        legend_label_top_left = [66, HEIGHT - (40 + LABEL_HEIGHT * num_trainees + 40)]

        underdone_top_left = UNDERDONE_TOP_LEFT = [300 + UNIT_RANGE * num_block + 40, 40]

        chart_top_left = [300, 40 + LABEL_HEIGHT * num_trainees + 40]

        below_mark_top_left = [300, HEIGHT - (40 + LABEL_HEIGHT * num_trainees + 40)]
        right_mark_top_left = [300 + UNIT_RANGE * num_block + 40, HEIGHT - 40]

        # WINDOW AND SETTINGS

        window = Window(width=WIDTH, height=HEIGHT)
        gl.glClearColor(*BACKGROUND_COLOR)

        # Trainee and rotation labels
        trainee_labels = create_trainee_labels(schedule.trainees, LABEL_TOP_LEFT, LABEL_SIZE, LABEL_HEIGHT)
        rotation_labels = create_labels(core_rotations, legend_label_top_left, LEGEND_SIZE, LEGEND_HEIGHT)
        rotation_legends = create_legends(core_rotations, legend_top_left=legend_top_left)
        rotation_legends_click_space = create_click_space(core_rotations, legend_top_left=legend_top_left)

        # Unit squares
        rot_squares = create_squares(schedule.trainees, num_block)
        square_dict = create_square_dict(rot_squares)
        super_quad_dict = {}
        super_quads = []
        for key in square_dict.keys():
            quad = create_superquad(square_dict[key])
            super_quad_dict[key] = quad
            super_quads.append(quad)

        # All squares: This is used to find appropriate rotation when a square is clicked
        squares = rot_squares + rotation_legends + rotation_legends_click_space

        # Height chart
        chart_bars = create_chart_bars(num_block, chart_top_left=chart_top_left)

        # Underdone chart
        underdone_quads = create_underdone_bars(schedule.trainees, schedule.rotations,
                                                underdone_top_left=underdone_top_left)

        # Mark lines
        mark_lines = create_superline(num_trainees, num_block,
                                      below_mark_top_left=below_mark_top_left,
                                      right_mark_top_left=right_mark_top_left)

        # Min lines
        min_line = create_mark_line(num_block, below_mark_top_left=below_mark_top_left)
        max_line = create_mark_line(num_block, below_mark_top_left=below_mark_top_left)

        def draw_begin_state():
            window.clear()
            draw_labels(trainee_labels)
            draw_super_quads(super_quads)
            draw_bars(chart_bars)
            draw_bars(underdone_quads)
            mark_lines.draw()
            min_line.draw()
            max_line.draw()
            draw_legends(rotation_legends)
            draw_labels(rotation_labels)

        def draw_animation():
            window.clear()
            draw_labels(trainee_labels)
            draw_animated_quads(super_quads, ANIMATION_STEPS - window.steps)
            draw_animated_bars(chart_bars, ANIMATION_STEPS - window.steps)
            draw_animated_bars(underdone_quads, ANIMATION_STEPS - window.steps)
            window.steps -= 1
            if window.steps == 0:
                window.state = STATE_IDLE
                for quad in super_quads:
                    quad.current_blur = quad.target_blur

                for bar in chart_bars:
                    bar.current_height = bar.target_height
                    bar.current_color = bar.target_color

                for quad in underdone_quads:
                    quad.current_points_array = quad.target_points_array

                min_line.current_height = min_line.target_height
                max_line.current_height = max_line.target_height
            mark_lines.draw()
            min_line.draw_animated(ANIMATION_STEPS - window.steps)
            max_line.draw_animated(ANIMATION_STEPS - window.steps)
            draw_legends(rotation_legends)
            draw_labels(rotation_labels)

        @window.event
        def on_draw():
            if (window.state == STATE_BEGIN):
                window.state = STATE_IDLE
                draw_begin_state()
            elif window.state == STATE_IDLE:
                draw_begin_state()
            elif window.state == STATE_ANIMATION:
                draw_animation()
                pass

        @window.event
        def on_mouse_press(x, y, button, modifiers):
            curr_square = find_curr_square(squares, x, y)
            if curr_square:
                rot_id = curr_square.id
                rot_color = curr_square.color
                for quad in super_quads:
                    if quad.id == rot_id:
                        quad.target_blur = NO_BLUR
                    else:
                        quad.target_blur = UNCHOSEN_BLUR

                for bar in chart_bars:
                    bar.target_color = rot_color
                    bar.target_height = schedule.sum_rot_at_block(bar.col_num, rot_id) * CHART_UNIT_HEIGHT

                temporary_quads = create_temporary_bars(schedule.trainees, schedule.rotations, rot_id,
                                                        underdone_top_left=underdone_top_left)
                for i in range(len(underdone_quads)):
                    underdone_quads[i].target_points_array = temporary_quads[i].base_points_array

                min_line.target_height = (schedule.rotations[rot_id].min1 + \
                                          schedule.rotations[rot_id].min2 + \
                                          schedule.rotations[rot_id].min3) * CHART_UNIT_HEIGHT

                max_line.target_height = (schedule.rotations[rot_id].max1 + \
                                          schedule.rotations[rot_id].max2 + \
                                          schedule.rotations[rot_id].max3) * CHART_UNIT_HEIGHT

            else:
                for quad in super_quads:
                    quad.target_blur = NO_BLUR

                for bar in chart_bars:
                    bar.target_color = to_decimal_color(ROTATIONS_COLOR[-1])
                    bar.target_height = 0

                for quad in underdone_quads:
                    quad.target_points_array = quad.base_points_array

                min_line.target_height = 0
                max_line.target_height = 0

            window.steps = ANIMATION_STEPS
            window.state = STATE_ANIMATION

        @window.event
        def update(dt):
            pass

        @window.event
        def on_show():
            state = STATE_BEGIN

        pyglet.clock.schedule_interval(update, 1.0 / 60)
        pyglet.app.run()
        return data
    else:
        return 'SHIT'

@app.route('/')
def hello_world():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()