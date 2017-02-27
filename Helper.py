# ---------------------------------
# IMPORT LIBRARIES AND DEPENDENCIES
# ---------------------------------

import random
import operator
import copy
import pyglet
import itertools
import numpy as np

from pyglet.gl import gl
import Class

from Constants import *

# ------------------
# SCHEDULE UTILITIES
# ------------------

def search_trainee(n, role, rot_name, trainees, i):
    '''
        Find n students of a specific role that still needs to fulfill a rot
    '''
    # TODO: To make things more random, we can perhaps randomize the list trainees here
    # Initialize the trainee_list
    trainee_list = []

    # TODO: Randomize the trainee list
    random.shuffle(trainees)

    # Search for appropriate trainees
    for trainee in trainees:
        if (n == 0): break
        if (trainee.role != role): continue
        else:
            if ((rot_name in trainee.base_reqs) and (trainee.processed_reqs[rot_name] > 3) and trainee.block[
                i].id == -1 and trainee.block[i + 1].id == -1 and trainee.block[i + 2].id == -1 and trainee.block[i + 3].id == -1):
                trainee_list.append(trainee)
                n = n - 1

    # Return the list of trainee
    return trainee_list

def three_statistics(rotation, requirements, num_pgy1, num_pgy2, num_pgy3, num_block = NUM_BLOCK):
    min_demand = rotation.min1 * num_block + rotation.min2 * num_block + rotation.min3 * num_block
    student_demand = 0
    try:
        student_demand += num_pgy1 * requirements["PGY1"][rotation.name]
    except:
        student_demand += 0

    try:
        student_demand += num_pgy2 * requirements["PGY2"][rotation.name]
    except:
        student_demand += 0

    try:
        student_demand += num_pgy3 * requirements["PGY3"][rotation.name]
    except:
        student_demand += 0

    max_demand = rotation.max1 * num_block + rotation.max2 * num_block + rotation.min3 * num_block
    return [min_demand, student_demand, max_demand]

def nine_statistics(rotation, requirements, num_pgy1, num_pgy2, num_pgy3, num_block = NUM_BLOCK):
    nine_stats = []

    # PGY1
    min_demand = rotation.min1 * num_block
    try:
        student_demand = num_pgy1 * requirements["PGY1"][rotation.name]
    except:
        student_demand = 0
    max_demand = rotation.max1 * num_block
    nine_stats.append([min_demand, student_demand, max_demand])

    # PGY2
    min_demand = rotation.min2 * num_block
    try:
        student_demand = num_pgy2 * requirements["PGY2"][rotation.name]
    except:
        student_demand = 0
    max_demand = rotation.max2 * num_block
    nine_stats.append([min_demand, student_demand, max_demand])

    # PGY3
    min_demand = rotation.min3 * num_block
    try:
        student_demand = num_pgy3 * requirements["PGY3"][rotation.name]
    except:
        student_demand = 0
    max_demand = rotation.max3 * num_block
    nine_stats.append([min_demand, student_demand, max_demand])

    return nine_stats

# --------------------
# MISCELLANEOUS HELPER
# --------------------

def pad_blank(s, length):
    if (len(s) > length): return s
    if (len(s) < length): return s + (length-len(s)) * " "
    return s

def gen_num_line(length, rot_name_len = ROT_NAME_LEN):
    arr = [0] * 52
    for i in range(length):
        arr[i] = pad_blank(str(i + 1), rot_name_len - 2)
    return arr

def to_decimal_color(color):
    r, g, b = color
    return (r / 255.0, g / 255.0, b / 255.0)

def to_decimal_color_alpha(color):
    r, g, b, a = color
    return (r / 255.0, g / 255.0, b / 255.0, a / 255.0)

def draw_quad(x1, y1, x2, y2, color, screen_height = HEIGHT):
    gl.glColor3f(*color)
    pyglet.graphics.draw_indexed(4, pyglet.gl.GL_TRIANGLES,
                             [0, 1, 2, 0, 2, 3],
                             ('v2i', [x1, screen_height - y1,
                                      x2, screen_height - y1,
                                      x2, screen_height - y2,
                                      x1, screen_height - y2])
                             )

