#  Copyright (C) Medtrics Lab, Inc - All Rights Reserved
#  Unauthorized copying of this file, via any medium is strictly prohibited
#  Proprietary and confidential
#  Written by Chengjunjie(Jasper) Ding, Son Pham, Yadong(AC) Li, Tung Phan <son@medtricslab.com>, May 2017

from ortools.linear_solver import pywraplp
import math
import random
import copy

# ------------------------
# Solver UTILITY CONSTANTS
# ------------------------
DEBUG_PRINT = False

# ------------------------
# SOLVER UTILITY FUNCTIONS
# ------------------------

def generateFullHalfQuarter(req):
    """
    Return set of 3 requirements: Full, Half, Quarter based on the standard requirement number.
    Example: 1.75 -> (1, 3, 7)
    :param req: A double number representing a resident requirement
    :return: A 3 int element tuple containing Full, Half, Quarter requirements
    """
    floor_value_full = int(math.floor(req))
    if floor_value_full >= req:
        return floor_value_full, 2 * floor_value_full, 4 * floor_value_full
    floor_value_half = int(math.floor(req * 2))
    if floor_value_half >= req * 2:
        return floor_value_full, floor_value_half, 2 * floor_value_half
    floor_value_quarter = int(math.floor(req * 4))
    if floor_value_quarter >= req * 4:
        return floor_value_full, floor_value_half, floor_value_quarter
    raise ValueError("Requirement has minimum resolution of 0.25")

def generateFullHalfQuarterDict(trainee_req):
    """
    Apply generateFullHalfQuarter to all key-value of trainee_req to get 3 dictionaries containing
    the 3 types of requirement sets.
    :param trainee_req: The standard resident requirement dictionary
    :return: A 3 dict element tuple containing Full, Half, Quarter requirement dicts
    """
    trainee_req_full = {}
    trainee_req_half = {}
    trainee_req_quarter = {}
    for k in trainee_req.keys():
        trainee_req_full[k], trainee_req_half[k], trainee_req_quarter[k] = generateFullHalfQuarter(trainee_req[k])
    return trainee_req_full, trainee_req_half, trainee_req_quarter

