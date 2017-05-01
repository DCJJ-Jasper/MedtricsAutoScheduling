# ---------------------------------
# IMPORT LIBRARIES AND DEPENDENCIES
# ---------------------------------

import random

from Constants import *

# ------------------
# SCHEDULE UTILITIES
# ------------------

def search_trainee(n, role, rot_name, trainees, i):
    '''
        Find n students of a specific role that still needs to fulfill a rot
    '''

    # Initialize the trainee_list
    trainee_list = []


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