def create_superquad(squares, screen_height = HEIGHT):
    id = squares[0].id
    color = squares[0].color
    indices_array = []
    points_array = []
    count = 0
    for square in squares:
        x1 = square.x1
        x2 = square.x2
        y1 = square.y1
        y2 = square.y2
        points_array.append([x1, screen_height - y1,
                             x2, screen_height - y1,
                             x2, screen_height - y2,
                             x1, screen_height - y2])
        offset = count * 4
        indices_array.append([offset, offset + 1, offset + 2, offset, offset + 2, offset + 3])
        count += 1
    indices_array = list(itertools.chain.from_iterable(indices_array))
    points_array = list(itertools.chain.from_iterable(points_array))
    return Class.SuperQuad(id, count * 4, indices_array, points_array, color)

def create_animated_superquad(squares):
    id = squares[0].id
    color = squares[0].color
    indices_array = []
    points_array = []
    count = 0
    for square in squares:
        x1 = square.x1
        x2 = square.x2
        y1 = square.y1
        y2 = square.y2
        points_array.append([x1, HEIGHT - y1,
                             x2, HEIGHT - y1,
                             x2, HEIGHT - y2,
                             x1, HEIGHT - y2])
        offset = count * 4
        indices_array.append([offset, offset + 1, offset + 2, offset, offset + 2, offset + 3])
        count += 1
    indices_array = list(itertools.chain.from_iterable(indices_array))
    points_array = list(itertools.chain.from_iterable(points_array))
    return Class.AnimatedSuperQuad(id, count * 4, indices_array, points_array, color)

def find_curr_square(sqr_list, x, y):
    y = HEIGHT - y
    for sqr in sqr_list:
        if x >= sqr.x1 and x <= sqr.x2:
            if y <= sqr.y2 and y >= sqr.y1:
                return sqr
    return None

def create_legends(rotations, legend_top_left = LEGEND_TOP_LEFT, rotations_color = ROTATIONS_COLOR,
                   square_height = SQUARE_HEIGHT, square_size = SQUARE_SIZE):
    squares = []
    rot_count = 0
    start_x, start_y = legend_top_left
    for rot in rotations:
        rot_name = rot.name
        rot_id = rot.id
        try:
            color = rotations_color[rot.id]
        except:
            color = rotations_color[-1]
        x1 = start_x
        y1 = start_y + rot_count * square_height
        x2 = start_x + square_size
        y2 = start_y + rot_count * square_height + square_size
        squares.append(Class.Square(x1, y1, x2, y2, color, rot_name, rot_id))
        rot_count += 1
    return squares

def create_click_space(rotations, legend_top_left = LEGEND_TOP_LEFT, rotations_color = ROTATIONS_COLOR,
                       square_height = SQUARE_HEIGHT, square_size = SQUARE_SIZE,
                       legend_click_length = LEGEND_CLICK_LENGTH):
    squares = []
    rot_count = 0
    start_x, start_y = legend_top_left
    for rot in rotations:
        rot_name = rot.name
        rot_id = rot.id
        try:
            color = rotations_color[rot.id]
        except:
            color = rotations_color[-1]
        x1 = start_x
        y1 = start_y + rot_count * square_height
        x2 = start_x + legend_click_length
        y2 = start_y + rot_count * square_height + square_size
        squares.append(Class.ClickSquare(x1, y1, x2, y2, color, rot_name, rot_id))
        rot_count += 1
    return squares

def create_trainee_labels(trainees, top_left, label_size, label_height,
                  color=(0, 0, 0, 255), font_name="Open Sans"):
    labels = []
    count = 0
    base_x, base_y = top_left
    for trainee in trainees:
        # Draw the trainee labels
        labels.append(pyglet.text.Label(trainee.role[-1] + " - " + trainee.name,
                                        font_name=font_name,
                                        color=color,
                                        font_size=label_size,
                                        x=base_x, y=base_y - count * label_height,
                                        anchor_x="left", anchor_y="top"))
        count += 1
    
    return labels