def generateFullHalfQuarterPrefilled(prefilledSchedule):
    """
    Convert prefilledSchedule into 3 prefilled schedules with different format
    :param prefilledSchedule: The given prefilledSchedule 2D array, in 52 week format
    :return: quarterPrefilled 52 week format, halfPrefilled 26 block format, fullPrefilled 13 block format
    """
    num_trainees = len(prefilledSchedule)
    num_block = len(prefilledSchedule[0])
    if num_block != 52:
        print("Prefilled Schedule needs to be length 52")
        return
    quarterPrefilled = prefilledSchedule
    halfPrefilled = [[-1 for i in range(num_block // 2)] for j in range(num_trainees)]
    fullPrefilled = [[-1 for i in range(num_block // 4)] for j in range(num_trainees)]

    for trainee in range(num_trainees):
        for block in range(num_block // 2):
            two_block = 2*block
            if quarterPrefilled[trainee][two_block] == quarterPrefilled[trainee][two_block+1]:
                # Same rotation, reduce the resolution
                halfPrefilled[trainee][block] = quarterPrefilled[trainee][two_block]
            else:
                # There's already something there, but lower resolution
                halfPrefilled[trainee][block] = -3
    for trainee in range(num_trainees):
        for block in range(num_block // 4):
            two_block = 2 * block
            if halfPrefilled[trainee][two_block] == halfPrefilled[trainee][two_block+1]:
                # Same rotation, reducec the resolution
                fullPrefilled[trainee][block] = halfPrefilled[trainee][two_block]
            else:
                # There's already something there, but lower resolution
                fullPrefilled[trainee][block] = -3

    return fullPrefilled, halfPrefilled, quarterPrefilled

def pruneSchedule(currentSchedule, prefilledSchedule, seed, num_trainee_list, rotations):
    """
    Prune the current schedule so that more rotations can fit in subsquently more detailed resolutions
    :param currentSchedule: The current schedule that we need to prune
    :param prefilledSchedule: The prefilled schedule that was used to generate currentSchedule
    :param seed: The seed for the random generator so that the result can be replicated
    :param num_trainee_list: The list containing number of each types of resident
    :param rotations: The list containing rotation objects to get the min/max resident count
    :return: prunedSchedule: The pruned schedule that still respect the pre-filled schedule and rotation min
    """
    # Create rotations_list_local and min_length_rotation_local to match the solver
    pruneCount = 0
    rotations_list_local = []
    for rot in rotations:
        rotations_list_local.append((rot.min1,
                                     rot.min2,
                                     rot.min3,
                                     rot.min12,
                                     rot.min13,
                                     rot.min23,
                                     rot.mintotal,
                                     ))

    min_length_rotation_local = []
    for rot in rotations:
        min_length_rotation_local.append((rot.name, rot.min_block_length))

    # Deep copy the input schedule
    prunedSchedule = copy.deepcopy(currentSchedule)

    # Generate a list of randomly shuffled trainee x block to randomly prune
    num_trainee_total = len(prunedSchedule)
    num_block = len(prunedSchedule[0])
    trainee_block_list = list(range(num_trainee_total * num_block))

    random.seed(seed)
    random.shuffle(trainee_block_list)

    # Construct the array for counting types of trainee
    count_array = [[[0 for typeTrainee in range(7)] for rotation in range(len(rotations_list_local))] for block in range(num_block)]
    for trainee in range(num_trainee_total):
        # Check these requirements for all types of trainee
        if (trainee < num_trainee_list[0]):
            # PGY1
            typeTraineeList = [0, 3, 4, 6]
        elif (trainee < (num_trainee_list[0] + num_trainee_list[1])):
            # PGY2
            typeTraineeList = [1, 3, 5, 6]
        else:
            # PGY3
            typeTraineeList = [2, 4, 5, 6]

        for block in range(num_block):
            rotation = prunedSchedule[trainee][block]
            if rotation < 0:
                # Empty block, skip
                continue
            # Else, start counting for the desired type
            for typeTrainee in typeTraineeList:
                count_array[block][rotation][typeTrainee] += 1

    # Loop through each trainee-block
    for trainee_block in trainee_block_list:
        canPrune = True
        trainee = trainee_block // num_block
        block = trainee_block % num_block
        rotation = prunedSchedule[trainee][block]
        # Check these requirements for types of trainee
        if trainee < num_trainee_list[0]:
            # PGY1
            typeTraineeList = [0, 3, 4, 6]
        elif trainee < (num_trainee_list[0] + num_trainee_list[1]):
            # PGY2
            typeTraineeList = [1, 3, 5, 6]
        else:
            # PGY3
            typeTraineeList = [2, 4, 5, 6]

        # If the current block is empty, there's nothing to prune, skip
        if rotation < 0:
            continue
        # If the rotation is at min requirement in some type to run, we can't prune
        for typeTrainee in typeTraineeList:
            if count_array[block][rotation][typeTrainee] <= rotations_list_local[rotation][typeTrainee]:
                canPrune = False
                break
        if not canPrune:
            continue

        # If the current rotation length is at min, we can't prune
        if min_length_rotation_local[rotation][1] > (13 / num_block):
            continue

        # If the current rotation is prefilled, we can't prune
        if prefilledSchedule[trainee][block] != -1:
            continue
        # Prune the desired block
        pruneCount += 1
        prunedSchedule[trainee][block] = -1
        # update the count array to reflect the pruned block
        for typeTrainee in typeTraineeList:
            count_array[block][rotation][typeTrainee] -= 1
    if DEBUG_PRINT:
        print("Pruned " + str(pruneCount))
    return prunedSchedule


def doubleSchedule(currentSchedule, prefilledSchedule):
    """
    Double the current Schedule to allow for more detailed resolution. Remove ambiguity using the prefilledSchedule
    E.g: [1, 2, 3] -> [1, 1, 2, 2, 3, 3]
    :param currentSchedule: The current schedule that needs to be doubled
    :param prefilledSchedule: The pre-filled schedule to provide more information about what to fill in
    :return: doubled_schedule: The doubled schedule that allows for more detailed resolution
    """
    num_trainee = len(currentSchedule)
    num_block = len(currentSchedule[0])
    doubled_schedule = [[] for i in range(num_trainee)]

    for trainee in range(num_trainee):
        for block in range(num_block):
            if currentSchedule[trainee][block] == -3:
                # Ambiguous block, refer back to prefilledSchedule
                doubled_schedule[trainee].append(prefilledSchedule[trainee][2*block])
                doubled_schedule[trainee].append(prefilledSchedule[trainee][2*block+1])
            else:
                # Simple block, just double it
                doubled_schedule[trainee].append(currentSchedule[trainee][block])
                doubled_schedule[trainee].append(currentSchedule[trainee][block])

    return doubled_schedule


def solveSchedule(prefilled_schedule, num_block, num_trainee_list, rotations,
                  requirements_pgy1, max_requirements_pgy1,
                  requirements_pgy2, max_requirements_pgy2,
                  requirements_pgy3, max_requirements_pgy3
                  ):
    """
    Solve the schedule. This is our main function to solve the schedule, taking into account all the constraints on
    rotation, resident and prefilled schedule.

    :param prefilled_schedule: The starting base schedule that will be filled in
    :param num_block: Number of blocks of the schedule
    :param num_trainee_list: List containing numbers of trainees
    :param rotations: List of rotation objects to get min/max requirements, vacation, etc.
    :param requirements_pgy1: Min graduation requirement of PGY1
    :param max_requirements_pgy1: Limit on number of blocks in each rotation for PGY1
    :param requirements_pgy2: Min graduation requirement of PGY2
    :param max_requirements_pgy2: Limit on number of blocks in each rotation for PGY2
    :param requirements_pgy3: Min graduation requirement of PGY3
    :param max_requirements_pgy3: Limit on number of blocks in each rotation for PGY3
    :return: resultArray: The result array after solving using IP Solver
    """
    num_trainee = sum(num_trainee_list)
    if len(prefilled_schedule) != num_trainee:
        print("Number of trainees not matched")
        return prefilled_schedule

    if len(prefilled_schedule[1]) != num_block:
        print("Number of blocks not matched")
        return prefilled_schedule

    # Create vacation allowed local
    vacation_allowed_local = {}
    for rot in rotations:
        vacation_allowed_local[rot.name] = rot.vacation_allowed

    # Create rotations list the "suitable" format for the solver
    rotations_list_local = []
    for rot in rotations:
        rotations_list_local.append((rot.name,
                                     rot.min1, rot.max1,
                                     rot.min2, rot.max2,
                                     rot.min3, rot.max3,
                                     rot.min12, rot.max12,
                                     rot.min13, rot.max13,
                                     rot.min23, rot.max23,
                                     rot.mintotal, rot.maxtotal))
    if DEBUG_PRINT:
        print("DEBUG Print, in SolverUtil.solveSchedule")
        print(num_block)
        print(num_trainee_list)
        print("PGY1")
        print(requirements_pgy1)
        print(max_requirements_pgy1)
        print("PGY2")
        print(requirements_pgy2)
        print(max_requirements_pgy2)
        print("PGY3")
        print(requirements_pgy3)
        print(max_requirements_pgy3)
        print("Num trainee ", num_trainee)
        print("Rotations")
        print(rotations_list_local)
        print("Done DEBUG Print")

    num_rotation = len(rotations_list_local)
    # Instantiate a mixed-integer solver, naming it SolveIntegerProblem
    solver = pywraplp.Solver('SolveIntegerProblem',
                             pywraplp.Solver.CBC_MIXED_INTEGER_PROGRAMMING)

    # Instantiate the boolean variables representing whether a trainee is available
    # in a designated time and rotation
    vacation_allowed_rotations = []
    for k in range(num_rotation):
        if vacation_allowed_local[rotations_list_local[k][0]]:
            vacation_allowed_rotations.append(k)

    attend_list = [[[None
                     for k in range(num_rotation)]
                    for j in range(num_block)]
                   for i in range(num_trainee)]

    for i in range(num_trainee):
        for j in range(num_block):
            current_rotation = prefilled_schedule[i][j]
            for k in range(num_rotation):
                if current_rotation == -1:
                    #Plain empty block
                    attend_list[i][j][k] = solver.IntVar(0, 1, 'attend_{}_{}_{}'.format(i, j, k))
                elif current_rotation == -2:
                    #Vacation block (Tech Manual Solver.e)
                    if k in vacation_allowed_rotations:
                        attend_list[i][j][k] = solver.IntVar(0, 1, 'attend_{}_{}_{}'.format(i, j, k))
                    else:
                        attend_list[i][j][k] = solver.IntVar(0, 0, 'attend_{}_{}_{}'.format(i, j, k))
                else:
                    # There's a prefilled block here (Tech Manual Solver.d)
                    if k == current_rotation:
                        attend_list[i][j][k] = solver.IntVar(1, 1, 'attend_{}_{}_{}'.format(i, j, k))
                    else:
                        attend_list[i][j][k] = solver.IntVar(0, 0, 'attend_{}_{}_{}'.format(i, j, k))

    # Set the rules
    # A person can only be present at one thing at a time (Tech Manual Solver.a)
    for i in range(num_trainee):
        for j in range(num_block):
            constraint = solver.Constraint(0, 1)
            for k in range(num_rotation):
                constraint.SetCoefficient(attend_list[i][j][k], 1)

    # A rotation must goes on (satisfying a min and max number of people) (Tech Manual Solver.b)
    for k in range(num_rotation):
        for j in range(num_block):
            constraint1 = solver.Constraint(rotations_list_local[k][1], rotations_list_local[k][2])
            constraint2 = solver.Constraint(rotations_list_local[k][3], rotations_list_local[k][4])
            constraint3 = solver.Constraint(rotations_list_local[k][5], rotations_list_local[k][6])
            constraint12 = solver.Constraint(rotations_list_local[k][7], rotations_list_local[k][8])
            constraint13 = solver.Constraint(rotations_list_local[k][9], rotations_list_local[k][10])
            constraint23 = solver.Constraint(rotations_list_local[k][11], rotations_list_local[k][12])
            constrainttotal = solver.Constraint(rotations_list_local[k][13], rotations_list_local[k][14])

            #Adding trainees to constraints
            for i in range(num_trainee):
                if (i < num_trainee_list[0]):
                    # PGY1
                    constraint1.SetCoefficient(attend_list[i][j][k], 1)
                    constraint12.SetCoefficient(attend_list[i][j][k], 1)
                    constraint13.SetCoefficient(attend_list[i][j][k], 1)
                    constrainttotal.SetCoefficient(attend_list[i][j][k], 1)
                elif (i < (num_trainee_list[0] + num_trainee_list[1])):
                    # PGY2
                    constraint2.SetCoefficient(attend_list[i][j][k], 1)
                    constraint12.SetCoefficient(attend_list[i][j][k], 1)
                    constraint23.SetCoefficient(attend_list[i][j][k], 1)
                    constrainttotal.SetCoefficient(attend_list[i][j][k], 1)
                else:
                    # PGY3
                    constraint3.SetCoefficient(attend_list[i][j][k], 1)
                    constraint13.SetCoefficient(attend_list[i][j][k], 1)
                    constraint23.SetCoefficient(attend_list[i][j][k], 1)
                    constrainttotal.SetCoefficient(attend_list[i][j][k], 1)

    # A person has a min/max number of rotations (Tech Manual Solver.c)
    for i in range(num_trainee):
        if (i < num_trainee_list[0]):
            # PGY1
            needed_rotations = requirements_pgy1.keys()
            req = requirements_pgy1
            req_lim = max_requirements_pgy1
        elif (i < (num_trainee_list[0] + num_trainee_list[1])):
            # PGY2
            needed_rotations = requirements_pgy2.keys()
            req = requirements_pgy2
            req_lim = max_requirements_pgy2
        else:
            # PGY3
            needed_rotations = requirements_pgy3.keys()
            req = requirements_pgy3
            req_lim = max_requirements_pgy3

        for k in range(num_rotation):
            if rotations_list_local[k][0] not in needed_rotations:
                continue
            constraint = solver.Constraint(req[rotations_list_local[k][0]],
                                           req_lim[rotations_list_local[k][0]])
            for j in range(num_block):
                constraint.SetCoefficient(attend_list[i][j][k], 1)

    # Objective: Minimize number of people doing rotations (Tech Manual Solver.f)
    objective = solver.Objective()
    for i in range(num_trainee):
        for j in range(num_block):
            for k in range(num_rotation):
                objective.SetCoefficient(attend_list[i][j][k], 1)
    objective.SetMinimization()

    #Start solving
    if DEBUG_PRINT:
        print("Constraints inputted. Solving")
    result_status = solver.Solve()

    # Check if the problem has an optimal solution
    # when using solvers other than
    # GLOP_LINEAR_PROGRAMMING, verifying the solution is highly recommended!
    resultArray = []
    if DEBUG_PRINT:
        print('Number of variables =', solver.NumVariables())
        print('Number of constraints =', solver.NumConstraints())

    if ((result_status != pywraplp.Solver.OPTIMAL) or not (solver.VerifySolution(1e-7, True))):
        if DEBUG_PRINT:
            print('No optimal solution found\n')
        resultArray = prefilled_schedule
    else:
        if DEBUG_PRINT:
            # The solution looks legit, output it from the solver
            print('Problem solved in %f milliseconds' % solver.WallTime())
            print('Problem solved in %d iterations' % solver.Iterations())

            # The objective value of the solution.
            print('Optimal objective value = %d\n' % solver.Objective().Value())

        # Construct the 2D matrix from the solved variables

        for i in range(num_trainee):
            row = []
            for j in range(num_block):
                attending = False
                for k in range(num_rotation):
                    if attend_list[i][j][k].solution_value() == 1:
                        # If solver determines any rotation variable to be 1, fill it in
                        attending = True
                        row += [k]
                        break
                # If solver yields nothing for this trainee/block, just fill with prefilled_schedule
                if not attending:
                    row += [prefilled_schedule[i][j]]
            resultArray += [row]
    return resultArray