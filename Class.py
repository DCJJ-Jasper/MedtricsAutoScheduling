# Author:
# Jasper Ding
# Son Pham



# ---------------------------------
# IMPORT LIBRARIES AND DEPENDENCIES
# ---------------------------------

import random
import operator
import copy
import numpy as np
import csv

import pyglet
from pyglet.gl import gl

from Constants import *
import Helper

# -------
# CLASSES
# -------

class Trainee:
    '''
        Trainee is someone who participates in a program.
        - role: It can be either PGY1, PGY2, PGY3, which are the years he participated the program
        - base_reqs: These are requirements that he needs to accomplish in order to complete the program
        - processed_reqs: This variable is used in the scheduling algorithm. It reflects the requirements still have to
                          be completed.
        - block: This store the schedule of the trainee.
    '''
    def __init__(self, name, role, id = -1, num_block = NUM_BLOCK):
        # Basic attributes
        self.name = name
        self.role = role
        self.id = id
        self.num_block = num_block
        # contain requirements for the trainee (dictionary)
        self.base_reqs = {}
        self.processed_reqs = {}
        # limit of each rotation a trainee can take(dictionary)
        self.base_limits = {}
        self.processed_limits = {}
        # Final answer will save in block attribute
        self.block = [Rotation("EMPTY", -1)] * self.num_block

    def __repr__(self):
        return Helper.pad_blank(self.name, TRAINEE_NAME_LEN) + " - " + self.role

    #  Setter
    def set_rotations(self, rotations):
        self.rotations = rotations

    def create_requirements(self, d_req):
        self.base_reqs = copy.deepcopy(d_req)
        self.processed_reqs = copy.deepcopy(d_req)

    def create_limitations(self, d_lim):
        self.base_limits = copy.deepcopy(d_lim)
        self.processed_limits = copy.deepcopy(d_lim)

    def reset_requirements(self):
        self.processed_reqs = copy.deepcopy(self.base_reqs)

    def reset_limitations(self):
        self.processed_limits = copy.deepcopy(self.base_limits)

    def reset_block(self):
        self.block = [-1] * self.num_block

    # Statistical functions
    def overdone_blocks(self):
        '''
        :return: The number of blocks that were done more than necessary by the students
        '''
        self.num_blocks = 0
        for req in self.processed_reqs:
            if self.processed_reqs[req] < 0:
                self.num_blocks -= self.processed_reqs[req]
        return self.num_blocks

    def underdone_blocks(self):
        '''
        :return: The number of requirement blocks that students still need to complete
        '''
        self.num_blocks = 0
        for req in self.processed_reqs:
            if self.processed_reqs[req] > 0:
                self.num_blocks += self.processed_reqs[req]
        return self.num_blocks

    def blank_blocks(self):
        '''
        :return: The number of blocks that still need to be scheduled by the students
        '''
        self.num_blocks = 0
        for block in self.block:
            if (block.id == -1):
                self.num_blocks += 1
        return self.num_blocks

    def get_underdone_array(self):
        '''
        :return: An array of underdone information that serves the graphic purpose
        '''
        arr = []

        # Append underdone of first rotation
        rot_name = self.rotations[0].name
        if self.processed_reqs[rot_name] > 0:
            arr.append(self.processed_reqs[rot_name])
        else:
            arr.append(0)

        # Append underdone of remaining rotations
        for rot in self.rotations[1:]:
            rot_name = rot.name
            if self.processed_reqs[rot_name] > 0:
                arr.append(arr[-1] + self.processed_reqs[rot_name])
            else:
                arr.append(arr[-1])
        return arr

    def get_temp_underdone_array(self, rot_id):
        '''
        :return: An array of temporary underdone information that serves the graphic purpose
        '''
        arr = [0] * len(self.rotations)
        rot_name = self.rotations[rot_id].name
        if self.processed_reqs[rot_name] > 0:
            arr[rot_id] = self.processed_reqs[rot_name]
        else:
            arr[rot_id] = 0

        for i in range(rot_id, len(self.rotations)):
            arr[i] = arr[rot_id]
        return arr

    def get_overdone_array(self):
        '''
            :return: An array of overdone information that serves the graphic purpose
        '''
        arr = []

        # Append underdone of first rotation
        rot_name = self.rotations[0].name
        if self.processed_reqs[rot_name] < 0:
            arr.append(- self.processed_reqs[rot_name])
        else:
            arr.append(0)

        # Append underdone of remainisng rotations
        for rot in self.rotations[1:]:
            rot_name = rot.name
            if self.processed_reqs[rot_name] < 0:
                arr.append(arr[-1] - self.processed_reqs[rot_name])
            else:
                arr.append(arr[-1])
        return arr

    # Printing functions
    def print_satisfaction_index(self):
        '''
        :return: The number of overdone and underdone blocks
        '''
        print(self)
        print("- Overdone blocks:", self.overdone_blocks())
        print("- Underdone blocks:", self.underdone_blocks())

    # Helpful output functions
    def get_schedule_text(self):
        s = ""
        for i in range(self.num_block):
            s += str(self.block[i].id) + "."
        return s[:-1]