def create_labels(objects, top_left, label_size, label_height,
                      color=(0, 0, 0, 255), font_name="Open Sans"):
    labels = []
    count = 0
    base_x, base_y = top_left
    for obj in objects:
        # Draw the trainee labels
        labels.append(pyglet.text.Label(obj.name,
                                        font_name=font_name,
                                        color=color,
                                        font_size=label_size,
                                        x=base_x, y=base_y - count * label_height,
                                        anchor_x="left", anchor_y="top"))
        count += 1

    return labels

def create_squares(trainees, num_block,
                   square_top_left = SQUARE_TOP_LEFT,
                   rotations_color = ROTATIONS_COLOR,
                   unit_range = UNIT_RANGE, square_height = SQUARE_HEIGHT, square_size = SQUARE_SIZE):
    squares = []
    trainee_count = 0
    start_x, start_y = square_top_left
    for trainee in trainees:
        # Draw the trainee courses
        rot_count = 0
        for i in range(num_block):
            rot = trainee.block[i]
            try:
                color = rotations_color[rot.id]
            except:
                color = rotations_color[-1]

            # If this is the same rot with next rotation
            if (i < num_block - 1) and (rot != "   ") and (trainee.block[i + 1] != "   ") and (
                rot.id == trainee.block[i + 1].id):
                x1 = start_x + rot_count * unit_range
                y1 = start_y + trainee_count * square_height
                x2 = start_x + (rot_count + 1) * unit_range
                y2 = start_y + trainee_count * square_height + square_size
            else:
                x1 = start_x + rot_count * unit_range
                y1 = start_y + trainee_count * square_height
                x2 = start_x + rot_count * unit_range + square_size
                y2 = start_y + trainee_count * square_height + square_size
            new_square = Class.Square(x1, y1, x2, y2, color, rot.name, rot.id)
            squares.append(new_square)
            rot_count += 1
        trainee_count += 1
    return squares

def create_square_dict(squares):
    d = {}
    for square in squares:
        if not square.id in d:
            d[square.id] = [square]
        else:
            d[square.id].append(square)
    return d

def create_chart_bars(num_block, chart_top_left = CHART_TOP_LEFT, unit_range = UNIT_RANGE):
    bars = []
    base_x, base_y = chart_top_left
    for col_num in range(num_block):
        bars.append(Class.ChartBar(base_x + unit_range * col_num, base_y, col_num))
    return bars

def create_underdone_bars(trainees, rotations,
                          underdone_top_left = UNDERDONE_TOP_LEFT,
                          underdone_unit_length = UNDERDONE_UNIT_LENGTH,
                          underdone_height = UNDERDONE_HEIGHT):
    # Create a bar dictionary
    bars = {}
    for i in range(len(rotations)):
        bars[i] = []

    # Add smaller bars to bars dictionary
    base_x, base_y = underdone_top_left
    trainee_count = 0
    for trainee in trainees:
        underdone_arr = trainee.get_underdone_array()
        underdone_arr = np.array(underdone_arr).astype(int)

        for i in range(len(underdone_arr)):
            # Calculate starting_x and bar_length
            if i == 0:
                bar_length = underdone_arr[0]
                start_x = base_x
            else:
                bar_length = underdone_arr[i] - underdone_arr[i-1]
                start_x = base_x + underdone_arr[i-1] * underdone_unit_length

            bars[i].append(Class.UnderdoneBar(start_x,
                                           base_y + underdone_height * trainee_count,
                                           bar_length * underdone_unit_length,
                                           i))
        trainee_count += 1

    # Now create those super quad and add to bar list
    bars_list = []
    for i in range(len(rotations)):
        bars_list.append(create_animated_superquad(bars[i]))
    return bars_list

