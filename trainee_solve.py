from ortools.linear_solver import pywraplp
import pyglet
import random
import copy
import csv
import Class
from pyglet.gl import gl
from Constants import *
from Helper import *
from Window import *


def solveSchedule(prefilled_schedule, num_block, num_trainee, rotations_list_local, requirements_local):
    num_rotation = len(rotations_list_local)
    # Instantiate a mixed-integer solver, naming it SolveIntegerProblem
    solver = pywraplp.Solver('SolveIntegerProblem',
                             pywraplp.Solver.CBC_MIXED_INTEGER_PROGRAMMING)

    # Instantiate the boolean variables representing whether a trainee is available
    # in a designated time and rotation

    vacation_allowed_rotations = []
    for k in range(num_rotation):
        if (VACATION_ALLOWED["PGY1"][rotations_list_local[k][0]]):
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
            constraint = solver.Constraint(requirements_local[rotations_list_local[k][0]], solver.infinity())
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
    resultArray = []
    print('Number of variables =', solver.NumVariables())
    print('Number of constraints =', solver.NumConstraints())

    if (result_status != pywraplp.Solver.OPTIMAL):
        print('No optimal solution found\n')
        resultArray = prefilled_schedule
    else:
        # The solution looks legit (when using solvers other than
        # GLOP_LINEAR_PROGRAMMING, verifying the solution is highly recommended!).
        # assert solver.VerifySolution(1e-7, True)

        print('Problem solved in %f milliseconds' % solver.WallTime())
        print('Problem solved in %d iterations' % solver.Iterations())
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
                if (attending == False):
                    row += [-1]
            resultArray += [row]
    return resultArray

def pruneSchedule(currentSchedule, seed, rotations_list_local):

    #Deep copy the input schedule
    currentSchedule = copy.deepcopy(currentSchedule)
    # Transpose the schedule to be block based
    currentSchedule_t = [list(x) for x in zip(*currentSchedule)]

    #Generate a list of randomly shuffled trainee x block to randomly prune
    num_trainee = len(currentSchedule)
    num_block = len(currentSchedule[0])
    trainee_block_list = list(range(num_trainee * num_block))

    random.seed(seed)
    random.shuffle(trainee_block_list)

    #Loop through each trainee-block
    for trainee_block in trainee_block_list:
        trainee = trainee_block // num_block
        block = trainee_block % num_block

        #If the rotation is at min requirement to run, we can't prune
        if (currentSchedule_t[block].count(currentSchedule[trainee][block]) <= rotations_list_local[currentSchedule[trainee][block]][1]):
            continue
        #If the current rotation length is at min, we can't prune
        #TODO: Implement rotation length pruning

        #If the current rotation is prefilled, we can't prune
        #TODO: Implement prevention from prefilled pruning
        currentSchedule[trainee][block] = -1
        currentSchedule_t[block][trainee] = -1

    return currentSchedule

def doubleSchedule(currentSchedule):

    num_trainee = len(currentSchedule)
    num_block = len(currentSchedule[0])
    result_schedule = [[] for i in range(num_trainee)]

    for trainee in range(num_trainee):
        for block in range(num_block):
            result_schedule[trainee].append(currentSchedule[trainee][block])
            result_schedule[trainee].append(currentSchedule[trainee][block])

    return result_schedule

