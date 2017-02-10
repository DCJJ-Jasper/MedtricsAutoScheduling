# ---------------------------------
# IMPORT LIBRARIES AND DEPENDENCIES
# ---------------------------------

import random
import operator
import copy
import pyglet
import itertools
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
    # random.shuffle(trainees)

    # Search for appropriate trainees
    for trainee in trainees:
        if (n == 0): break
        if (trainee.role != role): continue
        else:
            if ((rot_name in trainee.base_reqs) and (trainee.processed_reqs[rot_name] > 0) and trainee.block[i].id == -1):
                trainee_list.append(trainee)
                n = n - 1

    # Return the list of trainee
    return trainee_list

def three_statistics(rotation, requirements, num_pgy1, num_pgy2, num_pgy3):
    min_demand = rotation.min1 * NUM_BLOCK + rotation.min2 * NUM_BLOCK + rotation.min3 * NUM_BLOCK
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

    max_demand = rotation.max1 * NUM_BLOCK + rotation.max2 * NUM_BLOCK + rotation.min3 * NUM_BLOCK
    return [min_demand, student_demand, max_demand]

def nine_statistics(rotation, requirements, num_pgy1, num_pgy2, num_pgy3):
    nine_stats = []

    # PGY1
    min_demand = rotation.min1 * NUM_BLOCK
    try:
        student_demand = num_pgy1 * requirements["PGY1"][rotation.name]
    except:
        student_demand = 0
    max_demand = rotation.max1 * NUM_BLOCK
    nine_stats.append([min_demand, student_demand, max_demand])

    # PGY2
    min_demand = rotation.min2 * NUM_BLOCK
    try:
        student_demand = num_pgy2 * requirements["PGY2"][rotation.name]
    except:
        student_demand = 0
    max_demand = rotation.max2 * NUM_BLOCK
    nine_stats.append([min_demand, student_demand, max_demand])

    # PGY3
    min_demand = rotation.min3 * NUM_BLOCK
    try:
        student_demand = num_pgy3 * requirements["PGY3"][rotation.name]
    except:
        student_demand = 0
    max_demand = rotation.max3 * NUM_BLOCK
    nine_stats.append([min_demand, student_demand, max_demand])

    return nine_stats

# --------------------
# MISCELLANEOUS HELPER
# --------------------

def pad_blank(s, length):
    if (len(s) > length): return s
    if (len(s) < length): return s + (length-len(s)) * " "
    return s

def gen_num_line(length):
    arr = [0] * 52
    for i in range(length):
        arr[i] = pad_blank(str(i + 1), ROT_NAME_LEN - 2)
    return arr

def to_decimal_color(color):
    r, g, b = color
    return (r / 255.0, g / 255.0, b / 255.0)

def to_decimal_color_alpha(color):
    r, g, b, a = color
    return (r / 255.0, g / 255.0, b / 255.0, a / 255.0)

def draw_quad(x1, y1, x2, y2, color):
    gl.glColor3f(*color)
    pyglet.graphics.draw_indexed(4, pyglet.gl.GL_TRIANGLES,
                             [0, 1, 2, 0, 2, 3],
                             ('v2i', [x1, HEIGHT - y1,
                                      x2, HEIGHT - y1,
                                      x2, HEIGHT - y2,
                                      x1, HEIGHT - y2])
                             )

def create_superquad(squares):
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

def create_legends(rotations):
    squares = []
    rot_count = 0
    start_x, start_y = LEGEND_TOP_LEFT
    for rot in rotations:
        rot_name = rot.name
        rot_id = rot.id
        try:
            color = ROTATIONS_COLOR[rot.id]
        except:
            color = ROTATIONS_COLOR[-1]
        x1 = start_x
        y1 = start_y + rot_count * SQUARE_HEIGHT
        x2 = start_x + SQUARE_SIZE
        y2 = start_y + rot_count * SQUARE_HEIGHT + SQUARE_SIZE
        squares.append(Class.Square(x1, y1, x2, y2, color, rot_name, rot_id))
        rot_count += 1
    return squares

def create_click_space(rotations):
    squares = []
    rot_count = 0
    start_x, start_y = LEGEND_TOP_LEFT
    for rot in rotations:
        rot_name = rot.name
        rot_id = rot.id
        try:
            color = ROTATIONS_COLOR[rot.id]
        except:
            color = ROTATIONS_COLOR[-1]
        x1 = start_x
        y1 = start_y + rot_count * SQUARE_HEIGHT
        x2 = start_x + LEGEND_CLICK_LENGTH
        y2 = start_y + rot_count * SQUARE_HEIGHT + SQUARE_SIZE
        squares.append(Class.ClickSquare(x1, y1, x2, y2, color, rot_name, rot_id))
        rot_count += 1
    return squares

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