def create_temporary_bars(trainees, rotations, rot_id,
                          underdone_top_left = UNDERDONE_TOP_LEFT,
                          underdone_unit_length = UNDERDONE_UNIT_LENGTH,
                          underdone_height = UNDERDONE_HEIGHT):
    # Create a bar dictionary
    bars = {}
    for i in range(len(rotations)):
        bars[i] = []

    # Add smaller bars to bars dictionary
    base_x, base_y = underdone_top_left
    trainee_count = 0
    for trainee in trainees:
        underdone_arr = trainee.get_temp_underdone_array(rot_id)
        underdone_arr = np.array(underdone_arr).astype(int)

        for i in range(len(underdone_arr)):
            # Calculate starting_x and bar_length
            if i == 0:
                bar_length = underdone_arr[0]
                start_x = base_x
            else:
                bar_length = underdone_arr[i] - underdone_arr[i - 1]
                start_x = base_x + underdone_arr[i - 1] * underdone_unit_length

            bars[i].append(Class.UnderdoneBar(start_x,
                                              base_y + underdone_height * trainee_count,
                                              bar_length * underdone_unit_length,
                                              i))
        trainee_count += 1

    # Now create those super quad and add to bar list
    bars_list = []
    for i in range(len(rotations)):
        bars_list.append(create_animated_superquad(bars[i]))
    return bars_list

def create_superline(num_trainees, num_block,
                     below_mark_top_left = BELOW_MARK_TOP_LEFT, right_mark_top_left = RIGHT_MARK_TOP_LEFT,
                     unit_range = UNIT_RANGE, square_distance = SQUARE_DISTANCE,
                     chart_unit_height = CHART_UNIT_HEIGHT,
                     underdone_unit_length = UNDERDONE_UNIT_LENGTH,
                     label_height = LABEL_HEIGHT):
    lines = []

    # Generate all markers for the rotations count on the bottom
    base_x, base_y = below_mark_top_left
    line_length = num_block * unit_range - square_distance
    for trainee_count in range(num_trainees):
        line_y = base_y - trainee_count * chart_unit_height
        lines.append(Class.Line(base_x,
                          line_y,
                          base_x + line_length,
                          line_y))

    # Now general all markers for the underdone on the right
    base_x, base_y = right_mark_top_left
    line_length = num_trainees * label_height
    for block_count in range(num_block):
        line_x = base_x + block_count * underdone_unit_length
        lines.append(Class.Line(line_x,
                          base_y,
                          line_x,
                          base_y - line_length))

    # Now create the superline.
    num_lines = len(lines)
    points_array = []
    for line in lines:
        points_array.append(line.x1)
        points_array.append(line.y1)
        points_array.append(line.x2)
        points_array.append(line.y2)

    return Class.SuperLine(num_lines, points_array)

def create_mark_line(num_blocks, below_mark_top_left = BELOW_MARK_TOP_LEFT,
                     unit_range=UNIT_RANGE, square_distance=SQUARE_DISTANCE,
                     min_line_extension = MIN_LINE_EXTENSION
                     ):
    base_x, base_y = below_mark_top_left
    line_length = num_blocks * unit_range - square_distance
    return Class.MarkLine(base_x - min_line_extension,
                         base_x + line_length + min_line_extension,
                         base_y)

def create_schedule(rot_arr):
    '''
    This function will create a new schedule by taking the data from the 2D array
    :param rot_arr:
    :return:
    '''

# ---------------
# DRAWING HELPERS
# ---------------

def draw_squares(squares):
    for square in squares:
        square.draw()

def draw_animated_squares(squares, steps):
    for square in squares:
        square.draw_animated(steps)

def draw_super_quads(quads):
    for quad in quads:
        quad.draw()

def draw_animated_quads(quads, steps):
    for quad in quads:
        quad.draw_animated(steps)

def draw_labels(labels):
    for label in labels:
        label.draw()

def draw_bars(bars):
    for bar in bars:
        bar.draw()

def draw_animated_bars(bars, steps):
    for bar in bars:
        bar.draw_animated(steps)


def draw_legends(squares):
    for square in squares:
        square.draw()