def main():
    root_dir = "../data/"
    seed = 100

    with open(root_dir + 'prefilled.csv', 'r') as f:
        reader = csv.reader(f)
        prefilled_schedule = list(reader)

    num_pgy1_local = len(prefilled_schedule)
    num_block_local = len(prefilled_schedule[0])

    # Convert all data to integer
    for i in range(num_pgy1_local):
        for j in range(num_block_local):
            prefilled_schedule[i][j] = int(prefilled_schedule[i][j])


    #Read in the requirement list and separate into 1, 0.5, 0.25 based dict
    requirements_full = {}
    requirements_half = {}
    requirements_quarter = {}
    for k in REQUIREMENTS["PGY1"].keys():
        requirements_full[k] = REQUIREMENTS["PGY1-half"][k][1]
        requirements_half[k] = REQUIREMENTS["PGY1-half"][k][2]
        requirements_quarter[k] = REQUIREMENTS["PGY1-half"][k][3]

    resultArray = solveSchedule(prefilled_schedule, num_block_local, num_pgy1_local, ROTATIONS_LIST, requirements_full)

    #Doubling the schedule and prune
    prefilled_schedule = pruneSchedule(doubleSchedule(resultArray), seed, ROTATIONS_LIST)
    #prefilled_schedule = doubleSchedule(resultArray)

    #Solve the doubled schedule
    resultArray = solveSchedule(prefilled_schedule, num_block_local*2, num_pgy1_local, ROTATIONS_LIST, requirements_half)
    #Doubling the schedule and prune
    prefilled_schedule = pruneSchedule(doubleSchedule(resultArray), seed, ROTATIONS_LIST)
    #prefilled_schedule = doubleSchedule(resultArray)

    #Solve the doubled schedule
    resultArray = solveSchedule(prefilled_schedule, num_block_local*4, num_pgy1_local, ROTATIONS_LIST, requirements_quarter)
    # Create schedule based on result array
    #print(resultArray)
    # resultArray = prefilled_schedule

    #Display the solved schedule

    # Create rotations
    rotations_dict = {}
    rotations_list = []
    id_count = 0
    for rotation in ROTATIONS_LIST:
        # So far, just set a random min, max cap for each rotation.
        # There will hopefully be better ways to do this. An interactive GUI probably works better
        # TODO: Better way to do cap for each rotation, probably a site based one.
        rot_name, min1, max1, _, _, _, _ = rotation
        new_rotation = Class.Rotation(rot_name, id_count)
        ROTATIONS_ID[rot_name] = id_count

        # PGY1s
        if rot_name in REQUIREMENTS["PGY1"]:
            min_PGY1 = min1
            max_PGY1 = max1
        else:
            min_PGY1 = 0
            max_PGY1 = 0

        min_PGY2, max_PGY2 = 0, 0
        min_PGY3, max_PGY3 = 0, 0

        new_rotation.set_min(min_PGY1, min_PGY2, min_PGY3)
        new_rotation.set_max(max_PGY1, max_PGY2, max_PGY3)
        rotations_dict[id_count] = new_rotation
        rotations_list.append(new_rotation)

        # Increment ID count for new rotation
        id_count += 1

    rotations_dict[-1] = Class.Rotation("Blank", -1)
    rotations_dict[-2] = Class.Rotation("Vacation", -2)

    # ---------------
    # Create trainees
    # ---------------

    with open(root_dir + "first_name.csv", "r") as myfile:
        FIRST_NAMES = myfile.read()

        # This is a hack to make it work with both Python 2.7 and Python 3.5
        first_names1 = FIRST_NAMES.split("\r")
        first_names2 = FIRST_NAMES.split("\n")
        if len(first_names1) > len(first_names2):
            FIRST_NAMES = first_names1
        else:
            FIRST_NAMES = first_names2
        myfile.close()

    with open(root_dir + "last_name.csv", "r") as myfile:
        LAST_NAMES = myfile.read()

        # This is a hack to make it work with both Python 2.7 and Python 3.5
        last_names1 = LAST_NAMES.split("\r")
        last_names2 = LAST_NAMES.split("\n")
        if len(last_names1) > len(last_names2):
            LAST_NAMES = last_names1
        else:
            LAST_NAMES = last_names2
        myfile.close()

    LEN_FIRST = len(FIRST_NAMES)
    LEN_LAST = len(LAST_NAMES)

    # Create trainees
    trainees = []
    for i in range(NUM_PGY1):
        name = random.choice(FIRST_NAMES) + " " + random.choice(LAST_NAMES)
        new_trainee = Class.Trainee(name, "PGY1")
        trainees.append(new_trainee)

    # Add requirement for each trainee based on their role
    for trainee in trainees:
        trainee.create_requirements(REQUIREMENTS[trainee.role])
        trainee.set_rotations(rotations_list)

    schedule = Class.Schedule(trainees, rotations_list)

    # Fill in using idiomatic way
    for trainee_num in range(NUM_PGY1):
        for block_num in range(NUM_BLOCK):
            #print rotations_dict[resultArray[trainee_num][block_num]]
            schedule.fill_in(trainees[trainee_num], block_num, rotations_dict[resultArray[trainee_num][block_num]])

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

if __name__ == '__main__':
    main()