class Rotation:
    '''
        Rotation is a department of a hospital. The rotation can occur in one site or in multiple site.
        Each site needs a minimum number of people in a particular role to function.
        For simplicity, we will temporarily assume that each rotation has one site.
    '''
    def __init__(self, name, id, vacation_allowed = False, min_block_length = 1.0, type = "Core", num_block = NUM_BLOCK):
        self.name = name
        self.id = id
        self.min_block_length = min_block_length
        self.type = type
        self.num_block = num_block

        # Min, max cap for the rotation
        self.min1 = -1
        self.min2 = -1
        self.min3 = -1
        self.min12 = -1
        self.min13 = -1
        self.min23 = -1
        self.mintotal = -1

        self.max1 = -1
        self.max2 = -1
        self.max3 = -1
        self.max12 = -1
        self.max13 = -1
        self.max23 = -1
        self.maxtotal = -1

        # Processed, min, max cap
        self.processed_min1 = [0] * self.num_block
        self.processed_min2 = [0] * self.num_block
        self.processed_min3 = [0] * self.num_block
        self.processed_min12 = [0] * self.num_block
        self.processed_min13 = [0] * self.num_block
        self.processed_min23 = [0] * self.num_block
        self.processed_mintotal = [0] * self.num_block

        self.processed_max1 = [0] * self.num_block
        self.processed_max2 = [0] * self.num_block
        self.processed_max3 = [0] * self.num_block
        self.processed_max12 = [0] * self.num_block
        self.processed_max13 = [0] * self.num_block
        self.processed_max23 = [0] * self.num_block
        self.processed_maxtotal = [0] * self.num_block

    # Getter and setters
    def get_min1(self):
        return self.min1

    def get_min2(self):
        return self.min2

    def get_min3(self):
        return self.min3

    def get_min12(self):
        return self.min12

    def get_min13(self):
        return self.min13

    def get_min23(self):
        return self.min23

    def get_mintotal(self):
        return self.mintotal

    def get_max1(self):
        return self.max1

    def get_max2(self):
        return self.max2

    def get_max3(self):
        return self.max3

    def get_max12(self):
        return self.max12

    def get_max13(self):
        return self.max13

    def get_max23(self):
        return self.max23

    def get_maxtotal(self):
        return self.maxtotal

    def set_min(self, min1, min2, min3, min12, min13, min23, mintotal):
        self.min1 = min1
        self.min2 = min2
        self.min3 = min3
        self.min12 = min12
        self.min13 = min13
        self.min23 = min23
        self.mintotal = mintotal

        self.processed_min1 = [min1] * self.num_block
        self.processed_min2 = [min2] * self.num_block
        self.processed_min3 = [min3] * self.num_block
        self.processed_min12 = [min12] * self.num_block
        self.processed_min13 = [min13] * self.num_block
        self.processed_min23 = [min23] * self.num_block
        self.processed_mintotal = [mintotal] * self.num_block

    def set_max(self, max1, max2, max3, max12, max13, max23, maxtotal):
        self.max1 = max1
        self.max2 = max2
        self.max3 = max3
        self.max12 = max12
        self.max13 = max13
        self.max23 = max23
        self.maxtotal = maxtotal

        self.processed_max1 = [max1] * self.num_block
        self.processed_max2 = [max2] * self.num_block
        self.processed_max3 = [max3] * self.num_block
        self.processed_max12 = [max12] * self.num_block
        self.processed_max13 = [max13] * self.num_block
        self.processed_max23 = [max23] * self.num_block
        self.processed_maxtotal = [maxtotal] * self.num_block

    def reset_cap(self):
        self.processed_min1 = [self.min1] * self.num_block
        self.processed_min2 = [self.min2] * self.num_block
        self.processed_min3 = [self.min3] * self.num_block

        self.processed_max1 = [self.max1] * self.num_block
        self.processed_max2 = [self.max2] * self.num_block
        self.processed_max3 = [self.max3] * self.num_block

    def reset_min(self):
        self.processed_min1 = [self.min1] * self.num_block
        self.processed_min2 = [self.min2] * self.num_block
        self.processed_min3 = [self.min3] * self.num_block

    # String representation
    def __repr__(self):
        return Helper.pad_blank(self.name[0] + "-" + str(self.id), ROT_NAME_LEN)

    def toStringWithCaps(self):
        return "(PGY1 Min: " + str(self.min1) + ", Max: " + str(self.max1) + ")\n" + \
               "(PGY2 Min: " + str(self.min2) + ", Max: " + str(self.max2) + ")\n" + \
               "(PGY3 Min: " + str(self.min3) + ", Max: " + str(self.max3) + ")\n"

    def print_processed_reqs(self):
        print(Helper.pad_blank(self.name, ROTATON_NAME_LEN) + str(self.processed_min1))
        print(Helper.pad_blank("", ROTATON_NAME_LEN) + str(self.processed_min2))
        print(Helper.pad_blank("", ROTATON_NAME_LEN) + str(self.processed_min3))

