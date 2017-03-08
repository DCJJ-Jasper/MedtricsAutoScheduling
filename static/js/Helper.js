/**
 * Created by Son Pham on 2/20/2017.
 */

/**
 *
 */
function reset_variables() {
    num_block = 0;
    num_roles = 0;
    num_trainees = 0;
    num_rotations = 0;

    num_pgy1 = 0;
    num_pgy2 = 0;
    num_pgy3 = 0;

    pgy1_reqs = {};
    pgy2_reqs = {};
    pgy3_reqs = {};

    pgy1_lims = {};
    pgy2_lims = {};
    pgy3_lims = {};

    trainees = [];
    rotations = [];
    rotations_dict = {};
    id_list = [];
}

/**
 * Read input data from python server in order to visualize
 * @param input_text
 */
function read_in_data(input_text) {
    reset_variables();
    var str_list = input_text.split("\n");

    // Read the first line: num_block and num_roles
    var line_num = 0;
    var data = str_list[line_num].trim().split(",");
    num_block = parseInt(data[0], 10);
    num_roles = parseInt(data[1], 10);

    // Read the number of students in each role
    line_num += 1;
    data = str_list[line_num].trim().split(",");
    num_pgy1 = parseInt(data[0]);
    num_pgy2 = parseInt(data[1]);
    num_pgy3 = parseInt(data[2]);
    num_trainees = num_pgy1 + num_pgy2 + num_pgy3;

    // Skip the next line
    line_num += 1;

    // Read in all PGY1s, PGY2s, PGY3s
    var name = "";
    var id = 0;
    var role = "PGY1";
    var schedule = [];
    var new_trainee = null;

    for (var i = 0; i < num_trainees; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        // Parse the data
        name = data[0];
        id = parseInt(data[1]);
        role = data[2];
        schedule = data[3].split(".");

        // Create a new trainee based on these information
        new_trainee = new Trainee(name, role, id, num_block, id_list);
        new_trainee.set_scheduled_blocks(schedule);
        trainees.push(new_trainee);
    }

    // Read in all the rotations
    line_num += 1
    data = str_list[line_num].trim().split(",");
    num_rotations = parseInt(data[1], 10);
    line_num += 1 // Skip next line

    var min1 = 0, max1 = 0, min2 = 0, max2 = 0, min3 = 0, max3 = 0;
    var new_rotation = null;

    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        // Parse the data
        id = parseInt(data[0], 10);
        name = data[1];
        min1 = parseInt(data[2], 10);
        max1 = parseInt(data[3], 10);
        min2 = parseInt(data[4], 10);
        max2 = parseInt(data[5], 10);
        min3 = parseInt(data[6], 10);
        max3 = parseInt(data[7], 10);

        // Create a new rotation based on these information
        new_rotation = new Rotation(name, id, num_block = num_block);
        new_rotation.set_rotation_demands(min1, max1, min2, max2, min3, max3);
        rotations.push(new_rotation);
        rotations_dict[id] = new_rotation;
        id_list.push(id);
    }

    // Skip 2 lines
    line_num += 2;

    // Read in requirements for each type of students
    var amount = 0;
    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        // Parse the data
        id = parseInt(data[0], 10);
        amount = parseInt(data[2], 10);

        // Input the requirement for pgy1
        pgy1_reqs[id] = amount
    }

    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        // Parse the data
        id = parseInt(data[0], 10);
        amount = parseInt(data[2], 10);

        // Input the requirement for pgy1
        pgy2_reqs[id] = amount
    }

    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        // Parse the data
        id = parseInt(data[0], 10);
        amount = parseInt(data[2], 10);

        // Input the requirement for pgy1
        pgy3_reqs[id] = amount
    }

    // Assign requirements to students
    for (var i = 0; i < num_pgy1; i++) {
        trainees[i].set_requirements(pgy1_reqs)
    }

    for (var i = num_pgy1; i < num_pgy1 + num_pgy2; i++) {
        trainees[i].set_requirements(pgy2_reqs)
    }

    for (var i = num_pgy1 + num_pgy2; i < num_trainees ; i++) {
        trainees[i].set_requirements(pgy3_reqs)
    }
    console.log(pgy1_reqs, pgy2_reqs, pgy3_reqs)
}

