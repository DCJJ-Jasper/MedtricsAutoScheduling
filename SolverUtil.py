from ortools.linear_solver import pywraplp
import math
import random
import copy

# -------------
# SOLVER HELPER
# -------------

def generateFullHalfQuarter(req):
    floor_value_full = int(math.floor(req))
    if (floor_value_full >= req):
        return (floor_value_full, 2 * floor_value_full, 4 * floor_value_full)
    floor_value_half = int(math.floor(req * 2))
    if (floor_value_half >= req * 2):
        return (floor_value_full, floor_value_half, 2 * floor_value_half)
    floor_value_quarter = int(math.floor(req * 4))
    if (floor_value_quarter >= req * 4):
        return (floor_value_full, floor_value_half, floor_value_quarter)
    raise ValueError("Requirement has minimum resolution of 0.25")

def generateFullHalfQuarterDict(trainee_req):
    trainee_req_full = {}
    trainee_req_half = {}
    trainee_req_quarter = {}
    for k in trainee_req.keys():
        full_half_quarter = generateFullHalfQuarter(trainee_req[k])
        trainee_req_full[k] = full_half_quarter[0]
        trainee_req_half[k] = full_half_quarter[1]
        trainee_req_quarter[k] = full_half_quarter[2]
    return(trainee_req_full, trainee_req_half, trainee_req_quarter)

def generateFullHalfQuarterPrefilled(prefilledSchedule):
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
            if (quarterPrefilled[trainee][two_block] == quarterPrefilled[trainee][two_block+1]):
                halfPrefilled[trainee][block] = quarterPrefilled[trainee][two_block]
            else:
                #There's already something there, but lower resolution
                halfPrefilled[trainee][block] = -3
    for trainee in range(num_trainees):
        for block in range(num_block // 4):
            two_block = 2 * block
            if (halfPrefilled[trainee][two_block] == halfPrefilled[trainee][two_block+1]):
                fullPrefilled[trainee][block] = halfPrefilled[trainee][two_block]
            else:
                #There's already something there, but lower resolution
                fullPrefilled[trainee][block] = -3

    return fullPrefilled, halfPrefilled, quarterPrefilled

def pruneSchedule(currentSchedule, prefilledSchedule, seed, num_trainee_list, rotations):
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
    currentSchedule = copy.deepcopy(currentSchedule)

    # Generate a list of randomly shuffled trainee x block to randomly prune
    num_trainee_total = len(currentSchedule)
    num_block = len(currentSchedule[0])
    trainee_block_list = list(range(num_trainee_total * num_block))

    random.seed(seed)
    random.shuffle(trainee_block_list)

    # Construct the array for counting types of trainee
    count_array = [[[0 for typeTrainee in range(7)] for rotation in range(len(rotations_list_local))] for block in range(num_block)]
    for trainee in range(num_trainee_total):
        #Check these requirements for types of trainee
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
            rotation = currentSchedule[trainee][block]
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
        rotation = currentSchedule[trainee][block]
        #Check these requirements for types of trainee
        if (trainee < num_trainee_list[0]):
            # PGY1
            typeTraineeList = [0, 3, 4, 6]
        elif (trainee < (num_trainee_list[0] + num_trainee_list[1])):
            # PGY2
            typeTraineeList = [1, 3, 5, 6]
        else:
            # PGY3
            typeTraineeList = [2, 4, 5, 6]

        # If the current block is empty, there's nothing to prune, skip
        if (rotation < 0):
            continue
        # If the rotation is at min requirement in some type to run, we can't prune
        for typeTrainee in typeTraineeList:
            if (count_array[block][rotation][typeTrainee] <= rotations_list_local[rotation][typeTrainee]):
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
        #Prune the desired block
        pruneCount += 1
        currentSchedule[trainee][block] = -1
        #update the count array to reflect the pruned block
        for typeTrainee in typeTraineeList:
            count_array[block][rotation][typeTrainee] -= 1

    print("Pruned " + str(pruneCount))
    return currentSchedule


def doubleSchedule(currentSchedule, prefilledSchedule):
    """

    :param currentSchedule:
    :return:
    """
    num_trainee = len(currentSchedule)
    num_block = len(currentSchedule[0])
    result_schedule = [[] for i in range(num_trainee)]

    for trainee in range(num_trainee):
        for block in range(num_block):
            if (currentSchedule[trainee][block] == -3):
                result_schedule[trainee].append(prefilledSchedule[trainee][2*block])
                result_schedule[trainee].append(prefilledSchedule[trainee][2*block+1])
            else:
                result_schedule[trainee].append(currentSchedule[trainee][block])
                result_schedule[trainee].append(currentSchedule[trainee][block])

    return result_schedule


def solveSchedule(prefilled_schedule, num_block, num_trainee_list, rotations,
                  requirements_pgy1, max_requirements_pgy1,
                  requirements_pgy2, max_requirements_pgy2,
                  requirements_pgy3, max_requirements_pgy3
                  ):
    test_print = False;
    num_trainee = sum(num_trainee_list)
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
    if test_print:
        print("TEST Print, in SolverUtil.solveSchedule")
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
        print("Done Test Print")

    num_rotation = len(rotations_list_local)
    # Instantiate a mixed-integer solver, naming it SolveIntegerProblem
    solver = pywraplp.Solver('SolveIntegerProblem',
                             pywraplp.Solver.CBC_MIXED_INTEGER_PROGRAMMING)

    # Instantiate the boolean variables representing whether a trainee is available
    # in a designated time and rotation
    vacation_allowed_rotations = []
    for k in range(num_rotation):
        if (vacation_allowed_local[rotations_list_local[k][0]]):
            vacation_allowed_rotations.append(k)

    attend_list = [[[None
                     for k in range(num_rotation)]
                    for j in range(num_block)]
                   for i in range(num_trainee)]

    if (len(prefilled_schedule) != num_trainee):
        print("Number of trainees not matched")

    if (len(prefilled_schedule[1]) != num_block):
        print("Number of blocks not matched")

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
    print("Constraints inputted. Solving")
    result_status = solver.Solve()

    # Check if the problem has an optimal solution
    # when using solvers other than
    # GLOP_LINEAR_PROGRAMMING, verifying the solution is highly recommended!
    resultArray = []
    print('Number of variables =', solver.NumVariables())
    print('Number of constraints =', solver.NumConstraints())

    if ((result_status != pywraplp.Solver.OPTIMAL) or not (solver.VerifySolution(1e-7, True))):
        print('No optimal solution found\n')
        resultArray = prefilled_schedule
    else:
        # The solution looks legit, output it from the solver
        print('Problem solved in %f milliseconds' % solver.WallTime())
        print('Problem solved in %d iterations' % solver.Iterations())

        # The objective value of the solution.
        print('Optimal objective value = %d\n' % solver.Objective().Value())

        # Print out the result in a 2D matrix

        for i in range(num_trainee):
            row = []
            for j in range(num_block):
                attending = False
                for k in range(num_rotation):
                    if (attend_list[i][j][k].solution_value() == 1):
                        # If solver determines any rotation variable to be 1, fill it in
                        attending = True
                        row += [k]
                        break
                # If solver yields nothing for this trainee/block, just fill with prefilled_schedule
                if not attending:
                    row += [prefilled_schedule[i][j]]
            resultArray += [row]
    return resultArray