class Schedule:
    """
    Schedule contains trainees and rotations. It also contains the scheduling method given these informations.
    """
    def __init__(self, trainees, rotations,
                 num_block = NUM_BLOCK, rotations_id = ROTATIONS_ID):
        # contain all trainees
        self.trainees = trainees
        # contain all rotations
        self.rotations = rotations
        # number of blocks
        self.num_block = num_block
        # contain the id of the rotation
        self.rotations_id = rotations_id
        # number of trainees
        self.num_trainees = len(trainees)

        # numbers of different roles
        self.num_pgy1 = 0
        self.num_pgy2 = 0
        self.num_pgy3 = 0
        # the requirements corresponding with the roles
        self.req_pgy1 = {}
        self.req_pgy2 = {}
        self.req_pgy3 = {}

        # update the numbers of different roles
        for trainee in self.trainees:
            if trainee.role == "PGY1":
                if (self.num_pgy1 == 0): self.req_pgy1 = trainee.base_reqs
                self.num_pgy1 += 1
            elif trainee.role == "PGY2":
                if (self.num_pgy2 == 0): self.req_pgy2 = trainee.base_reqs
                self.num_pgy2 += 1
            elif trainee.role == "PGY3":
                if (self.num_pgy3 == 0): self.req_pgy3 = trainee.base_reqs
                self.num_pgy3 += 1

    # fill a given rotation into the given block for a given trainee
    # Also, update all min and max
    # This function can be used for any roles
    def fill_in(self, trainee, i, rotation):
        trainee.block[i] = rotation
        if (trainee.role == "PGY1"):
            if (rotation.min1 != -1):
                rotation.processed_min1[i] -= 1 # Cut down min
                rotation.processed_max1[i] -= 1 # Cut down max
            elif (rotation.min12 != -1):
                rotation.processed_min12[i] -= 1  # Cut down min
                rotation.processed_max12[i] -= 1  # Cut down max
            elif (rotation.min13 != -1):
                rotation.processed_min13[i] -= 1  # Cut down min
                rotation.processed_max13[i] -= 1  # Cut down max
            elif (rotation.mintotal != -1):
                rotation.processed_mintotal[i] -= 1  # Cut down min
                rotation.processed_maxtotal[i] -= 1  # Cut down max
        elif (trainee.role == "PGY2"):
            if (rotation.min2 != -1):
                rotation.processed_min2[i] -= 1 # Cut down min
                rotation.processed_max2[i] -= 1 # Cut down max
            elif (rotation.min12 != -1):
                rotation.processed_min12[i] -= 1  # Cut down min
                rotation.processed_max12[i] -= 1  # Cut down max
            elif (rotation.min23 != -1):
                rotation.processed_min23[i] -= 1  # Cut down min
                rotation.processed_max23[i] -= 1  # Cut down max
            elif (rotation.mintotal != -1):
                rotation.processed_mintotal[i] -= 1  # Cut down min
                rotation.processed_maxtotal[i] -= 1  # Cut down max
        elif (trainee.role == "PGY3"):
            if (rotation.min3 != -1):
                rotation.processed_min3[i] -= 1 # Cut down min
                rotation.processed_max3[i] -= 1 # Cut down max
            elif (rotation.min23 != -1):
                rotation.processed_min23[i] -= 1  # Cut down min
                rotation.processed_max23[i] -= 1  # Cut down max
            elif (rotation.min13 != -1):
                rotation.processed_min13[i] -= 1  # Cut down min
                rotation.processed_max13[i] -= 1  # Cut down max
            elif (rotation.mintotal != -1):
                rotation.processed_mintotal[i] -= 1  # Cut down min
                rotation.processed_maxtotal[i] -= 1  # Cut down max
        if (rotation.name != "Blank"):
            trainee.processed_reqs[rotation.name] -= 1
            trainee.processed_limits[rotation.name] -= 1

    # fill a given rotation into the given block for a given list of PGY1 trainee
    # Also, update all min and max
    # This function can be only used for PGY1
    def fill_in_PGY1(self, trainees, i, rotation):
        for trainee in trainees:
            trainee.block[i] = rotation
            if (rotation.min1 != -1):
                rotation.processed_min1[i] -= 1 # Cut down min
                rotation.processed_max1[i] -= 1 # Cut down max
            elif (rotation.min12 != -1):
                rotation.processed_min12[i] -= 1  # Cut down min
                rotation.processed_max12[i] -= 1  # Cut down max
            elif (rotation.min13 != -1):
                rotation.processed_min13[i] -= 1  # Cut down min
                rotation.processed_max13[i] -= 1  # Cut down max
            elif (rotation.mintotal != -1):
                rotation.processed_mintotal[i] -= 1  # Cut down min
                rotation.processed_maxtotal[i] -= 1  # Cut down max
            trainee.processed_reqs[rotation.name] -= 1
            trainee.processed_limits[rotation.name] -= 1

    # fill a given rotation into the given block for a given list of PGY2 trainee
    # Also, update all min and max
    # This function can be only used for PGY2
    def fill_in_PGY2(self, trainees, i, rotation):
        for trainee in trainees:
            trainee.block[i] = rotation
            if (rotation.min2 != -1):
                rotation.processed_min2[i] -= 1 # Cut down min
                rotation.processed_max2[i] -= 1 # Cut down max
            elif (rotation.min12 != -1):
                rotation.processed_min12[i] -= 1  # Cut down min
                rotation.processed_max12[i] -= 1  # Cut down max
            elif (rotation.min23 != -1):
                rotation.processed_min23[i] -= 1  # Cut down min
                rotation.processed_max23[i] -= 1  # Cut down max
            elif (rotation.mintotal != -1):
                rotation.processed_mintotal[i] -= 1  # Cut down min
                rotation.processed_maxtotal[i] -= 1  # Cut down max
            trainee.processed_reqs[rotation.name] -= 1
            trainee.processed_limits[rotation.name] -= 1

    # fill a given rotation into the given block for a given list of PGY3 trainee
    # Also, update all min and max
    # This function can be only used for PGY3
    def fill_in_PGY3(self, trainees, i, rotation):
        for trainee in trainees:
            trainee.block[i] = rotation
            if (rotation.min3 != -1):
                rotation.processed_min3[i] -= 1 # Cut down min
                rotation.processed_max3[i] -= 1 # Cut down max
            elif (rotation.min23 != -1):
                rotation.processed_min23[i] -= 1  # Cut down min
                rotation.processed_max23[i] -= 1  # Cut down max
            elif (rotation.min13 != -1):
                rotation.processed_min13[i] -= 1  # Cut down min
                rotation.processed_max13[i] -= 1  # Cut down max
            elif (rotation.mintotal != -1):
                rotation.processed_mintotal[i] -= 1  # Cut down min
                rotation.processed_maxtotal[i] -= 1  # Cut down max
            trainee.processed_reqs[rotation.name] -= 1
            trainee.processed_limits[rotation.name] -= 1


    # greedy step1
    # For each roles of trainees,
    # This function goes through each whole block for each rotation.
    # For each rotation, a helper function finds at most (rotation min) number of trainees with unsatisfied educational requirements for that rotation.
    # Finally, this function calls appropriate fill-in function to fill the schedule.
    def greedy_step1_4(self):

        trainees = self.trainees
        rotations = self.rotations
        if (DEBUG_MODE):
            print("")
            print("")
            print("")


        for i in range(int(self.num_block/4)):

            for rotation in rotations:

                min_PGY1 = 0
                min_PGY2 = 0
                min_PGY3 = 0

                rot_name = rotation.name
                rot_id = rotation.id
                if (rotation.min1 != -1):
                    min_PGY1 = rotation.processed_min1[4 * i]
                elif (rotation.min12 != -1):
                    min_PGY1 = rotation.processed_min12[4 * i]
                elif (rotation.min13 != -1):
                    min_PGY1 = rotation.processed_min13[4 * i]
                elif (rotation.mintotal != -1):
                    min_PGY1 = rotation.processed_mintotal[4 * i]

                if (min_PGY1 > 0):
                    avail_trainees = Helper.search_trainee(min_PGY1, "PGY1", rot_name, trainees, 4 * i)
                    self.fill_in_PGY1(avail_trainees, 4 * i, rotation)
                    self.fill_in_PGY1(avail_trainees, 4 * i + 1, rotation)
                    self.fill_in_PGY1(avail_trainees, 4 * i + 2, rotation)
                    self.fill_in_PGY1(avail_trainees, 4 * i + 3, rotation)

                if (rotation.min2 != -1):
                    min_PGY2 = rotation.processed_min2[4 * i]
                elif (rotation.min12 != -1):
                    min_PGY2 = rotation.processed_min12[4 * i]
                elif (rotation.min23 != -1):
                    min_PGY2 = rotation.processed_min23[4 * i]
                elif (rotation.mintotal != -1):
                    min_PGY2 = rotation.processed_mintotal[4 * i]

                if (min_PGY2 > 0):
                    avail_trainees = Helper.search_trainee(min_PGY2, "PGY2", rot_name, trainees, 4*i)
                    self.fill_in_PGY2(avail_trainees, 4*i, rotation)
                    self.fill_in_PGY2(avail_trainees, 4*i+1, rotation)
                    self.fill_in_PGY2(avail_trainees, 4*i+2, rotation)
                    self.fill_in_PGY2(avail_trainees, 4*i+3, rotation)

                if (rotation.min3 != -1):
                    min_PGY3 = rotation.processed_min3[4 * i]
                elif (rotation.min23 != -1):
                    min_PGY3 = rotation.processed_min23[4 * i]
                elif (rotation.min13 != -1):
                    min_PGY3 = rotation.processed_min13[4 * i]
                elif (rotation.mintotal != -1):
                    min_PGY3 = rotation.processed_mintotal[4 * i]

                if (min_PGY3 > 0):
                    avail_trainees = Helper.search_trainee(min_PGY3, "PGY3", rot_name, trainees, 4*i)
                    self.fill_in_PGY3(avail_trainees, 4*i, rotation)
                    self.fill_in_PGY3(avail_trainees, 4*i+1, rotation)
                    self.fill_in_PGY3(avail_trainees, 4*i+2, rotation)
                    self.fill_in_PGY3(avail_trainees, 4*i+3, rotation)
                pass
            pass

        if (DEBUG_MODE):
            print("First pass:")
            self.print_average_underdone()
            self.print_average_overdone()
            self.print_average_blank()
            print("")
            print("")
            print("")



    # greedy step2
    #This function goes through each whole block for each rotation.
    # For each rotation, if it has min requirement unsatisfied,
    # find trainees who do not take that rotation over the limit of that rotation to assign to this rotation.
    # If there still exist rotations with unsatisfied min requirement during any period,
    # find trainees who have any pre-fill vacation block and replace vacation to that rotation.
    def greedy_step2_4(self):
        trainees = self.trainees
        rotations = self.rotations
        if (DEBUG_MODE):
            print("")
            print("")
            print("")

        for i in range(int(self.num_block/4)):
            for rotation in rotations:
                rot_name = rotation.name
                rot_id = rotation.id

                min_PGY1 = 0
                min_PGY2 = 0
                min_PGY3 = 0

                if (rotation.min1 != -1):
                    min_PGY1 = rotation.processed_min1[4 * i]
                elif (rotation.min12 != -1):
                    min_PGY1 = rotation.processed_min12[4 * i]
                elif (rotation.min13 != -1):
                    min_PGY1 = rotation.processed_min13[4 * i]
                elif (rotation.mintotal != -1):
                    min_PGY1 = rotation.processed_mintotal[4 * i]

                if (min_PGY1 > 0):

                    random.shuffle(trainees)
                    for trainee in trainees:
                        # random.shuffle(trainees)

                        if ((trainee.role == "PGY1") and (trainee.block[4 * i].id == -1) and trainee.block[
                                    4 * i + 1].id == -1 and trainee.block[4 * i + 2].id == -1 and trainee.block[
                                    4 * i + 3].id == -1 and (trainee.processed_limits[rot_name] > 3)):
                            self.fill_in(trainee, 4*i, rotation)
                            self.fill_in(trainee, 4*i+1, rotation)
                            self.fill_in(trainee, 4*i+2, rotation)
                            self.fill_in(trainee, 4*i+3, rotation)
                            min_PGY1 -= 1
                            if (min_PGY1 == 0): break


                if (rotation.min2 != -1):
                    min_PGY2 = rotation.processed_min2[4 * i]
                elif (rotation.min12 != -1):
                    min_PGY2 = rotation.processed_min12[4 * i]
                elif (rotation.min23 != -1):
                    min_PGY2 = rotation.processed_min23[4 * i]
                elif (rotation.mintotal != -1):
                    min_PGY2 = rotation.processed_mintotal[4 * i]

                if (min_PGY2 > 0):

                    random.shuffle(trainees)

                    for trainee in trainees:
                        # random.shuffle(trainees)
                        if ((trainee.role == "PGY2") and (trainee.block[4 * i].id == -1) and trainee.block[
                                    4 * i + 1].id == -1 and trainee.block[4 * i + 2].id == -1 and trainee.block[
                                    4 * i + 3].id == -1 and (trainee.processed_limits[rot_name] > 3)):
                            self.fill_in(trainee, 4 * i, rotation)
                            self.fill_in(trainee, 4 * i + 1, rotation)
                            self.fill_in(trainee, 4 * i + 2, rotation)
                            self.fill_in(trainee, 4 * i + 3, rotation)
                            min_PGY2 -= 1
                            if (min_PGY2 == 0): break


                if (rotation.min3 != -1):
                    min_PGY3 = rotation.processed_min3[4 * i]
                elif (rotation.min23 != -1):
                    min_PGY3 = rotation.processed_min23[4 * i]
                elif (rotation.min13 != -1):
                    min_PGY3 = rotation.processed_min13[4 * i]
                elif (rotation.mintotal != -1):
                    min_PGY3 = rotation.processed_mintotal[4 * i]

                if (min_PGY3 > 0):

                    random.shuffle(trainees)

                    for trainee in trainees:
                        # random.shuffle(trainees)

                        if ((trainee.role == "PGY3") and (trainee.block[4 * i].id == -1) and trainee.block[
                                    4 * i + 1].id == -1 and trainee.block[4 * i + 2].id == -1 and trainee.block[
                                    4 * i + 3].id == -1 and (trainee.processed_limits[rot_name] > 3)):
                            self.fill_in(trainee, 4 * i, rotation)
                            self.fill_in(trainee, 4 * i + 1, rotation)
                            self.fill_in(trainee, 4 * i + 2, rotation)
                            self.fill_in(trainee, 4 * i + 3, rotation)
                            min_PGY3 -= 1
                            if (min_PGY3 == 0): break

                if (rotation.min1 != -1):
                    min_PGY1 = rotation.processed_min1[4 * i]
                elif (rotation.min12 != -1):
                    min_PGY1 = rotation.processed_min12[4 * i]
                elif (rotation.min13 != -1):
                    min_PGY1 = rotation.processed_min13[4 * i]
                elif (rotation.mintotal != -1):
                    min_PGY1 = rotation.processed_mintotal[4 * i]

                # if we need to remove some prefill vacation block in order to fulfill the rotation min
                # we will do it here
                if (min_PGY1 > 0):

                    random.shuffle(trainees)

                    for trainee in trainees:
                        # random.shuffle(trainees)

                        if ((trainee.role == "PGY1") and ((trainee.block[4 * i].id == -1) or (trainee.block[4 * i].id == -2)) and
                                ((trainee.block[4 * i + 1].id == -1) or (trainee.block[4 * i + 1].id == -2)) and
                                ((trainee.block[4 * i + 2].id == -1) or (trainee.block[4 * i + 2].id == -2)) and
                                ((trainee.block[4 * i + 3].id == -1) or (trainee.block[4 * i + 3].id == -2)) and
                                (trainee.processed_limits[rot_name] > 3)):
                            self.fill_in(trainee, 4 * i, rotation)
                            self.fill_in(trainee, 4 * i + 1, rotation)
                            self.fill_in(trainee, 4 * i + 2, rotation)
                            self.fill_in(trainee, 4 * i + 3, rotation)
                            min_PGY1 -= 1
                            if (min_PGY1 == 0): break


                if (rotation.min2 != -1):
                    min_PGY2 = rotation.processed_min2[4 * i]
                elif (rotation.min12 != -1):
                    min_PGY2 = rotation.processed_min12[4 * i]
                elif (rotation.min23 != -1):
                    min_PGY2 = rotation.processed_min23[4 * i]
                elif (rotation.mintotal != -1):
                    min_PGY2 = rotation.processed_mintotal[4 * i]

                if (min_PGY2 > 0):

                    random.shuffle(trainees)

                    for trainee in trainees:
                        # random.shuffle(trainees)
                        if ((trainee.role == "PGY2") and (
                            (trainee.block[4 * i].id == -1) or (trainee.block[4 * i].id == -2)) and
                                ((trainee.block[4 * i + 1].id == -1) or (trainee.block[4 * i + 1].id == -2)) and
                                ((trainee.block[4 * i + 2].id == -1) or (trainee.block[4 * i + 2].id == -2)) and
                                ((trainee.block[4 * i + 3].id == -1) or (trainee.block[4 * i + 3].id == -2)) and
                                (trainee.processed_limits[rot_name] > 3)):
                            self.fill_in(trainee, 4 * i, rotation)
                            self.fill_in(trainee, 4 * i + 1, rotation)
                            self.fill_in(trainee, 4 * i + 2, rotation)
                            self.fill_in(trainee, 4 * i + 3, rotation)
                            min_PGY2 -= 1
                            if (min_PGY2 == 0): break


                if (rotation.min3 != -1):
                    min_PGY3 = rotation.processed_min3[4 * i]
                elif (rotation.min23 != -1):
                    min_PGY3 = rotation.processed_min23[4 * i]
                elif (rotation.min13 != -1):
                    min_PGY3 = rotation.processed_min13[4 * i]
                elif (rotation.mintotal != -1):
                    min_PGY3 = rotation.processed_mintotal[4 * i]

                if (min_PGY3 > 0):

                    random.shuffle(trainees)

                    for trainee in trainees:
                        # random.shuffle(trainees)

                        if ((trainee.role == "PGY3") and (
                            (trainee.block[4 * i].id == -1) or (trainee.block[4 * i].id == -2)) and
                                ((trainee.block[4 * i + 1].id == -1) or (trainee.block[4 * i + 1].id == -2)) and
                                ((trainee.block[4 * i + 2].id == -1) or (trainee.block[4 * i + 2].id == -2)) and
                                ((trainee.block[4 * i + 3].id == -1) or (trainee.block[4 * i + 3].id == -2)) and
                                (trainee.processed_limits[rot_name] > 3)):
                            self.fill_in(trainee, 4 * i, rotation)
                            self.fill_in(trainee, 4 * i + 1, rotation)
                            self.fill_in(trainee, 4 * i + 2, rotation)
                            self.fill_in(trainee, 4 * i + 3, rotation)
                            min_PGY3 -= 1
                            if (min_PGY3 == 0): break
                pass
            pass

        if (DEBUG_MODE):
            print("Second pass:")
            self.print_average_underdone()
            self.print_average_overdone()
            self.print_average_blank()
            print("")
            print("")
            print("")



    # greedy step3
    # For each roles of trainees,
    # if there exist trainees with unsatisfied educational requirements for some rotations,
    # randomly pick a whole block to assign it to that rotation,
    # meanwhile, the rotation max should not be touched.
    # This step only fills the whole block.
    def greedy_step3_4(self):
        trainees = self.trainees
        rotations = self.rotations
        if (DEBUG_MODE):
            print("")
            print("")
            print("")

        for trainee in trainees:
            for req in trainee.processed_reqs:
                count = 0
                while (trainee.processed_reqs[req] > 3 and count < 1000):
                    count += 1

                    full_flag = True
                    for i in range(int(self.num_block/4)):
                        if (trainee.block[4*i].id == -1):

                            full_flag = False
                            break

                    if (full_flag):
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (rotation.min_block_length != 1):
                        break

                    if (trainee.role == "PGY1"):
                        i = random.randint(0,int(self.num_block/4)-1)
                        if ((trainee.block[4*i].id == -1) and trainee.block[
                                    4 * i + 1].id == -1 and trainee.block[4 * i + 2].id == -1 and trainee.block[
                                    4 * i + 3].id == -1 and (rotation.processed_max1[4*i] > 0)):
                            self.fill_in(trainee, 4*i, rotation)
                            self.fill_in(trainee, 4*i+1, rotation)
                            self.fill_in(trainee, 4*i+2, rotation)
                            self.fill_in(trainee, 4*i+3, rotation)

                    if (trainee.role == "PGY2"):
                        i = random.randint(0, int(self.num_block/4)-1)
                        if ((trainee.block[4*i].id == -1) and trainee.block[
                                    4 * i + 1].id == -1 and trainee.block[4 * i + 2].id == -1 and trainee.block[
                                    4 * i + 3].id == -1 and (rotation.processed_max2[4*i] > 0)):
                            self.fill_in(trainee, 4 * i, rotation)
                            self.fill_in(trainee, 4 * i + 1, rotation)
                            self.fill_in(trainee, 4 * i + 2, rotation)
                            self.fill_in(trainee, 4 * i + 3, rotation)

                    if (trainee.role == "PGY3"):
                        i = random.randint(0, int(self.num_block/4)-1)
                        if ((trainee.block[4*i].id == -1) and trainee.block[
                                    4 * i + 1].id == -1 and trainee.block[4 * i + 2].id == -1 and trainee.block[
                                    4 * i + 3].id == -1 and (rotation.processed_max3[4*i] > 0)):
                            self.fill_in(trainee, 4 * i, rotation)
                            self.fill_in(trainee, 4 * i + 1, rotation)
                            self.fill_in(trainee, 4 * i + 2, rotation)
                            self.fill_in(trainee, 4 * i + 3, rotation)

        if (DEBUG_MODE):
            print("Third pass:")
            self.print_average_underdone()
            self.print_average_overdone()
            self.print_average_blank()
            print("")
            print("")
            print("")



    # greedy step4
    # For each roles of trainees,
    # if there exist trainees with unsatisfied educational requirements for some rotations,
    # randomly pick a half block to assign it to that rotation,
    # meanwhile, the rotation max should not be touched.
    # This step only fills the half block.
    def greedy_step4_4(self):
        trainees = self.trainees
        rotations = self.rotations
        if (DEBUG_MODE):
            print("")
            print("")
            print("")

        for trainee in trainees:
            for req in trainee.processed_reqs:
                count = 0
                while (trainee.processed_reqs[req] > 1 and count < 1000):
                    count += 1

                    full_flag = True
                    for i in range(int(self.num_block/2)):
                        if (trainee.block[2*i].id == -1):

                            full_flag = False
                            break

                    if (full_flag):
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (rotation.min_block_length != 0.5):
                        break

                    if (trainee.role == "PGY1"):
                        i = random.randint(0,int(self.num_block/2)-1)
                        if ((trainee.block[2*i].id == -1) and (trainee.block[2*i+1].id == -1) and (rotation.processed_max1[2*i] > 0)):
                            self.fill_in(trainee, 2*i, rotation)
                            self.fill_in(trainee, 2*i+1, rotation)
                    if (trainee.role == "PGY2"):
                        i = random.randint(0, int(self.num_block/2)-1)
                        if ((trainee.block[2*i].id == -1) and (trainee.block[2*i+1].id == -1) and (rotation.processed_max2[2*i] > 0)):
                            self.fill_in(trainee, 2 * i, rotation)
                            self.fill_in(trainee, 2 * i + 1, rotation)

                    if (trainee.role == "PGY3"):
                        i = random.randint(0, int(self.num_block/2)-1)
                        if ((trainee.block[2*i].id == -1)  and (trainee.block[2*i+1].id == -1) and (rotation.processed_max3[2*i] > 0)):
                            self.fill_in(trainee, 2 * i, rotation)
                            self.fill_in(trainee, 2 * i + 1, rotation)

        if (DEBUG_MODE):
            print("Fourth pass:")
            self.print_average_underdone()
            self.print_average_overdone()
            self.print_average_blank()
            print("")
            print("")
            print("")

    # greedy step5
    # For each roles of trainees,
    # if there exist trainees with unsatisfied educational requirements for some rotations,
    # randomly pick a quarter block to assign it to that rotation,
    # meanwhile, the rotation max should not be touched.
    # This step only fills the quarter block.
    def greedy_step5_4(self):
        trainees = self.trainees
        rotations = self.rotations
        if (DEBUG_MODE):
            print("")
            print("")
            print("")

        for trainee in trainees:
            for req in trainee.processed_reqs:
                count = 0
                while (trainee.processed_reqs[req] > 0 and count < 1000):
                    count += 1

                    full_flag = True
                    for i in range(self.num_block):
                        if (trainee.block[i].id == -1):
                            full_flag = False
                            break

                    if (full_flag):
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (rotation.min_block_length != 0.25):
                        break

                    if (trainee.role == "PGY1"):

                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -1) and (rotation.processed_max1[i] > 0)):
                            self.fill_in(trainee, i, rotation)

                    if (trainee.role == "PGY2"):
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -1) and (rotation.processed_max2[i] > 0)):
                            self.fill_in(trainee, i, rotation)

                    if (trainee.role == "PGY3"):
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -1) and (rotation.processed_max3[i] > 0)):
                            self.fill_in(trainee, i, rotation)
        if (DEBUG_MODE):
            print("Fifth pass:")
            self.print_average_underdone()
            self.print_average_overdone()
            self.print_average_blank()
            print("")
            print("")
            print("")

    # greedy step6
    # For each roles of trainees,
    # if there exist trainees with unsatisfied educational requirements for some rotations, after doing step 5,
    # find  a whole block occupied by vacation to replace it to the rotations,
    # meanwhile, the rotation max should not be touched.
    # This step only fills the whole block.
    def greedy_step6_4(self):
        trainees = self.trainees
        rotations = self.rotations
        if (DEBUG_MODE):
            print("")
            print("")
            print("")

        for trainee in trainees:
            for req in trainee.processed_reqs:
                count = 0
                while (trainee.processed_reqs[req] > 3 and count < 1000):
                    count += 1

                    full_flag = True
                    for i in range(int(self.num_block/4)):
                        if (trainee.block[4*i].id == -2):

                            full_flag = False
                            break

                    if (full_flag):
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (rotation.min_block_length != 1):
                        break

                    if (trainee.role == "PGY1"):
                        i = random.randint(0,int(self.num_block/4)-1)
                        if ((trainee.block[4*i].id == -2) and trainee.block[
                                    4 * i + 1].id == -2 and trainee.block[4 * i + 2].id == -2 and trainee.block[
                                    4 * i + 3].id == -2 and (rotation.processed_max1[4*i] > 0)):
                            self.fill_in(trainee, 4*i, rotation)
                            self.fill_in(trainee, 4*i+1, rotation)
                            self.fill_in(trainee, 4*i+2, rotation)
                            self.fill_in(trainee, 4*i+3, rotation)

                    if (trainee.role == "PGY2"):
                        i = random.randint(0, int(self.num_block/4)-1)
                        if ((trainee.block[4*i].id == -2) and trainee.block[
                                    4 * i + 1].id == -2 and trainee.block[4 * i + 2].id == -2 and trainee.block[
                                    4 * i + 3].id == -2 and (rotation.processed_max2[4*i] > 0)):
                            self.fill_in(trainee, 4 * i, rotation)
                            self.fill_in(trainee, 4 * i + 1, rotation)
                            self.fill_in(trainee, 4 * i + 2, rotation)
                            self.fill_in(trainee, 4 * i + 3, rotation)

                    if (trainee.role == "PGY3"):
                        i = random.randint(0, int(self.num_block/4)-1)
                        if ((trainee.block[4*i].id == -2) and trainee.block[
                                    4 * i + 1].id == -2 and trainee.block[4 * i + 2].id == -2 and trainee.block[
                                    4 * i + 3].id == -2 and (rotation.processed_max3[4*i] > 0)):
                            self.fill_in(trainee, 4 * i, rotation)
                            self.fill_in(trainee, 4 * i + 1, rotation)
                            self.fill_in(trainee, 4 * i + 2, rotation)
                            self.fill_in(trainee, 4 * i + 3, rotation)

        if (DEBUG_MODE):
            print("Sixth pass:")
            self.print_average_underdone()
            self.print_average_overdone()
            self.print_average_blank()
            print("")
            print("")
            print("")

    # greedy step7
    # For each roles of trainees,
    # if there exist trainees with unsatisfied educational requirements for some rotations, after doing step 5,
    # find a half block occupied by vacation to replace it to the rotations,
    # meanwhile,the rotation max should not be touched.
    # This step only fills the half block.
    def greedy_step7_4(self):
        trainees = self.trainees
        rotations = self.rotations
        if (DEBUG_MODE):
            print("")
            print("")
            print("")

        for trainee in trainees:
            for req in trainee.processed_reqs:
                count = 0
                while (trainee.processed_reqs[req] > 1 and count < 1000):
                    count += 1

                    full_flag = True
                    for i in range(int(self.num_block/2)):
                        if (trainee.block[2*i].id == -2):

                            full_flag = False
                            break

                    if (full_flag):
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (rotation.min_block_length != 0.5):
                        break

                    if (trainee.role == "PGY1"):
                        i = random.randint(0,int(self.num_block/2)-1)
                        if ((trainee.block[2*i].id == -2) and (trainee.block[2*i+1].id == -2) and (rotation.processed_max1[2*i] > 0)):
                            self.fill_in(trainee, 2*i, rotation)
                            self.fill_in(trainee, 2*i+1, rotation)

                    if (trainee.role == "PGY2"):
                        i = random.randint(0, int(self.num_block/2)-1)
                        if ((trainee.block[4*i].id == -2) and (trainee.block[2*i+1].id == -2) and (rotation.processed_max2[4*i] > 0)):
                            self.fill_in(trainee, 2 * i, rotation)
                            self.fill_in(trainee, 2 * i + 1, rotation)

                    if (trainee.role == "PGY3"):
                        i = random.randint(0, int(self.num_block/2)-1)
                        if ((trainee.block[2*i].id == -2)  and (trainee.block[2*i+1].id == -2) and (rotation.processed_max3[2*i] > 0)):
                            self.fill_in(trainee, 2 * i, rotation)
                            self.fill_in(trainee, 2 * i + 1, rotation)

        if (DEBUG_MODE):
            print("Seventh pass:")
            self.print_average_underdone()
            self.print_average_overdone()
            self.print_average_blank()
            print("")
            print("")
            print("")

    # greedy step8
    # For each roles of trainees,
    # if there exist trainees with unsatisfied educational requirements for some rotations, after doing step 5,
    # find a quarter block occupied by vacation to replace it to the rotations,
    #  meanwhile, the rotation max should not be touched.
    # This step only fills the quarter block.
    def greedy_step8_4(self):
        trainees = self.trainees
        rotations = self.rotations
        if (DEBUG_MODE):
            print("")
            print("")
            print("")

        for trainee in trainees:
            for req in trainee.processed_reqs:
                count = 0
                while (trainee.processed_reqs[req] > 0 and count < 1000):
                    count += 1

                    full_flag = True
                    for i in range(self.num_block):
                        if (trainee.block[i].id == -2):
                            full_flag = False
                            break

                    if (full_flag):
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (rotation.min_block_length != 0.25):
                        break

                    if (trainee.role == "PGY1"):
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -2) and (rotation.processed_max1[i] > 0)):
                            self.fill_in(trainee, i, rotation)

                    if (trainee.role == "PGY2"):
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -2) and (rotation.processed_max2[i] > 0)):
                            self.fill_in(trainee, i, rotation)

                    if (trainee.role == "PGY3"):
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -2) and (rotation.processed_max3[i] > 0)):
                            self.fill_in(trainee, i, rotation)

        if (DEBUG_MODE):
            print("Eighth pass:")
            self.print_average_underdone()
            self.print_average_overdone()
            self.print_average_blank()
            print("")
            print("")
            print("")


    def sort_trainees(self):
        pgy1_list = []
        pgy2_list = []
        pgy3_list = []
        for trainee in self.trainees:
            if trainee.role == "PGY1": pgy1_list.append(trainee)
            elif trainee.role == "PGY2": pgy2_list.append(trainee)
            elif trainee.role == "PGY3": pgy3_list.append(trainee)
        self.trainees = pgy1_list + pgy2_list + pgy3_list

    def blank_fill(self):
        pass

    # Statistics about the schedule
    def average_blank(self):
        '''
        :return: Average number of classes not scheduled across students
        '''
        count = 0
        for trainee in self.trainees:
            count += trainee.blank_blocks()
        return count / self.num_trainees

    def average_underdone(self):
        '''
        :return: Average number of block requirements students need to complete
        '''
        count = 0
        for trainee in self.trainees:
            count += trainee.underdone_blocks()
        return count / self.num_trainees

    def average_overdone(self):
        '''
        :return: Average number of block requirements stsudents do more than necesssary.
        '''
        count = 0
        for trainee in self.trainees:
            count += trainee.overdone_blocks()
        return count / self.num_trainees

    def sum_rot_at_block(self, block_num, rot_id):
        count = 0
        for trainee in self.trainees:
            if (trainee.block[block_num].id == rot_id):
                count += 1
        return count

    # Printing functions
    def print_trainee_schedule(self):
        blk_line = Helper.gen_num_line(self.num_block)
        print(Helper.pad_blank("", TRAINEE_NAME_LEN), blk_line)
        for trainee in self.trainees:
            print(Helper.pad_blank(trainee.name, TRAINEE_NAME_LEN), trainee.block)

    def print_trainee_reqs(self):
        for trainee in self.trainees:
            trainee.print_satisfaction_index()

    def print_rotation_demands(self):
        for rotation in self.rotations:
            rotation.print_processed_reqs()

    def print_average_blank(self):
        print(self.average_blank())

    def print_average_underdone(self):
        print(self.average_underdone())

    def print_average_overdone(self):
        print(self.average_overdone())

    def generate_info_file(self):
        s = ""
        s += str(self.num_block) + ",3\n"
        s += str(self.num_pgy1) + "," + str(self.num_pgy2) + "," + str(self.num_pgy3) + "\n"
        s += "Student, Role, Schedule\n"
        for trainee in self.trainees:
            s += trainee.name + "," + str(trainee.id) + "," + str(trainee.role) + "," + \
                trainee.get_schedule_text() + "\n"
        s += "Rotations," + str(len(self.rotations)) + "\n"
        s += "ID, Name, Min1, Max1, Min2, Max2, Min3, Max3\n"
        for rot in self.rotations:
            s += str(rot.id) + "," + rot.name + "," + \
                 str(rot.min1) + "," + str(rot.max1) + "," + \
                 str(rot.min2) + "," + str(rot.max2) + "," + \
                 str(rot.min3) + "," + str(rot.max3) + "\n"
        s += "Rotation ID, Name, Requirement\n"
        s += "PGY1 Requirements\n"
        for rot in self.rotations:
            if rot.name in self.req_pgy1:
                s += str(rot.id) + "," + rot.name + "," + str(self.req_pgy1[rot.name]) + "\n"
            else:
                s += str(rot.id) + "," + rot.name + "," + str(0) + "\n"

        s += "PGY2 Requirements\n"
        for rot in self.rotations:
            if rot.name in self.req_pgy2:
                s += str(rot.id) + "," + rot.name + "," + str(self.req_pgy2[rot.name]) + "\n"
            else:
                s += str(rot.id) + "," + rot.name + "," + str(0) + "\n"

        s += "PGY3 Requirements\n"
        for rot in self.rotations:
            if rot.name in self.req_pgy3:
                s += str(rot.id) + "," + rot.name + "," + str(self.req_pgy3[rot.name]) + "\n"
            else:
                s += str(rot.id) + "," + rot.name + "," + str(0) + "\n"
        return s


