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
        - role: He can be either PGY1, PGY2, PGY3, which are the years he participated the program
        - base_reqs: These are requirements that he needs to accomplish in order to complete the program
        - processed_reqs: This variable is used in the scheduling algorithm. It reflects the requirements still have to
                          be completed.
        - block: This store the schedule of the trainee.
    '''
    def __init__(self, name, role, id = -1, num_block = NUM_BLOCK):
        self.name = name
        self.role = role
        self.id = id
        self.base_reqs = {}
        self.processed_reqs = {}
        self.num_block = num_block
        self.rotations = []
        self.base_limits = {}
        self.processed_limits = {}
        self.block = [Rotation("SHIT", -1)] * self.num_block

    def __repr__(self):
        return Helper.pad_blank(self.name, TRAINEE_NAME_LEN) + " - " + self.role

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
        self.vacation_allowed = vacation_allowed
        self.min_block_length = min_block_length
        self.type = type
        self.num_block = num_block
        self._sites = {}

        # Min, max cap for the rotation
        self.min1 = 0
        self.min2 = 0
        self.min3 = 0
        self.min12 = 0
        self.min13 = 0
        self.min23 = 0
        self.mintotal = 0

        self.max1 = 0
        self.max2 = 0
        self.max3 = 0
        self.max12 = 0
        self.max13 = 0
        self.max23 = 0
        self.maxtotal = 0

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

    def set_min(self, min1, min2, min3):
        self.min1 = min1
        self.min2 = min2
        self.min3 = min3
        self.processed_min1 = [min1] * self.num_block
        self.processed_min2 = [min2] * self.num_block
        self.processed_min3 = [min3] * self.num_block

    def set_max(self, max1, max2, max3):
        self.max1 = max1
        self.max2 = max2
        self.max3 = max3
        self.processed_max1 = [max1] * self.num_block
        self.processed_max2 = [max2] * self.num_block
        self.processed_max3 = [max3] * self.num_block

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
        self.trainees = trainees
        self.rotations = rotations
        self.num_block = num_block
        self.rotations_id = rotations_id
        self.num_trainees = len(trainees)

        self.num_pgy1 = 0
        self.num_pgy2 = 0
        self.num_pgy3 = 0
        self.req_pgy1 = {}
        self.req_pgy2 = {}
        self.req_pgy3 = {}

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


    def halffill(self, trainees, rotations):
        with open('data/prefilled.csv', newline='') as csvfile:
            spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')

            # for i in range(self.num_block):
            #     print(spamreader[i])
            # j = 0
            # for trainee in trainees:
            #     for i in range(self.num_block):
            #         if (spamreader[j][i] != -1):
            #             self.fill_in_PGY1(trainee,i,rotations[spamreader[j][i]])
            #     j += 1

            j = 0
            for row in spamreader:
                currentline = row[0].split(",")
                #print(currentline)
                for i in range(self.num_block):
                    if (int(currentline[i]) != -1 ):
                        self.fill_in(trainees[j], i, rotations[int(currentline[i])])
                j += 1


        csvfile.close()

    def halffill4(self, trainees, rotations):
        with open('data/prefilled.csv', newline='') as csvfile:
            spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')

            j = 0
            for row in spamreader:
                currentline = row[0].split(",")
                # print(currentline)
                for i in range(int(self.num_block/4)):
                    if (int(currentline[i]) != -1 ):
                        self.fill_in(trainees[j], 4*i, rotations[int(currentline[4*i])])
                        self.fill_in(trainees[j], 4*i+1, rotations[int(currentline[4*i+1])])
                        self.fill_in(trainees[j], 4*i+2, rotations[int(currentline[4*i+2])])
                        self.fill_in(trainees[j], 4*i+3, rotations[int(currentline[4*i+3])])
                j += 1

        csvfile.close()

    def fill_in(self, trainee, i, rotation):
        trainee.block[i] = rotation
        if (trainee.role == "PGY1"):
            rotation.processed_min1[i] -= 1
            rotation.processed_max1[i] -= 1
            trainee.processed_reqs[rotation.name] -= 1
            trainee.processed_limits[rotation.name] -= 1
        elif (trainee.role == "PGY2"):
            rotation.processed_min2[i] -= 1
            rotation.processed_max2[i] -= 1
            trainee.processed_reqs[rotation.name] -= 1
            trainee.processed_limits[rotation.name] -= 1
        elif (trainee.role == "PGY3"):
            rotation.processed_min3[i] -= 1
            rotation.processed_max3[i] -= 1
            trainee.processed_reqs[rotation.name] -= 1
            trainee.processed_limits[rotation.name] -= 1

    def fill_in_PGY1(self, trainees, i, rotation):
        for trainee in trainees:
            trainee.block[i] = rotation
            rotation.processed_min1[i] -= 1 # Cut down min
            rotation.processed_max1[i] -= 1 # Cut down max
            trainee.processed_reqs[rotation.name] -= 1
            trainee.processed_limits[rotation.name] -= 1

    def fill_in_PGY2(self, trainees, i, rotation):
        for trainee in trainees:
            trainee.block[i] = rotation
            rotation.processed_min2[i] -= 1
            rotation.processed_max2[i] -= 1
            trainee.processed_reqs[rotation.name] -= 1
            trainee.processed_limits[rotation.name] -= 1

    def fill_in_PGY3(self, trainees, i, rotation):
        for trainee in trainees:
            trainee.block[i] = rotation
            rotation.processed_min3[i] -= 1
            rotation.processed_max3[i] -= 1
            trainee.processed_reqs[rotation.name] -= 1
            trainee.processed_limits[rotation.name] -= 1

    def greedy_step0_4(self):
        trainees = self.trainees
        # TODO: Break down into 3 trainee list for the randomization
        rotations = self.rotations
        print("")
        print("")
        print("")


        with open('data/vacation.csv', newline='') as csvfile:
            spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')

            # for i in range(self.num_block):
            #     print(spamreader[i])
            # j = 0
            # for trainee in trainees:
            #     for i in range(self.num_block):
            #         if (spamreader[j][i] != -1):
            #             self.fill_in_PGY1(trainee,i,rotations[spamreader[j][i]])
            #     j += 1

            j = 0
            for row in spamreader:
                currentline = row[0].split(",")
                #print(currentline)
                for i in range(self.num_block):
                    if (int(currentline[i]) != -1):
                        if (int(currentline[i]) == -2):
                            trainees[j].block[i] = Rotation("VACATION", -2)
                        else:
                            self.fill_in(trainees[j], i, rotations[int(currentline[i])])
                j += 1


        csvfile.close()


    def greedy_step1_4(self):
        trainees = self.trainees
        # TODO: Break down into 3 trainee list for the randomization
        rotations = self.rotations
        print("")
        print("")
        print("")



        # print('test min1 start')
        #
        # for i in range(self.num_block):
        #     print("i = ",i)
        #
        #     for rotation in rotations:
        #
        #         print(rotation.name)
        #         print(rotation.processed_min1[i])
        #
        # print('test min1 end')

        for i in range(int(self.num_block/4)):


            print("test start", i)


            for rotation in rotations:

                rot_name = rotation.name
                rot_id = rotation.id
                min_PGY1 = rotation.processed_min1[4*i]
                min_PGY2 = rotation.processed_min2[4*i]
                min_PGY3 = rotation.processed_min3[4*i]

                #print(min_PGY1)

                # print(rot_name,min_PGY1)

                # If rotation still needs to fill in min
                # TODO: Possibly randomize the fulfillment before assigning.
                if (min_PGY1 > 0):
                    avail_trainees = Helper.search_trainee(min_PGY1, "PGY1", rot_name, trainees, 4*i)
                    # print(avail_trainees)
                    self.fill_in_PGY1(avail_trainees, 4*i, rotation)
                    self.fill_in_PGY1(avail_trainees, 4*i+1, rotation)
                    self.fill_in_PGY1(avail_trainees, 4*i+2, rotation)
                    self.fill_in_PGY1(avail_trainees, 4*i+3, rotation)
                if (min_PGY2 > 0):
                    avail_trainees = Helper.search_trainee(min_PGY2, "PGY2", rot_name, trainees, 4*i)
                    self.fill_in_PGY2(avail_trainees, 4*i, rotation)
                    self.fill_in_PGY2(avail_trainees, 4*i+1, rotation)
                    self.fill_in_PGY2(avail_trainees, 4*i+2, rotation)
                    self.fill_in_PGY2(avail_trainees, 4*i+3, rotation)
                if (min_PGY3 > 0):
                    avail_trainees = Helper.search_trainee(min_PGY3, "PGY3", rot_name, trainees, 4*i)
                    self.fill_in_PGY3(avail_trainees, 4*i, rotation)
                    self.fill_in_PGY3(avail_trainees, 4*i+1, rotation)
                    self.fill_in_PGY3(avail_trainees, 4*i+2, rotation)
                    self.fill_in_PGY3(avail_trainees, 4*i+3, rotation)
                pass
            pass
            print("test end")
        print("First pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")

    def greedy_step1(self):

        trainees = self.trainees
        # TODO: Break down into 3 trainee list for the randomization
        rotations = self.rotations
        print("")
        print("")
        print("")

        # Step 1: Fill in the minimum teaching demands with unsatisfied residents
        # TODO: implement the half block algorithm
        #        Should step 1 keep same? Is min/max of rotation possible to be 1.5 or even 1.25
        for i in range(self.num_block):
            print("test start", i)
            for rotation in rotations:

                rot_name = rotation.name
                rot_id = rotation.id
                min_PGY1 = rotation.processed_min1[i]
                min_PGY2 = rotation.processed_min2[i]
                min_PGY3 = rotation.processed_min3[i]

                # print(rot_name,min_PGY1)

                # If rotation still needs to fill in min
                # TODO: Possibly randomize the fulfillment before assigning.
                if (min_PGY1 > 0):
                    avail_trainees = search_trainee(min_PGY1, "PGY1", rot_name, trainees, i)
                    # print(avail_trainees)
                    self.fill_in_PGY1(avail_trainees, i, rotation)
                if (min_PGY2 > 0):
                    avail_trainees = search_trainee(min_PGY2, "PGY2", rot_name, trainees, i)
                    self.fill_in_PGY2(avail_trainees, i, rotation)
                if (min_PGY3 > 0):
                    avail_trainees = search_trainee(min_PGY3, "PGY3", rot_name, trainees, i)
                    self.fill_in_PGY3(avail_trainees, i, rotation)
                pass
            pass
            print("test end")
        print("First pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")

    def greedy_step2_4(self):
        trainees = self.trainees
        # TODO: Break down into 3 trainee list for the randomization
        rotations = self.rotations
        print("")
        print("")
        print("")

        for i in range(int(self.num_block/4)):
            for rotation in rotations:
                rot_name = rotation.name
                rot_id = rotation.id
                min_PGY1 = rotation.processed_min1[4*i]
                min_PGY2 = rotation.processed_min2[4*i]
                min_PGY3 = rotation.processed_min3[4*i]

                # If rotation is still not satisfied
                # TODO: Possibly randomize the fulfillment
                if (min_PGY1 > 0):

                    # TODO: Possibly randomize the trainees
                    random.shuffle(trainees)

                    # TODO: Randomize within the group
                    for trainee in trainees:
                        # random.shuffle(trainees)
                        # print(trainee.processed_limits)
                        if ((trainee.role == "PGY1") and (trainee.block[4 * i].id == -1) and trainee.block[
                                    4 * i + 1].id == -1 and trainee.block[4 * i + 2].id == -1 and trainee.block[
                                    4 * i + 3].id == -1 and (trainee.processed_limits[rot_name] > 3)):
                            self.fill_in(trainee, 4*i, rotation)
                            self.fill_in(trainee, 4*i+1, rotation)
                            self.fill_in(trainee, 4*i+2, rotation)
                            self.fill_in(trainee, 4*i+3, rotation)
                            min_PGY1 -= 1
                            if (min_PGY1 == 0): break

                if (min_PGY2 > 0):
                    # TODO: Possibly randomize the trainees
                    random.shuffle(trainees)

                    # TODO: Randomize within the group
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

                if (min_PGY3 > 0):
                    # TODO: Possibly randomize the trainees
                    random.shuffle(trainees)

                    # TODO: Randomize within the group
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

                if (min_PGY1 > 0):

                    # TODO: Possibly randomize the trainees
                    random.shuffle(trainees)

                    # TODO: Randomize within the group
                    for trainee in trainees:
                        # random.shuffle(trainees)
                        # print(trainee.processed_limits)
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

                if (min_PGY2 > 0):
                    # TODO: Possibly randomize the trainees
                    random.shuffle(trainees)

                    # TODO: Randomize within the group
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

                if (min_PGY3 > 0):
                    # TODO: Possibly randomize the trainees
                    random.shuffle(trainees)

                    # TODO: Randomize within the group
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
        print("Second pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")

    def greedy_step2(self):
        trainees = self.trainees
        # TODO: Break down into 3 trainee list for the randomization
        rotations = self.rotations
        print("")
        print("")
        print("")

        for i in range(self.num_block):
            for rotation in rotations:
                rot_name = rotation.name
                rot_id = rotation.id
                min_PGY1 = rotation.processed_min1[i]
                min_PGY2 = rotation.processed_min2[i]
                min_PGY3 = rotation.processed_min3[i]

                # If rotation is still not satisfied
                # TODO: Possibly randomize the fulfillment
                if (min_PGY1 > 0):
                    # TODO: Possibly randomize the trainees
                    random.shuffle(trainees)

                    # TODO: Randomize within the group
                    for trainee in trainees:
                        # random.shuffle(trainees)
                        if ((trainee.role == "PGY1") and (trainee.block[i].id == -1)):
                            self.fill_in(trainee, i, rotation)
                            min_PGY1 -= 1
                            if (min_PGY1 == 0): break

                if (min_PGY2 > 0):
                    # TODO: Possibly randomize the trainees
                    random.shuffle(trainees)

                    # TODO: Randomize within the group
                    for trainee in trainees:
                        # random.shuffle(trainees)
                        if ((trainee.role == "PGY2") and (trainee.block[i].id == -1)):
                            self.fill_in(trainee, i, rotation)
                            min_PGY2 -= 1
                            if (min_PGY2 == 0): break

                if (min_PGY3 > 0):
                    # TODO: Possibly randomize the trainees
                    random.shuffle(trainees)

                    # TODO: Randomize within the group
                    for trainee in trainees:
                        # random.shuffle(trainees)

                        if ((trainee.role == "PGY3") and (trainee.block[i].id == -1)):
                            self.fill_in(trainee, i, rotation)
                            min_PGY3 -= 1
                            if (min_PGY3 == 0): break
                pass
            pass
        print("Second pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")


    def greedy_step3_4(self):
        trainees = self.trainees
        # TODO: Break down into 3 trainee list for the randomization
        rotations = self.rotations
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
                        # print(trainee.block[i].id)
                        if (trainee.block[4*i].id == -1):

                            full_flag = False
                            break

                    if (full_flag):
                        # print("in flag")
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (trainee.role == "PGY1"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max1[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0,int(self.num_block/4)-1)
                        if ((trainee.block[4*i].id == -1) and trainee.block[
                                    4 * i + 1].id == -1 and trainee.block[4 * i + 2].id == -1 and trainee.block[
                                    4 * i + 3].id == -1 and (rotation.processed_max1[4*i] > 0)):
                            self.fill_in(trainee, 4*i, rotation)
                            self.fill_in(trainee, 4*i+1, rotation)
                            self.fill_in(trainee, 4*i+2, rotation)
                            self.fill_in(trainee, 4*i+3, rotation)
                    if (trainee.role == "PGY2"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max2[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, int(self.num_block/4)-1)
                        if ((trainee.block[4*i].id == -1) and trainee.block[
                                    4 * i + 1].id == -1 and trainee.block[4 * i + 2].id == -1 and trainee.block[
                                    4 * i + 3].id == -1 and (rotation.processed_max2[4*i] > 0)):
                            self.fill_in(trainee, 4 * i, rotation)
                            self.fill_in(trainee, 4 * i + 1, rotation)
                            self.fill_in(trainee, 4 * i + 2, rotation)
                            self.fill_in(trainee, 4 * i + 3, rotation)

                    if (trainee.role == "PGY3"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max3[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, int(self.num_block/4)-1)
                        if ((trainee.block[4*i].id == -1) and trainee.block[
                                    4 * i + 1].id == -1 and trainee.block[4 * i + 2].id == -1 and trainee.block[
                                    4 * i + 3].id == -1 and (rotation.processed_max3[4*i] > 0)):
                            self.fill_in(trainee, 4 * i, rotation)
                            self.fill_in(trainee, 4 * i + 1, rotation)
                            self.fill_in(trainee, 4 * i + 2, rotation)
                            self.fill_in(trainee, 4 * i + 3, rotation)


        print("Third pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")



    def greedy_step3(self):
        trainees = self.trainees
        # TODO: Break down into 3 trainee list for the randomization
        rotations = self.rotations
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
                        # print(trainee.block[i].id)
                        if (trainee.block[i].id == -1):

                            full_flag = False
                            break

                    if (full_flag):
                        # print("in flag")
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (trainee.role == "PGY1"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max1[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0,self.num_block-1)
                        if ((trainee.block[i].id == -1) and (rotation.processed_max1[i] > 0)):
                            self.fill_in(trainee, i, rotation)
                    if (trainee.role == "PGY2"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max2[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -1) and (rotation.processed_max2[i] > 0)):
                            self.fill_in(trainee, i, rotation)

                    if (trainee.role == "PGY3"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max3[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -1) and (rotation.processed_max3[i] > 0)):
                            self.fill_in(trainee, i, rotation)


        print("Third pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")
        self.print_trainee_schedule()


    def greedy_step4_4(self):
        trainees = self.trainees
        # TODO: Break down into 3 trainee list for the randomization
        rotations = self.rotations
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
                        # print(trainee.block[i].id)
                        if (trainee.block[2*i].id == -1):

                            full_flag = False
                            break

                    if (full_flag):
                        # print("in flag")
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (trainee.role == "PGY1"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max1[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0,int(self.num_block/2)-1)
                        if ((trainee.block[2*i].id == -1) and (trainee.block[2*i+1].id == -1) and (rotation.processed_max1[2*i] > 0)):
                            self.fill_in(trainee, 2*i, rotation)
                            self.fill_in(trainee, 2*i+1, rotation)
                    if (trainee.role == "PGY2"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max2[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, int(self.num_block/2)-1)
                        if ((trainee.block[4*i].id == -1) and (trainee.block[2*i+1].id == -1) and (rotation.processed_max2[4*i] > 0)):
                            self.fill_in(trainee, 2 * i, rotation)
                            self.fill_in(trainee, 2 * i + 1, rotation)

                    if (trainee.role == "PGY3"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max3[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, int(self.num_block/2)-1)
                        if ((trainee.block[2*i].id == -1)  and (trainee.block[2*i+1].id == -1) and (rotation.processed_max3[2*i] > 0)):
                            self.fill_in(trainee, 2 * i, rotation)
                            self.fill_in(trainee, 2 * i + 1, rotation)


        print("Fourth pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")


    def greedy_step5_4(self):
        trainees = self.trainees
        # TODO: Break down into 3 trainee list for the randomization
        rotations = self.rotations
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
                        # print(trainee.block[i].id)
                        if (trainee.block[i].id == -1):
                            full_flag = False
                            break

                    if (full_flag):
                        # print("in flag")
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (trainee.role == "PGY1"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max1[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -1) and (rotation.processed_max1[i] > 0)):
                            self.fill_in(trainee, i, rotation)
                    if (trainee.role == "PGY2"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max2[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -1) and (rotation.processed_max2[i] > 0)):
                            self.fill_in(trainee, i, rotation)

                    if (trainee.role == "PGY3"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max3[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -1) and (rotation.processed_max3[i] > 0)):
                            self.fill_in(trainee, i, rotation)

        print("Fifth pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")

    def greedy_step6_4(self):
        trainees = self.trainees
        # TODO: Break down into 3 trainee list for the randomization
        rotations = self.rotations
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
                        # print(trainee.block[i].id)
                        if (trainee.block[4*i].id == -2):

                            full_flag = False
                            break

                    if (full_flag):
                        # print("in flag")
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (trainee.role == "PGY1"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max1[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0,int(self.num_block/4)-1)
                        if ((trainee.block[4*i].id == -2) and trainee.block[
                                    4 * i + 1].id == -2 and trainee.block[4 * i + 2].id == -2 and trainee.block[
                                    4 * i + 3].id == -2 and (rotation.processed_max1[4*i] > 0)):
                            self.fill_in(trainee, 4*i, rotation)
                            self.fill_in(trainee, 4*i+1, rotation)
                            self.fill_in(trainee, 4*i+2, rotation)
                            self.fill_in(trainee, 4*i+3, rotation)
                    if (trainee.role == "PGY2"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max2[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, int(self.num_block/4)-1)
                        if ((trainee.block[4*i].id == -2) and trainee.block[
                                    4 * i + 1].id == -2 and trainee.block[4 * i + 2].id == -2 and trainee.block[
                                    4 * i + 3].id == -2 and (rotation.processed_max2[4*i] > 0)):
                            self.fill_in(trainee, 4 * i, rotation)
                            self.fill_in(trainee, 4 * i + 1, rotation)
                            self.fill_in(trainee, 4 * i + 2, rotation)
                            self.fill_in(trainee, 4 * i + 3, rotation)

                    if (trainee.role == "PGY3"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max3[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, int(self.num_block/4)-1)
                        if ((trainee.block[4*i].id == -2) and trainee.block[
                                    4 * i + 1].id == -2 and trainee.block[4 * i + 2].id == -2 and trainee.block[
                                    4 * i + 3].id == -2 and (rotation.processed_max3[4*i] > 0)):
                            self.fill_in(trainee, 4 * i, rotation)
                            self.fill_in(trainee, 4 * i + 1, rotation)
                            self.fill_in(trainee, 4 * i + 2, rotation)
                            self.fill_in(trainee, 4 * i + 3, rotation)


        print("Sixth pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")


    def greedy_step7_4(self):
        trainees = self.trainees
        # TODO: Break down into 3 trainee list for the randomization
        rotations = self.rotations
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
                        # print(trainee.block[i].id)
                        if (trainee.block[2*i].id == -2):

                            full_flag = False
                            break

                    if (full_flag):
                        # print("in flag")
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (trainee.role == "PGY1"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max1[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0,int(self.num_block/2)-1)
                        if ((trainee.block[2*i].id == -2) and (trainee.block[2*i+1].id == -2) and (rotation.processed_max1[2*i] > 0)):
                            self.fill_in(trainee, 2*i, rotation)
                            self.fill_in(trainee, 2*i+1, rotation)
                    if (trainee.role == "PGY2"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max2[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, int(self.num_block/2)-1)
                        if ((trainee.block[4*i].id == -2) and (trainee.block[2*i+1].id == -2) and (rotation.processed_max2[4*i] > 0)):
                            self.fill_in(trainee, 2 * i, rotation)
                            self.fill_in(trainee, 2 * i + 1, rotation)

                    if (trainee.role == "PGY3"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max3[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, int(self.num_block/2)-1)
                        if ((trainee.block[2*i].id == -2)  and (trainee.block[2*i+1].id == -2) and (rotation.processed_max3[2*i] > 0)):
                            self.fill_in(trainee, 2 * i, rotation)
                            self.fill_in(trainee, 2 * i + 1, rotation)


        print("Seventh pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")

    def greedy_step8_4(self):
        trainees = self.trainees
        # TODO: Break down into 3 trainee list for the randomization
        rotations = self.rotations
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
                        # print(trainee.block[i].id)
                        if (trainee.block[i].id == -2):
                            full_flag = False
                            break

                    if (full_flag):
                        # print("in flag")
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (trainee.role == "PGY1"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max1[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -2) and (rotation.processed_max1[i] > 0)):
                            self.fill_in(trainee, i, rotation)

                    if (trainee.role == "PGY2"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max2[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -2) and (rotation.processed_max2[i] > 0)):
                            self.fill_in(trainee, i, rotation)

                    if (trainee.role == "PGY3"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max3[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -2) and (rotation.processed_max3[i] > 0)):
                            self.fill_in(trainee, i, rotation)

        # # TODO: make it into step 2
        # for i in range(self.num_block):
        #     for rotation in rotations:
        #         rot_name = rotation.name
        #         rot_id = rotation.id
        #         min_PGY1 = rotation.processed_min1[i]
        #         min_PGY2 = rotation.processed_min2[i]
        #         min_PGY3 = rotation.processed_min3[i]
        #
        #         # If rotation is still not satisfied
        #         # TODO: Possibly randomize the fulfillment
        #         if (min_PGY1 > 0):
        #             # TODO: Possibly randomize the trainees
        #             random.shuffle(trainees)
        #
        #             # TODO: Randomize within the group
        #             for trainee in trainees:
        #                 # random.shuffle(trainees)
        #                 print(trainee.processed_limits)
        #                 if ((trainee.role == "PGY1") and ((trainee.block[i].id == -1) or (trainee.block[i].id == -2)) and (trainee.processed_limits[rot_name] > 1)):
        #                     self.fill_in(trainee, i, rotation)
        #                     min_PGY1 -= 1
        #                     if (min_PGY1 == 0): break
        #
        #         if (min_PGY2 > 0):
        #             # TODO: Possibly randomize the trainees
        #             random.shuffle(trainees)
        #
        #             # TODO: Randomize within the group
        #             for trainee in trainees:
        #                 # random.shuffle(trainees)
        #                 if ((trainee.role == "PGY2") and ((trainee.block[i].id == -1) or (trainee.block[i].id == -2)) and (trainee.processed_limits[rot_name] > 1)):
        #                     self.fill_in(trainee, i, rotation)
        #                     min_PGY2 -= 1
        #                     if (min_PGY2 == 0): break
        #
        #         if (min_PGY3 > 0):
        #             # TODO: Possibly randomize the trainees
        #             random.shuffle(trainees)
        #
        #             # TODO: Randomize within the group
        #             for trainee in trainees:
        #                 # random.shuffle(trainees)
        #
        #                 if ((trainee.role == "PGY3") and ((trainee.block[i].id == -1) or (trainee.block[i].id == -2)) and (trainee.processed_limits[rot_name] > 1)):
        #                     self.fill_in(trainee, i, rotation)
        #                     min_PGY3 -= 1
        #                     if (min_PGY3 == 0): break
        #         pass
        #     pass

        print("Eighth pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")


    # TODO: make a big greedy schedule into function of STEPS, and call each step instead
    def greedy_schedule(self):
        trainees = self.trainees
        # TODO: Break down into 3 trainee list for the randomization
        rotations = self.rotations
        print("")
        print("")
        print("")

        # Step 1: Fill in the minimum teaching demands with unsatisfied residents
        # TODO: implement the half block algorithm
        #        Should step 1 keep same? Is min/max of rotation possible to be 1.5 or even 1.25
        for i in range(self.num_block):
            print("test start",i)
            for rotation in rotations:

                rot_name = rotation.name
                rot_id = rotation.id
                min_PGY1 = rotation.processed_min1[i]
                min_PGY2 = rotation.processed_min2[i]
                min_PGY3 = rotation.processed_min3[i]

                #print(rot_name,min_PGY1)

                # If rotation still needs to fill in min
                # TODO: Possibly randomize the fulfillment before assigning.
                if (min_PGY1 > 0):
                    avail_trainees = Helper.search_trainee(min_PGY1, "PGY1", rot_name, trainees, i)
                    #print(avail_trainees)
                    self.fill_in_PGY1(avail_trainees, i, rotation)
                if (min_PGY2 > 0):
                    avail_trainees = Helper.search_trainee(min_PGY2, "PGY2", rot_name, trainees, i)
                    self.fill_in_PGY2(avail_trainees, i, rotation)
                if (min_PGY3 > 0):
                    avail_trainees = Helper.search_trainee(min_PGY3, "PGY3", rot_name, trainees, i)
                    self.fill_in_PGY3(avail_trainees, i, rotation)
                pass
            pass
            print("test end")
        print("First pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")

        # Step 1.5: One more of step 3 between 2 and 1
        # # Step 3: Fill in the residents with unsatisfied requirements
        # for trainee in trainees:
        #     for req in trainee.processed_reqs:
        #         if (trainee.processed_reqs[req] > 0):
        #             id = ROTATIONS_ID[req]
        #             rotation = self.rotations[id
        #             max_PGY1 = rotation.processed_max1[i]
        #             max_PGY2 = rotation.processed_max2[i]
        #             max_PGY3 = rotation.processed_max3[i]
        #             if (trainee.role == "PGY1") and (max_PGY1 > 0):
        #                 self.fill_in(trainee, i, rotation)
        #                 max_PGY1 -= 1
        #             if (trainee.role == "PGY2") and (max_PGY2 > 0):
        #                 self.fill_in(trainee, i, rotation)
        #                 max_PGY2 -= 1
        #             if (trainee.role == "PGY3") and (max_PGY3 > 0):
        #                 self.fill_in(trainee, i, rotation)
        #                 max_PGY3 -= 1
        # print("1.5th pass:")
        # self.print_average_underdone()
        # self.print_average_overdone()
        # self.print_average_blank()
        # print("")
        # print("")
        # print("")
        # self.print_trainee_schedule()
        #
        # Step 2: Fill in minimum teaching demands through the year, regardless of residents' requirement
        for i in range(self.num_block):
            for rotation in rotations:
                rot_name = rotation.name
                rot_id = rotation.id
                min_PGY1 = rotation.processed_min1[i]
                min_PGY2 = rotation.processed_min2[i]
                min_PGY3 = rotation.processed_min3[i]

                # If rotation is still not satisfied
                # TODO: Possibly randomize the fulfillment
                if (min_PGY1 > 0):
                    # TODO: Possibly randomize the trainees
                    random.shuffle(trainees)

                    # TODO: Randomize within the group
                    for trainee in trainees:
                        # random.shuffle(trainees)
                        if ((trainee.role == "PGY1") and (trainee.block[i].id == -1)):
                            self.fill_in(trainee, i, rotation)
                            min_PGY1 -= 1
                            if (min_PGY1 == 0): break

                if (min_PGY2 > 0):
                    # TODO: Possibly randomize the trainees
                    random.shuffle(trainees)

                    # TODO: Randomize within the group
                    for trainee in trainees:
                        # random.shuffle(trainees)
                        if ((trainee.role == "PGY2") and (trainee.block[i].id == -1)):
                            self.fill_in(trainee, i, rotation)
                            min_PGY2 -= 1
                            if (min_PGY2 == 0): break

                if (min_PGY3 > 0):
                    # TODO: Possibly randomize the trainees
                    random.shuffle(trainees)

                    # TODO: Randomize within the group
                    for trainee in trainees:
                        # random.shuffle(trainees)

                        if ((trainee.role == "PGY3") and (trainee.block[i].id == -1)):
                            self.fill_in(trainee, i, rotation)
                            min_PGY3 -= 1
                            if (min_PGY3 == 0): break
                pass
            pass
        print("Second pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")
        #
        # Step 3: Fill in the residents with unsatisfied requirements
        # for i in range(self.num_block):
        for trainee in trainees:
            for req in trainee.processed_reqs:
                count = 0
                while (trainee.processed_reqs[req] > 0 and count < 1000):
                    count += 1

                    full_flag = True
                    for i in range(self.num_block):
                        # print(trainee.block[i].id)
                        if (trainee.block[i].id == -1):

                            full_flag = False
                            break

                    if (full_flag):
                        # print("in flag")
                        break

                    id = self.rotations_id[req]
                    rotation = self.rotations[id]

                    if (trainee.role == "PGY1"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max1[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0,self.num_block-1)
                        if ((trainee.block[i].id == -1) and (rotation.processed_max1[i] > 0)):
                            self.fill_in(trainee, i, rotation)
                    if (trainee.role == "PGY2"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max2[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -1) and (rotation.processed_max2[i] > 0)):
                            self.fill_in(trainee, i, rotation)

                    if (trainee.role == "PGY3"):
                        # for i in range(self.num_block):
                        #     if ((trainee.block[i].id == -1) and (rotation.processed_max3[i] > 0)):
                        #         break
                        # pass
                        i = random.randint(0, self.num_block - 1)
                        if ((trainee.block[i].id == -1) and (rotation.processed_max3[i] > 0)):
                            self.fill_in(trainee, i, rotation)


        print("Third pass:")
        self.print_average_underdone()
        self.print_average_overdone()
        self.print_average_blank()
        print("")
        print("")
        print("")
        self.print_trainee_schedule()

    def sort_trainees(self):
        pgy1_list = []
        pgy2_list = []
        pgy3_list = []
        for trainee in self.trainees:
            if trainee.role == "PGY1": pgy1_list.append(trainee)
            elif trainee.role == "PGY2": pgy2_list.append(trainee)
            elif trainee.role == "PGY3": pgy3_list.append(trainee)
        self.trainees = pgy1_list + pgy2_list + pgy3_list

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

    # TODO: Fix this to be more efficient, store it in a list
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

class Square:
    """
    Square objects that store the positional data of top left and bottom right corner, as well as the name and id of the
    respective rotation
    """
    def __init__(self, x1, y1, x2, y2, color, rot_name, id):
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
        self.rot_name = rot_name
        self.id = id

        dec_color = Helper.to_decimal_color(color)
        self.color = dec_color
        self.current_blur = 0
        self.target_blur = 0

    def draw(self):
        Helper.draw_quad(self.x1, self.y1, self.x2, self.y2, self._blur_color(self.current_blur))

    def draw_animated(self, steps):
        step_blur = self.current_blur + (self.target_blur - self.current_blur) * (steps / ANIMATION_STEPS)
        Helper.draw_quad(self.x1, self.y1, self.x2, self.y2, self._blur_color(step_blur))

    def _blur_color(self, blur = 0):
        if (blur == 0): return self.color
        r, g, b = self.color
        r = r + (1.0 - r) * blur
        g = g + (1.0 - g) * blur
        b = b + (1.0 - b) * blur
        return (r, g, b)

class SuperQuad:
    """
        SuperQuad is an object that contains information of many squares, as well as very effective method of drawing them
    """
    def __init__(self, id, num_points, indices_array, points_array, color):
        self.num_points = num_points
        self.indices_array = indices_array
        self.points_array = points_array
        self.id = id

        dec_color = color
        self.color = dec_color
        self.current_blur = 0
        self.target_blur = 0

    def draw(self):
        gl.glColor3f(*self._blur_color(self.current_blur))
        pyglet.graphics.draw_indexed(self.num_points, pyglet.gl.GL_TRIANGLES,
                                     self.indices_array,
                                     ("v2i", self.points_array))

    def draw_animated(self, steps):
        step_blur = self.current_blur + (self.target_blur - self.current_blur) * (steps / ANIMATION_STEPS)
        gl.glColor3f(*self._blur_color(step_blur))
        pyglet.graphics.draw_indexed(self.num_points, pyglet.gl.GL_TRIANGLES,
                                     self.indices_array,
                                     ("v2i", self.points_array))

    def _blur_color(self, blur=0):
        if (blur == 0): return self.color
        r, g, b = self.color
        r = r + (1.0 - r) * blur
        g = g + (1.0 - g) * blur
        b = b + (1.0 - b) * blur
        return (r, g, b)

class ChartBar:
    """
        ChartBar contains information about the charts below the users
    """
    def __init__(self, x1, y1, col_num):
        self.x1 = x1
        self.y1 = y1
        self.x2 = x1 + CHART_SIZE
        self.col_num = col_num

        self.current_color = Helper.to_decimal_color(ROTATIONS_COLOR[-1])
        self.target_color = Helper.to_decimal_color(ROTATIONS_COLOR[-1])

        self.current_height = 0
        self.target_height = 0

    def draw(self):
        Helper.draw_quad(self.x1, self.y1, self.x2, self.y1 + self.current_height, self.current_color)

    def draw_animated(self, steps):
        height_blend = int(self.current_height + (self.target_height - self.current_height) * (steps / ANIMATION_STEPS))
        Helper.draw_quad(self.x1, self.y1, self.x2, self.y1 + height_blend, self._blend_color(steps / ANIMATION_STEPS))

    def _blend_color(self, blend):
        if (blend == 0): return self.current_color
        r1, g1, b1 = self.current_color
        r2, g2, b2 = self.target_color
        r = r1 * (1.0 - blend) + r2 * blend
        g = g1 * (1.0 - blend) + g2 * blend
        b = b1 * (1.0 - blend) + b2 * blend
        return (r, g, b)

class UnderdoneBar:
    def __init__(self, x1, y1, bar_length, id):
        self.x1 = x1
        self.target_x1 = x1
        self.x2 = x1 + bar_length
        self.target_x2 = x1 + bar_length
        self.y1 = y1
        self.target_y1 = y1
        self.y2 = y1 + UNDERDONE_SIZE
        self.target_y2 = y1 + UNDERDONE_SIZE
        self.id = id

        self.color = Helper.to_decimal_color(ROTATIONS_COLOR[self.id])

    def draw(self):
        draw_quad(self.x1, self.y1, self.x2, self.y2, self.color)

    def draw_animated(self, steps):
        pass

class Line:
    def __init__(self, x1, y1, x2, y2, color = LINE_COLOR):
        self.x1 = x1
        self.x2 = x2
        self.y1 = y1
        self.y2 = y2
        self.color = Helper.to_decimal_color_alpha(color)

class SuperLine:
    '''
    A bunch of lines that are drawn efficiently using only one draw call
    '''
    def __init__(self, num_lines, points_array, color = LINE_COLOR):
        self.num_lines = num_lines
        self.points_array = points_array
        self.color = Helper.to_decimal_color_alpha(color)

    def draw(self):
        gl.glLineWidth(LINE_WIDTH)
        gl.glColor4f(*self.color)
        pyglet.graphics.draw(self.num_lines * 2, pyglet.gl.GL_LINES,
                             ('v2i', self.points_array))

class AnimatedSuperQuad:
    '''
    This class serves to draw the underdone bars efficiently
    '''

    def __init__(self, id, num_points, indices_array, points_array, color):
        self.num_points = num_points
        self.indices_array = indices_array
        self.base_points_array = np.array(points_array)
        self.current_points_array = np.array(points_array)
        self.target_points_array = np.array(points_array)
        self.id = id

        self.color = color # Already in decimal form
        self.current_blur = 0
        self.target_blur = 0

    def draw(self):
        gl.glColor3f(*self.color)
        pyglet.graphics.draw_indexed(self.num_points, pyglet.gl.GL_TRIANGLES,
                                     self.indices_array,
                                     ("v2i", self.current_points_array))

    def draw_animated(self, steps):
        gl.glColor3f(*self.color)
        temp_points_array = self.current_points_array * (ANIMATION_STEPS - steps) / ANIMATION_STEPS + self.target_points_array * steps / ANIMATION_STEPS
        temp_points_array = temp_points_array.astype(int)
        pyglet.graphics.draw_indexed(self.num_points, pyglet.gl.GL_TRIANGLES,
                                     self.indices_array,
                                     ("v2i", temp_points_array))

class MarkLine():
    def __init__(self, x1, x2, y):
        self.x1 = x1
        self.x2 = x2
        self.y = y
        self.current_height = 0
        self.target_height = 0

        self.color = Helper.to_decimal_color_alpha(MIN_LINE_COLOR)

    def draw(self):
        gl.glLineWidth(MIN_LINE_WIDTH)
        gl.glColor4f(*self.color)
        pyglet.graphics.draw(2, pyglet.gl.GL_LINES,
                             ('v2i', [self.x1, self.y - self.current_height,
                                      self.x2, self.y - self.current_height]))

    def draw_animated(self, steps):
        gl.glLineWidth(MIN_LINE_WIDTH)
        gl.glColor4f(*self.color)
        temp_height = int(self.current_height * (ANIMATION_STEPS - steps) / ANIMATION_STEPS + self.target_height * steps / ANIMATION_STEPS)
        pyglet.graphics.draw(2, pyglet.gl.GL_LINES,
                             ('v2i', [self.x1, self.y - temp_height,
                                      self.x2, self.y - temp_height]))

class ClickSquare():
    def __init__(self, x1, y1, x2, y2, color, rot_name, id):
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
        self.rot_name = rot_name
        self.id = id
        self.color = Helper.to_decimal_color(color)