function read_in_data_from_medtrics(input_data) {
    reset_variables();

    // Split the data
    var str_list = input_data.split("\n");

    // Number of blocks
    var line_num = 0;
    var data = str_list[line_num].trim().split(",");
    program_name = data[1];
    num_block = parseInt(data[2], 10) * 4;

    // Skip a line
    line_num += 1;

    // Read PGY1
    line_num += 1;
    data = str_list[line_num].trim().split(",");
    num_pgy1 = parseInt(data[1], 10);

    var trainee_id;
    var trainee_name;
    var new_trainee;
    for (var i = 0; i < num_pgy1; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        trainee_id = parseInt(data[0], 10);
        trainee_name = data[1] + " " + data[2];

        new_trainee = new Trainee(trainee_name, 'PGY1', trainee_id, num_block, id_list);
        new_trainee.set_scheduled_blocks(schedule);
        trainees.push(new_trainee);
    }

    // Read PGY2
    line_num += 1;
    data = str_list[line_num].trim().split(",");
    num_pgy2 = parseInt(data[1], 10);

    var trainee_id;
    var trainee_name;
    for (var i = 0; i < num_pgy2; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        trainee_id = parseInt(data[0], 10);
        trainee_name = data[1] + " " + data[2];

        new_trainee = new Trainee(trainee_name, 'PGY2', trainee_id, num_block, id_list);
        new_trainee.set_scheduled_blocks(schedule);
        trainees.push(new_trainee);
    }

    // Read PGY3
    line_num += 1;
    data = str_list[line_num].trim().split(",");
    num_pgy3 = parseInt(data[1], 10);

    var trainee_id;
    var trainee_name;
    for (var i = 0; i < num_pgy3; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        trainee_id = parseInt(data[0], 10);
        trainee_name = data[1] + " " + data[2];

        new_trainee = new Trainee(trainee_name, 'PGY3', trainee_id, num_block, id_list);
        new_trainee.set_scheduled_blocks(schedule);
        trainees.push(new_trainee);
    }

    // Skip a line
    line_num += 1;

    // Number of rotations
    line_num += 1;
    data = str_list[line_num].trim().split(",");
    num_rotations = parseInt(data[1], 10);

    // Skip a line
    line_num += 1;

    // Read rotations
    var rot_id;
    var rot_name;
    var vacation_allowed;
    var min_block_length;
    var type;
    var new_rotation;
    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        rot_id = parseInt(data[0], 10);
        rot_name = data[1];
        vacation_allowed = data[2] == "Yes"? true : false;
        min_block_length = parseInt(data[3], 10);
        type = data[5];

        // Create a new rotation based on these information
        new_rotation = new Rotation(rot_name, rot_id, vacation_allowed, min_block_length, type, num_block);
        rotations.push(new_rotation);
        rotations_dict[rot_id] = new_rotation;
        id_list.push(rot_id);
    }
    // Skip a line
    line_num += 1;

    // Number of requirements (No need to read anything)
    line_num += 1;

    // Skip a line
    line_num += 1;

    // Read requirements
    var min1;
    var max1;
    var min2;
    var max2;
    var min3;
    var max3;
    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");
        console.log(data);

        rot_id = parseInt(data[0], 10);
        min1 = parseInt(data[2], 10);
        max1 = parseInt(data[3], 10);
        min2 = parseInt(data[4], 10);
        max2 = parseInt(data[5], 10);
        min3 = parseInt(data[6], 10);
        max3 = parseInt(data[7], 10);
        console.log(rot_id);
        rotations_dict[rot_id].set_rotation_demands(min1, max1, min2, max2, min3, max3);
    }

    // Skip a line
    line_num += 1;

    // Skip a line
    line_num += 1;

    // Number of PGY1 requirements (no need to read anything)
    line_num += 1;

    // Read PGY1 reqs
    var num_block_required;
    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        rot_id = parseInt(data[0]);
        num_block_required = parseFloat(data[1]);

        pgy1_reqs[rot_id] = num_block_required;
    }

    // Number of PGY2 requirements (no need to read anything)
    line_num += 1;

    // Read PGY2 reqs
    var num_block_required;
    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        rot_id = parseInt(data[0]);
        num_block_required = parseFloat(data[1]);

        pgy2_reqs[rot_id] = num_block_required;
    }

    // Number of PGY3 requirements (no need to read anything)
    line_num += 1;

    // Read PGY3 reqs
    var num_block_required;
    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        rot_id = parseInt(data[0]);
        num_block_required = parseFloat(data[1]);

        pgy3_reqs[rot_id] = num_block_required;
    }

    // Skip a line
    line_num += 1;

    // Skip a line
    line_num += 1;

    // Number of PGY1 limitations (no need to read anything)
    line_num +=1;

    // Read PGY1 limitations
    var num_limit;
    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        rot_id = parseInt(data[0]);
        num_limit = parseFloat(data[1]);

        pgy1_lims[rot_id] = num_limit;
    }

    // Number of PGY1 limitations (no need to read anything)
    line_num +=1;

    // Read PGY2 limitations
    var num_limit;
    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        rot_id = parseInt(data[0]);
        num_limit = parseFloat(data[1]);

        pgy2_lims[rot_id] = num_limit;
    }

    // Number of PGY1 limitations (no need to read anything)
    line_num +=1;

    // Read PGY3_limitations
    var num_limit;
    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        rot_id = parseInt(data[0]);
        num_limit = parseFloat(data[1]);

        pgy3_lims[rot_id] = num_limit;
    }

    // Skip a line
    line_num += 1;

    // Read number of prefills
    line_num += 1;
    data = str_list[line_num].trim().split(",");
    var num_prefills = parseInt(data[1], 10);

    // Skip a line
    line_num += 1;

    // Create empty schedule for each trainee
    for (t of trainees) {
        t.set_empty_schedule_blocks();
    }

    // Read prefills
    var user_id;
    var block_num;
    var rotation;
    var quarter;
    for (var i = 0; i < num_prefills; i++) {
        user_id = parseInt(data[0], 10);
        block_num = parseInt(data[1], 10);
        rotation = parseInt(data[2], 10);
        quarter = parseInt(data[3], 10);
    }

    //
}