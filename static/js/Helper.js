/**
 * Created by Son Pham on 2/20/2017.
 */

/**
 * Read input data from python server in order to visualize
 * @param input_text
 */
function read_in_data(input_text) {
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