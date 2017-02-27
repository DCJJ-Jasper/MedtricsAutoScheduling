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

def pruneSchedule(currentSchedule, seed, rotations):
    """

    :param currentSchedule:
    :param seed:
    :param rotations;
    :return:
    """
    # Create rotations_list_local and min_length_rotation_local to match the solver
    rotations_list_local = []
    for rot in rotations:
        rotations_list_local.append((rot.name,
                                     rot.min1, rot.max1,
                                     rot.min2, rot.max2,
                                     rot.min3, rot.max3))

    min_length_rotation_local = []
    for rot in rotations:
        min_length_rotation_local.append((rot.name, rot.min_block_length))

    print(rotations_list_local)
    print(min_length_rotation_local)

    # Deep copy the input schedule
    currentSchedule = copy.deepcopy(currentSchedule)
    # Transpose the schedule to be block based
    currentSchedule_t = [list(x) for x in zip(*currentSchedule)]

    # Generate a list of randomly shuffled trainee x block to randomly prune
    num_trainee = len(currentSchedule)
    num_block = len(currentSchedule[0])
    trainee_block_list = list(range(num_trainee * num_block))

    random.seed(seed)
    random.shuffle(trainee_block_list)

    # Loop through each trainee-block
    for trainee_block in trainee_block_list:
        trainee = trainee_block // num_block
        block = trainee_block % num_block
        rotation = currentSchedule[trainee][block]
        # If the current block is empty, there's nothing to prune, skip
        if (rotation < 0):
            continue
        # If the rotation is at min requirement to run, we can't prune
        if (currentSchedule_t[block].count(rotation) <= rotations_list_local[rotation][1]):
            continue
        # If the current rotation length is at min, we can't prune
        if min_length_rotation_local[rotation][1] > (13 / num_block):
            continue

        # If the current rotation is prefilled, we can't prune
        # TODO: Implement prevention from prefilled pruning
        currentSchedule[trainee][block] = -1
        currentSchedule_t[block][trainee] = -1

    return currentSchedule


def doubleSchedule(currentSchedule):
    """

    :param currentSchedule:
    :return:
    """
    num_trainee = len(currentSchedule)
    num_block = len(currentSchedule[0])
    result_schedule = [[] for i in range(num_trainee)]

    for trainee in range(num_trainee):
        for block in range(num_block):
            result_schedule[trainee].append(currentSchedule[trainee][block])
            result_schedule[trainee].append(currentSchedule[trainee][block])

    return result_schedule


def solveSchedule(prefilled_schedule, num_block, num_trainee, rotations, requirements_local,
                      max_requirements_local):
    """
    This solves the schedule with the solver
    :param prefilled_schedule:
    :param num_block:
    :param num_trainee:
    :param rotations:
    :param requirements_local:
    :param max_requirements_local:
    :return:
    """
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
                                     rot.min3, rot.max3))

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
            if current_rotation == -1:
                for k in range(num_rotation):
                    attend_list[i][j][k] = solver.IntVar(0, 1, 'attend_{}_{}_{}'.format(i, j, k))
            elif current_rotation == -2:
                for k in range(num_rotation):
                    if k in vacation_allowed_rotations:
                        attend_list[i][j][k] = solver.IntVar(0, 1, 'attend_{}_{}_{}'.format(i, j, k))
                    else:
                        attend_list[i][j][k] = solver.IntVar(0, 0, 'attend_{}_{}_{}'.format(i, j, k))
            else:
                for k in range(num_rotation):
                    if k == current_rotation:
                        attend_list[i][j][k] = solver.IntVar(1, 1, 'attend_{}_{}_{}'.format(i, j, k))
                    else:
                        attend_list[i][j][k] = solver.IntVar(0, 0, 'attend_{}_{}_{}'.format(i, j, k))

    # Set the rules
    # A person can only present at one thing at a time
    for i in range(num_trainee):
        for j in range(num_block):
            constraint = solver.Constraint(0, 1)
            for k in range(num_rotation):
                constraint.SetCoefficient(attend_list[i][j][k], 1)

    # A person needs a minimum number of rotations
    for k in range(num_rotation):
        for i in range(num_trainee):
            constraint = solver.Constraint(requirements_local[rotations_list_local[k][0]],
                                           max_requirements_local[rotations_list_local[k][0]])
            for j in range(num_block):
                constraint.SetCoefficient(attend_list[i][j][k], 1)

    # A rotation must goes on (satisfying a min and max number of people)
    for k in range(num_rotation):
        for j in range(num_block):
            constraint = solver.Constraint(rotations_list_local[k][1], rotations_list_local[k][2])
            for i in range(num_trainee):
                constraint.SetCoefficient(attend_list[i][j][k], 1)

    # Minimize number of people doing rotations
    objective = solver.Objective()
    for i in range(num_trainee):
        for j in range(num_block):
            for k in range(num_rotation):
                objective.SetCoefficient(attend_list[i][j][k], 1)
    objective.SetMinimization()
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
                        attending = True
                        row += [k]
                        break
                if not attending:
                    row += [-1]
            resultArray += [row]
    return resultArray
