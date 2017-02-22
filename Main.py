# ---------------------------------
# IMPORT LIBRARIES AND DEPENDENCIES
# ---------------------------------

import random
import operator
import copy
import time
import Class

from Constants import *
from Helper import *
from Window import *

# ---------
# ROTATIONS
# ---------

ROTATIONS = []

for rotation in ROTATIONS_LIST:
    # So far, just set a random min, max cap for each rotation.
    # There will hopefully be better ways to do this. An interactive GUI probably works better
    # TODO: Better way to do cap for each rotation, probably a site based one.
    rot_name, min1, max1, min2, max2, min3, max3 = rotation
    new_rotation = Class.Rotation(rot_name, id_count)
    ROTATIONS_ID[rot_name] = id_count

    # PGY1s
    if rot_name in REQUIREMENTS["PGY1"]:
        min_PGY1 = min1
        max_PGY1 = max1
    else:
        min_PGY1 = 0
        max_PGY1 = 0

    # PGY2
    if rot_name in REQUIREMENTS["PGY2"]:
        min_PGY2 = min2
        max_PGY2 = max2
    else:
        min_PGY2 = 0
        max_PGY2 = 0

    # PGY3
    if rot_name in REQUIREMENTS["PGY3"]:
        min_PGY3 = min3
        max_PGY3 = max3
    else:
        min_PGY3 = 0
        max_PGY3 = 0

    new_rotation.set_min(min_PGY1, min_PGY2, min_PGY3)
    new_rotation.set_max(max_PGY1, max_PGY2, max_PGY3)
    ROTATIONS.append(new_rotation)

    # Increment ID count for new rotation
    id_count += 1

# --------------------
# FIRST AND LAST NAMES
# --------------------

import csv

with open("../data/first_name.csv", "r") as myfile:
    FIRST_NAMES = myfile.read()

    # This is a hack to make it work with both Python 2.7 and Python 3.5
    first_names1 = FIRST_NAMES.split("\r")
    first_names2 = FIRST_NAMES.split("\n")
    if len(first_names1) > len(first_names2): FIRST_NAMES = first_names1
    else: FIRST_NAMES = first_names2
    myfile.close()

with open("../data/last_name.csv", "r") as myfile:
    LAST_NAMES = myfile.read()

    # This is a hack to make it work with both Python 2.7 and Python 3.5
    last_names1 = LAST_NAMES.split("\r")
    last_names2 = LAST_NAMES.split("\n")
    if len(last_names1) > len(last_names2): LAST_NAMES = last_names1
    else: LAST_NAMES = last_names2
    myfile.close()

LEN_FIRST = len(FIRST_NAMES)
LEN_LAST = len(LAST_NAMES)

# --------
# TRAINEES
# --------

TRAINEES = []
first_names = random.sample(FIRST_NAMES, NUM_TRAINEES)
last_names = random.sample(LAST_NAMES, NUM_TRAINEES)
names = list(map(lambda x, y: x + " " + y, first_names, last_names))

for i in range(NUM_PGY1):
    TRAINEES.append(Class.Trainee(names[i], "PGY1", id = i))

for i in range(NUM_PGY1, NUM_PGY1 + NUM_PGY2):
    TRAINEES.append(Class.Trainee(names[i], "PGY2", id = i))

for i in range(NUM_PGY1 + NUM_PGY2, NUM_TRAINEES):
    TRAINEES.append(Class.Trainee(names[i], "PGY3", id = i))

# Add requirement for each trainee based on their role
for trainee in TRAINEES:
    trainee.create_requirements(REQUIREMENTS[trainee.role])
    trainee.create_limitations(LIMITATIONS[trainee.role])
    trainee.set_rotations(ROTATIONS)
    print(trainee)

# ---------------------------
# GREEDY SCHEDULING ALGORITHM
# ---------------------------

schedule = Class.Schedule(TRAINEES, ROTATIONS)
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

# -------------------
# VALIDATION MEDTRICS
# -------------------

for rotation in ROTATIONS:
    print(rotation.name)
    print(three_statistics(rotation, REQUIREMENTS, NUM_PGY1, NUM_PGY2, NUM_PGY3))
    #print(nine_statistics(rotation, REQUIREMENTS, NUM_PGY1, NUM_PGY2, NUM_PGY3))

# -------------
# VISUALIZATION
# -------------

# IMPORT

import pyglet
from pyglet.gl import gl

# WINDOW AND SETTINGS

window = Window(width=WIDTH, height=HEIGHT)
gl.glClearColor(*BACKGROUND_COLOR)

# Trainee and rotation labels
trainee_labels = create_labels(schedule.trainees, LABEL_TOP_LEFT, LABEL_SIZE, LABEL_HEIGHT)
rotation_labels = create_labels(schedule.rotations, LEGEND_LABEL_TOP_LEFT, LEGEND_SIZE, LEGEND_HEIGHT)
rotation_legends = create_legends(schedule.rotations)
rotation_legends_click_space = create_click_space(schedule.rotations)

# Unit squares
rot_squares = create_squares(schedule.trainees, NUM_BLOCK)
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
chart_bars = create_chart_bars(NUM_BLOCK)

# Underdone chart
underdone_quads = create_underdone_bars(schedule.trainees, schedule.rotations)

# Mark lines
mark_lines = create_superline(NUM_TRAINEES, NUM_BLOCK)

# Min lines
min_line = create_mark_line(NUM_BLOCK)
max_line = create_mark_line(NUM_BLOCK)

def draw_begin_state():
    window.clear()
    draw_labels(trainee_labels)
    draw_labels(rotation_labels)
    draw_super_quads(super_quads)
    draw_legends(rotation_legends)
    draw_bars(chart_bars)
    draw_bars(underdone_quads)
    mark_lines.draw()
    min_line.draw()
    max_line.draw()

def draw_animation():
    window.clear()
    draw_labels(trainee_labels)
    draw_labels(rotation_labels)
    draw_animated_quads(super_quads, ANIMATION_STEPS - window.steps)
    draw_legends(rotation_legends)
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

        temporary_quads = create_temporary_bars(schedule.trainees, schedule.rotations, rot_id)
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