def create_squares(trainees):
    squares = []
    trainee_count = 0
    start_x, start_y = SQUARE_TOP_LEFT
    for trainee in trainees:
        # Draw the trainee courses
        rot_count = 0
        for i in range(NUM_BLOCK):
            rot = trainee.block[i]
            try:
                color = ROTATIONS_COLOR[rot.id]
            except:
                color = ROTATIONS_COLOR[-1]

            # If this is the same rot with next rotation
            if (i < NUM_BLOCK - 1) and (rot != "   ") and (trainee.block[i + 1] != "   ") and (
                rot.id == trainee.block[i + 1].id):
                x1 = start_x + rot_count * UNIT_RANGE
                y1 = start_y + trainee_count * SQUARE_HEIGHT
                x2 = start_x + (rot_count + 1) * UNIT_RANGE
                y2 = start_y + trainee_count * SQUARE_HEIGHT + SQUARE_SIZE
            else:
                x1 = start_x + rot_count * UNIT_RANGE
                y1 = start_y + trainee_count * SQUARE_HEIGHT
                x2 = start_x + rot_count * UNIT_RANGE + SQUARE_SIZE
                y2 = start_y + trainee_count * SQUARE_HEIGHT + SQUARE_SIZE
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

def create_chart_bars():
    bars = []
    base_x, base_y = CHART_TOP_LEFT
    for col_num in range(NUM_BLOCK):
        bars.append(Class.ChartBar(base_x + UNIT_RANGE * col_num, base_y, col_num))
    return bars

def create_underdone_bars(trainees, rotations):
    # Create a bar dictionary
    bars = {}
    for i in range(len(rotations)):
        bars[i] = []

    # Add smaller bars to bars dictionary
    base_x, base_y = UNDERDONE_TOP_LEFT
    trainee_count = 0
    for trainee in trainees:
        underdone_arr = trainee.get_underdone_array()
        for i in range(len(underdone_arr)):
            # Calculate starting_x and bar_length
            if i == 0:
                bar_length = underdone_arr[0]
                start_x = base_x
            else:
                bar_length = underdone_arr[i] - underdone_arr[i-1]
                start_x = base_x + underdone_arr[i-1] * UNDERDONE_UNIT_LENGTH

            bars[i].append(Class.UnderdoneBar(start_x,
                                           base_y + UNDERDONE_HEIGHT * trainee_count,
                                           bar_length * UNDERDONE_UNIT_LENGTH,
                                           i))
        trainee_count += 1

    # Now create those super quad and add to bar list
    bars_list = []
    for i in range(len(rotations)):
        bars_list.append(create_animated_superquad(bars[i]))
    return bars_list

def create_temporary_bars(trainees, rotations, rot_id):
    # Create a bar dictionary
    bars = {}
    for i in range(len(rotations)):
        bars[i] = []

    # Add smaller bars to bars dictionary
    base_x, base_y = UNDERDONE_TOP_LEFT
    trainee_count = 0
    for trainee in trainees:
        underdone_arr = trainee.get_temp_underdone_array(rot_id)
        for i in range(len(underdone_arr)):
            # Calculate starting_x and bar_length
            if i == 0:
                bar_length = underdone_arr[0]
                start_x = base_x
            else:
                bar_length = underdone_arr[i] - underdone_arr[i - 1]
                start_x = base_x + underdone_arr[i - 1] * UNDERDONE_UNIT_LENGTH

            bars[i].append(Class.UnderdoneBar(start_x,
                                              base_y + UNDERDONE_HEIGHT * trainee_count,
                                              bar_length * UNDERDONE_UNIT_LENGTH,
                                              i))
        trainee_count += 1

    # Now create those super quad and add to bar list
    bars_list = []
    for i in range(len(rotations)):
        bars_list.append(create_animated_superquad(bars[i]))
    return bars_list

def create_superline(num_trainees, num_block):
    lines = []

    # Generate all markers for the rotations count on the bottom
    base_x, base_y = BELOW_MARK_TOP_LEFT
    line_length = num_block * UNIT_RANGE - SQUARE_DISTANCE
    for trainee_count in range(num_trainees):
        line_y = base_y - trainee_count * CHART_UNIT_HEIGHT
        lines.append(Class.Line(base_x,
                          line_y,
                          base_x + line_length,
                          line_y))

    # Now general all markers for the underdone on the right
    base_x, base_y = RIGHT_MARK_TOP_LEFT
    line_length = num_trainees * LABEL_HEIGHT
    for block_count in range(NUM_BLOCK):
        line_x = base_x + block_count * UNDERDONE_UNIT_LENGTH
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

def create_mark_line(num_blocks):
    base_x, base_y = BELOW_MARK_TOP_LEFT
    line_length = num_blocks * UNIT_RANGE - SQUARE_DISTANCE
    return Class.MarkLine(base_x - MIN_LINE_EXTENSION,
                         base_x + line_length + MIN_LINE_EXTENSION,
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


