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

with open("../data/sample_set/Data_bigfile2.txt") as f:

    # ---------------------
    # Read the program name
    # ---------------------
    line_data = f.readline().rstrip('\n').split(",")
    program_name = line_data[1]
    num_block = int(line_data[2]) * 4 # Fucking hack
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
        new_trainee = Class.Trainee(first_name + " " + last_name, "PGY1", id = id, num_block = num_block)
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
        new_trainee = Class.Trainee(first_name + " " + last_name, "PGY2", id = id, num_block = num_block)
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
        new_trainee = Class.Trainee(first_name + " " + last_name, "PGY3", id = id, num_block = num_block)
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
        max_block_per_year = float(line_data[4]) # Note: In conflict with limitations
        type = line_data[5]

        # Create rotation
        new_rotation = Class.Rotation(rot_name, rot_id,
                                      vacation_allowed,
                                      max_block_per_year,
                                      type,
                                      num_block = num_block)

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
    elective_rot = Class.Rotation("Elective", rot_id + 1, "No", 10, "Core", num_block = num_block)
    rotations.append(elective_rot)
    rotations_id["Elective"] = rot_id + 1
    core_rotations.append(elective_rot)

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
    elective_rot.set_min(elec_min1, elec_min2, elec_min3)
    elective_rot.set_max(elec_max1, elec_max2, elec_max3)
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

    # -----------------------
    # Create greedy constants
    # -----------------------

    num_block_greedy = num_block

    pgy1_req_greedy = copy.deepcopy(pgy1_req)
    pgy2_req_greedy = copy.deepcopy(pgy2_req)
    pgy3_req_greedy = copy.deepcopy(pgy3_req)

    for rot in pgy1_req_greedy:
        pgy1_req_greedy[rot] *= 4
        pgy2_req_greedy[rot] *= 4
        pgy3_req_greedy[rot] *= 4

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

schedule = Class.Schedule(trainees, rotations, num_block = num_block, rotations_id = rotations_id)
schedule.greedy_step0_4()
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
rotation_legends = create_legends(core_rotations, legend_top_left = legend_top_left)
rotation_legends_click_space = create_click_space(core_rotations, legend_top_left = legend_top_left)

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
chart_bars = create_chart_bars(num_block, chart_top_left = chart_top_left)

# Underdone chart
underdone_quads = create_underdone_bars(schedule.trainees, schedule.rotations, underdone_top_left = underdone_top_left)

# Mark lines
mark_lines = create_superline(num_trainees, num_block,
                              below_mark_top_left = below_mark_top_left,
                              right_mark_top_left = right_mark_top_left)

# Min lines
min_line = create_mark_line(num_block, below_mark_top_left = below_mark_top_left)
max_line = create_mark_line(num_block, below_mark_top_left = below_mark_top_left)

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
                                                underdone_top_left = underdone_top_left)
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