// Copyright (C) Medtrics Lab, Inc - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential
// Written by Chengjunjie(Jasper) Ding, Son Pham, Yadong(AC) Li, Tung Phan <son@medtricslab.com>, May 2017

/**
 * Helper.js
 */


/**
 * Resets all variables when a user wants to clear an existing schedule
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
    trainees_dict = {};
    rotations = [];
    rotations_dict = {};
    rot_name_to_id_dict = {};
    id_list = [];

    old_color = BACKGROUND_COLOR;
    new_color = BACKGROUND_COLOR;

    old_min_height = 0;
    new_min_height = 0;

    old_max_height = 0;
    new_max_height = 0;

    old_info_arr = [];
    new_info_arr = [];
    in_between_arr = [];

    old_underdone_arrs = [];
    new_underdone_arrs = [];
    in_between_underdone_arrs = [];

    old_overdone_arrs = [];
    new_overdone_arrs = [];
    in_between_overdone_arrs = [];

}

/**
 * Reset every trainee's schedule block attributes to if a user clears an existing schedule
 *
 */
function reset_schedule() {
    for (var trainee of trainees) {
        trainee.set_empty_schedule_blocks();
    }
}

/**
 * Read input data from python server in order to visualize
 * @param input_text
 */
function read_in_data(input_text) {

    var schedules_list = [];

    reset_variables();
    var str_list = input_text.split("\n");

    // Read the first line: num_block and num_roles
    var line_num = 0;
    var data = str_list[line_num].trim().split(",");
    num_block = parseInt(data[0], 10);
    num_roles = parseInt(data[1], 10);
    old_info_arr = Array(num_block).fill(0);
    new_info_arr = Array(num_block).fill(0);
    in_between_arr = Array(num_block).fill(0);

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
    var role = "";
    var schedule_info = [];
    var new_trainee = null;

    for (var i = 0; i < num_trainees; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        // Parse the data
        name = data[0];
        id = parseInt(data[1]);
        role = data[2];
        schedule_info = data[3].split(".");
        schedules_list.push(schedule_info);

        // Create a new trainee based on these information
        new_trainee = new Trainee(name, role, id, num_block, id_list);
        new_trainee.to_be_scheduled = schedule_info;
        trainees.push(new_trainee);
        trainees_dict[id] = new_trainee;
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

    var blank_rot = new Rotation("Blank", EMPTY_BLOCK_GRAPHIC_ID, true, 0, "Core", num_block);
    rotations_dict[EMPTY_BLOCK_GRAPHIC_ID] = blank_rot;
    rotations.push(blank_rot);
    id_list.push(EMPTY_BLOCK_GRAPHIC_ID);

    schedule.trainees = trainees;
    schedule.rotations = rotations;

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

    line_num += 1;

    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        // Parse the data
        id = parseInt(data[0], 10);
        amount = parseInt(data[2], 10);

        // Input the requirement for pgy2
        pgy2_reqs[id] = amount
    }

    line_num += 1;

    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        // Parse the data
        id = parseInt(data[0], 10);
        amount = parseInt(data[2], 10);

        // Input the requirement for pgy1=3
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

    for (var i = 0; i < num_trainees; i++) {
        trainees[i].set_scheduled_blocks(schedules_list[i])
    }
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
    new_info_arr = Array(num_block).fill(0);

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
        trainees.push(new_trainee);
        trainees_dict[trainee_id] = new_trainee;
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
        trainees.push(new_trainee);
        trainees_dict[trainee_id] = new_trainee;
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
        trainees.push(new_trainee);
        trainees_dict[trainee_id] = new_trainee;
    }
    num_trainees = num_pgy1 + num_pgy2 + num_pgy3;

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
        rot_name_to_id_dict[rot_name] = rot_id;
        id_list.push(rot_id);
    }

    var blank_rot = new Rotation("Blank", EMPTY_BLOCK_GRAPHIC_ID, true, 0, "Core", num_block);
    rotations_dict[EMPTY_BLOCK_GRAPHIC_ID] = blank_rot;
    rotations.push(blank_rot);
    id_list.push(EMPTY_BLOCK_GRAPHIC_ID);

    // Create the schedule
    schedule = new Schedule(trainees, rotations, num_block);
    schedule.set_schedule_str_list(str_list)

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

        rot_id = parseInt(data[0], 10);
        min1 = parseInt(data[2], 10);
        max1 = parseInt(data[3], 10);
        min2 = parseInt(data[4], 10);
        max2 = parseInt(data[5], 10);
        min3 = parseInt(data[6], 10);
        max3 = parseInt(data[7], 10);
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

        rot_name = data[0];
        rot_id = rot_name_to_id_dict[rot_name];
        num_block_required = parseFloat(data[1]) * 4;

        pgy1_reqs[rot_id] = num_block_required;
    }

    // Number of PGY2 requirements (no need to read anything)
    line_num += 1;

    // Read PGY2 reqs
    var num_block_required;
    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        rot_name = data[0];
        rot_id = rot_name_to_id_dict[rot_name];
        num_block_required = parseFloat(data[1]) * 4;

        pgy2_reqs[rot_id] = num_block_required;
    }

    // Number of PGY3 requirements (no need to read anything)
    line_num += 1;

    // Read PGY3 reqs
    var num_block_required;
    for (var i = 0; i < num_rotations; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");

        rot_name = data[0];
        rot_id = rot_name_to_id_dict[rot_name];
        num_block_required = parseFloat(data[1]) * 4;

        pgy3_reqs[rot_id] = num_block_required;
    }

    // Set requirements and limitations for each students
    for (var t of trainees) {
        switch (t.role) {
            case "PGY1":
                t.set_requirements(pgy1_reqs);
                break;
            case "PGY2":
                t.set_requirements(pgy2_reqs);
                break;
            case "PGY3":
                t.set_requirements(pgy3_reqs);
                break;
        }
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

    // This mark the begin of prefill of information in the str_list
    schedule.set_schedule_info_mark(line_num + 1);

    // Read each student schedule
    var trainee_id;
    var trainee_schedule;
    for (var i = 0; i < num_trainees; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");
        trainee_id = data[0]
        trainee_schedule = data[2].split(".");

        // Assign the trainee schedule to the trainee
        trainee_schedule = convert_to_graphic_id(trainee_schedule);
        trainees_dict[trainee_id].set_scheduled_blocks(trainee_schedule);
    }
}


///////////////////////////
// VISUALIZATION HELPER ///
//////////////////////////

/**
 * Remove the popup from the app
 */
function remove_popup() {
    app.stage.removeChild(temp_line);
    app.stage.removeChild(temp_graphic);
    app.stage.removeChild(popup_close_btn);
    app.stage.removeChild(popup_label1);
    app.stage.removeChild(popup_label2);
    app.stage.removeChild(popup_label3);
    app.stage.removeChild(popup_label4);
    app.stage.removeChild(popup_info1);
    app.stage.removeChild(popup_info2);
    app.stage.removeChild(popup_info3);
    app.stage.removeChild(popup_info4);
    app.stage.removeChild(popup_click_to_view);
    app.stage.removeChild(rotation_click_fields_container);
    app.stage.removeChild(rotation_labels_container);
    app.stage.removeChild(rotation_squares_container);
    app.stage.removeChild(temp_popup);
}

/**
 * This will clean everything inside the app.stage
 */
function reset_app() {
    for (var i = app.stage.children.length - 1; i >= 0; i--) {	app.stage.removeChild(app.stage.children[i]);};

}


/**
 * Find the previous square in the schedule so that when a block's rotation is changed, the previous block's shape will
 * be changed accordingly
 * @param trainee
 * @param block_num
 * @returns the previous square
 */
function find_prev_square(trainee, block_num) {
    if (block_num == 0) {
        return null;
    } else {
        return helper_square_dict[trainee.id][block_num - 1];
    }
}

/**
 * Find the next square in the schedule so that when a block's rotation is changed, the current block's shape will
 * be changed accordingly
 * @param trainee
 * @param block_num
 * @returns next block
 */
function find_next_square(trainee, block_num) {
    if (block_num % 4 == 3) {
        return null;
    } else {
        return helper_square_dict[trainee.id][block_num + 1];
    }
}

/**
 * Find a specific square in the visualization
 * @param trainee
 * @param block_num
 */
function find_square(trainee, block_num) {
    return helper_square_dict[trainee.id][block_num];
}

/**
 * Move forward with the animation.
 */
function proceedAnimation() {

    if (animation_count <= ANIMATION_LENGTH && (program_state == STATE_SELECT || program_state == STATE_POPUP_SELECT_BUFFER)) {
        draw_underdone_and_overdone_bars();
        animation_count += 1;
    } else if (animation_count <= ANIMATION_LENGTH) {

        // Reset line graphic
        line_graphic.clear()
        line_graphic.lineStyle(1, "0xFFFFFF", 1);

        // Redraw the opacity of the square
        for (var key in squares_dict) {
            var old_alpha = squares_dict[key].old_alpha;
            var new_alpha = squares_dict[key].new_alpha;
            squares_dict[key].alpha = old_alpha - (old_alpha - new_alpha) * animation_count / ANIMATION_LENGTH;
        }

        // Redraw chart bars
        chart_bars.clear();
        chart_bars.beginFill(convert_to_color_code(in_between_color[animation_count]));

        var base_x = SQUARE_TOP_LEFT[0];
        var base_y = chart_top_left_y;
        for (var i = 0; i < num_block; i++) {
            var x1 = base_x + i * CHART_RANGE;
            var y1 = base_y;
            var x2 = base_x + i * CHART_RANGE + CHART_SIZE;
            var y2 = base_y + in_between_arr[animation_count][i] * CHART_UNIT;
            chart_bars.moveTo(x1, y1);
            chart_bars.lineTo(x1, y2);
            chart_bars.lineTo(x2, y2);
            chart_bars.lineTo(x2, y1);
            chart_bars.lineTo(x1, y1);
        }
        chart_bars.endFill();

        // White lines
        var base_x = SQUARE_TOP_LEFT[0];
        var base_y = chart_top_left_y;
        for (var i = 0; i < num_trainees; i++) {
            var y = base_y + i * CHART_SIZE;
            var x1 = base_x;
            var x2 = base_x + num_block * SQUARE_SIZE + (num_block - 1) * SQUARE_DISTANCE;
            line_graphic.moveTo(x1, y);
            line_graphic.lineTo(x2, y);
        }

        // Min chart line
        y1 = base_y + in_between_min_height[animation_count] * SQUARE_SIZE;
        x1 = base_x;
        x2 = base_x + SQUARE_SIZE * num_block + SQUARE_DISTANCE * (num_block - 1);
        line_graphic.lineStyle(2, "0xFF0000", 1);
        line_graphic.moveTo(x1, y1);
        line_graphic.lineTo(x2, y1);

        // Max chart line
        y1 = base_y + in_between_max_height[animation_count] * SQUARE_SIZE;
        line_graphic.moveTo(x1, y1);
        line_graphic.lineTo(x2, y1);
        line_graphic.lineStyle(0);

        // Draw out all the underdone bars
        var num_pgy_vis;
        switch (current_pgy) {
            case "PGY1":
                num_pgy_vis = num_pgy1; break;
            case "PGY2":
                num_pgy_vis = num_pgy2; break;
            case "PGY3":
                num_pgy_vis = num_pgy3; break;
        }

        draw_underdone_and_overdone_bars();

        animation_count += 1;
    }
}

/**
 * Change the display of the trainees to different role (we only show 1 role at once.
 * @param role
 */
function changeMode(role) {
    current_pgy = role;
    reset_app();
    visualize_data();
}

/**
 * Adjust the location of popups if the popup is too close to the border to avoid cutoff the popup
 * @param y
 * @param fullorpartial
 * @returns {number}
 */
function close_to_border(y, fullorpartial) {
    if (fullorpartial == "partial") {
        if (y < LABEL_ROLE_TOP_LEFT_Y + 6 * LABEL_HEIGHT) {
        var dis_to_top = Math.abs(LABEL_ROLE_TOP_LEFT_Y - y);
        if (dis_to_top <= FIRST_TWO_ROWS_BOUND) {
            return y + LABEL_HEIGHT + TOP_BORDER_OFFSET - POPUP_WEIGHT
        }
        return y + dis_to_top * TOP_BORDER_MULTIPLIER - POPUP_WEIGHT;
        } else {
            return y - POPUP_WEIGHT
        }
    } else if (fullorpartial == "full") {
        var popupheight = POPUP_LABEL_HEIGHT * 5 + (num_rotations + 1) * POPUP_ROTATION_SIZE;
        if (y + popupheight - app_height > -POPUP_LABEL_HEIGHT * 6) {
            return y - (POPUP_LABEL_HEIGHT * 6.5 + y + popupheight - app_height) - POPUP_WEIGHT
        } else if (y < LABEL_ROLE_TOP_LEFT_Y + 6 * LABEL_HEIGHT) {
            var dis_to_top = Math.abs(LABEL_ROLE_TOP_LEFT_Y - y);
            if (dis_to_top <= FIRST_TWO_ROWS_BOUND) {
                return y + LABEL_HEIGHT + TOP_BORDER_OFFSET - POPUP_WEIGHT
            }
            return y + dis_to_top * TOP_BORDER_MULTIPLIER - POPUP_WEIGHT;
        } else {
            return y - POPUP_WEIGHT
        }
    }

}

/**
 * Displays loader
 */
function open_modal() {
    $.magnificPopup.open({
        items: {
            src: $('<div id="modal" class="white-popup-loader center"><h4>Scheduling...</h4><img class="center" src="static/images/loader.gif"/></div>')
        },
        type: 'inline',
        modal: true
    })
}

/**
 * Hides loader
 */
function close_modal() {
        $.magnificPopup.close();
}

/**
 * Prompts user if a user wants to schedule twice without clearing the current schedule
 */
function alert_scheduled() {
    $.magnificPopup.open({
        items: {
            src: $('<div id="modal" class="white-popup center"><br/><p>A schedule has been generated. If you want to reschedule, please clear the current schedule first.</p></div>')
        },
        type: 'inline',
        closeBtnInside: true
    })
}

/**
 * Prompts user the csv file has been downloaded
 */
function finish_download_dialog() {
    $.magnificPopup.open({
        items: {
            src: $('<div id="modal" class="white-popup center"><h4>Your download will begin shortly.</h4></div>')
        },
        type: 'inline',
        closeBtnInside: true
    })
}

/**
 * Calculates the length of each underdone bar according to the schedule
 */
function calculate_underdone_overdone_bars() {

    // Calculate information regarding underdone bars
    var trainee_count = 0;
    for (var trainee_i = 0; trainee_i < trainees.length; trainee_i++) {
        var t = trainees[trainee_i];
        if (t.role != current_pgy) continue; // Skip the loop if it's not the pgy in need of visualized

        // Push underdone_arr into underdone array
        var underdone_arr = t.get_underdone_array();
        old_underdone_arrs[trainee_count] = new_underdone_arrs[trainee_count];
        new_underdone_arrs[trainee_count] = underdone_arr;
        in_between_underdone_arrs[trainee_count] =
            generate_in_between_arr(old_underdone_arrs[trainee_count],
                new_underdone_arrs[trainee_count],
                ANIMATION_LENGTH);
        trainee_count += 1;
    }

    // Calculate information regarding overdone bars
    var trainee_count = 0;
    for (var trainee_i = 0; trainee_i < trainees.length; trainee_i++) {
        var t = trainees[trainee_i];
        if (t.role != current_pgy) continue; // Skip the loop if it's not the pgy in need of visualized

        // Push overdone_arr into overdone array
        var overdone_arr = t.get_overdone_array();
        old_overdone_arrs[trainee_count] = new_overdone_arrs[trainee_count];
        new_overdone_arrs[trainee_count] = overdone_arr;
        in_between_overdone_arrs[trainee_count] =
            generate_in_between_arr(old_overdone_arrs[trainee_count],
                new_overdone_arrs[trainee_count],
                ANIMATION_LENGTH);
        trainee_count += 1;
    }
}

/**
 * Changes block's color after it has been modified and update the corresponding trainee's scheduled block attribute field to reflect the change
 * @param popup
 * @param rot_change_to
 * @param block_num
 */
function changeRotation(popup, rot_change_to, block_num) {

    var sprite_selected = find_square(trainee_selected, block_num).sprite;

    trainee_selected.fill_in(block_num, rot_change_to);
    sprite_selected.rot_id = rot_change_to;
    sprite_selected.rot_name = popup.rot_name;
    sprite_selected.square.id = rot_change_to;
    sprite_selected.square.rot_name = popup.rot_name;

    // Change the square color
    sprite_selected.texture = sprite_selected.renderer.generateTexture(ROTATIONS_SQUARE_TEXTURE[rot_change_to]);

    var next_square = find_next_square(trainee_selected, block_num);
    if (next_square) {
        // if next_square has the same color
        if (next_square.sprite.rot_id == rot_change_to) {
            sprite_selected.texture = sprite_selected.renderer.generateTexture(ROTATIONS_LONG_SQUARE_TEXTURE[rot_change_to]);
        }
    }

    // Change the previous square's texture
    var prev_square = find_prev_square(trainee_selected, block_num);
    if (prev_square && (block_num % 4) != 0) {
        if (prev_square.sprite.rot_id != rot_change_to) {
            squares_dict[prev_square.sprite.role + "-" + prev_square.sprite.rot_id.toString()].removeChild(prev_square.sprite);
            prev_square.sprite.texture = prev_square.renderer.generateTexture(ROTATIONS_SQUARE_TEXTURE[prev_square.sprite.rot_id]);
            squares_dict[prev_square.sprite.role + "-" + prev_square.sprite.rot_id.toString()].addChild(prev_square.sprite);
        }
        else {
            prev_square.sprite.texture = prev_square.renderer.generateTexture(ROTATIONS_LONG_SQUARE_TEXTURE[rot_change_to]);
            squares_dict[prev_square.sprite.role + "-" + prev_square.sprite.rot_id.toString()].removeChild(prev_square.sprite);
            squares_dict[prev_square.sprite.role + "-" + rot_change_to].addChild(prev_square.sprite);
        }
    }

    // Remove the square from the old position in squares_dict
    squares_dict[sprite_selected.role + "-" + sprite_selected.rot_id.toString()].removeChild(sprite_selected);

    // Add the square to the new position in squares_dict
    squares_dict[sprite_selected.role+ "-" + rot_change_to].addChild(sprite_selected);
}

////////////////////////
// INTERACTION HELPER //
////////////////////////


/**
 * Handles when a block is pressed
 */
function onSquarePressed() {

    var rot_id = this.rot_id;
    var role = this.role;
    trainee_selected = this.trainee;
    block_num_selected = this.block_num;
    sprite_selected = this;

    if (program_state == STATE_INDIVIDUAL) {
        resetBlur();
        id_pressed = -3;
        role_pressed = "";
        square_selected = false;
        trainee_selected = null;
        block_num_selected = Number.POSITIVE_INFINITY;
        sprite_selected = null;

        // Calculate information regarding chart bars
        old_info_arr = new_info_arr;
        new_info_arr = new Array(num_block).fill(0)
        in_between_arr = generate_in_between_arr(old_info_arr, new_info_arr, ANIMATION_LENGTH);
        old_color = new_color;
        new_color = BACKGROUND_COLOR;
        in_between_color = generate_in_between_arr(old_color, new_color);
        old_min_height = new_min_height;
        new_min_height = 0;
        in_between_min_height = generate_in_between_val(old_min_height, new_min_height, ANIMATION_LENGTH);
        old_max_height = new_max_height;
        new_max_height = 0;
        in_between_max_height = generate_in_between_val(old_max_height, new_max_height, ANIMATION_LENGTH);

        // Calculate information regarding underdone bars
        var trainee_count = 0;
        for (var trainee_i = 0; trainee_i < trainees.length; trainee_i++) {
            var t = trainees[trainee_i];
            if (t.role != current_pgy) continue; // Skip the loop if it's not the pgy in need of visualized

            // Push underdone_arr into underdone array
            var underdone_arr = t.get_underdone_array();
            old_underdone_arrs[trainee_count] = new_underdone_arrs[trainee_count];
            new_underdone_arrs[trainee_count] = underdone_arr;
            in_between_underdone_arrs[trainee_count] =
                generate_in_between_arr(old_underdone_arrs[trainee_count],
                    new_underdone_arrs[trainee_count],
                    ANIMATION_LENGTH);
            trainee_count += 1;
        }

        // Calculate information regarding overdone bars
        var trainee_count = 0;
        for (var trainee_i = 0; trainee_i < trainees.length; trainee_i++) {
            var t = trainees[trainee_i];
            if (t.role != current_pgy) continue; // Skip the loop if it's not the pgy in need of visualized

            // Push overdone_arr into overdone array
            var overdone_arr = t.get_overdone_array();
            old_overdone_arrs[trainee_count] = new_overdone_arrs[trainee_count];
            new_overdone_arrs[trainee_count] = overdone_arr;
            in_between_overdone_arrs[trainee_count] =
                generate_in_between_arr(old_overdone_arrs[trainee_count],
                    new_overdone_arrs[trainee_count],
                    ANIMATION_LENGTH);
            trainee_count += 1;
        }

        // Draw popup;
        remove_popup();
        draw_partial_popup(x, y, this.trainee_name, this.rot_name);

        // Go to explore state
        program_state = STATE_EXPLORE;

    } else {
        id_pressed = rot_id;
        role_pressed = role;
        square_selected = true;

        if (program_state == STATE_EXPLORE) {

            animation_count = 0;
            // Change old alpha and new alpha

            for (var key in squares_dict) {
                squares_dict[key].old_alpha = squares_dict[key].alpha;
                squares_dict[key].new_alpha = OTHER_ROLE_BLUR

            }
            for (var id of id_list) {
                var key = role_pressed + "-" + id.toString();
                squares_dict[key].old_alpha = squares_dict[key].alpha;
                squares_dict[key].new_alpha = SQUARE_BLUR
            }
            var pressed_role_id_key = role_pressed + "-" + id_pressed;
            squares_dict[pressed_role_id_key].old_alpha = squares_dict[pressed_role_id_key].alpha;
            squares_dict[pressed_role_id_key].new_alpha = 1;

            // Draw out chart bars under the role by using PIXI.Graphics
            var base_x = 300;
            var base_y;
            switch (role) {
                case "PGY1":
                    chart_top_left_y = LABEL_ROLE_TOP_LEFT_Y + num_pgy1 * LABEL_HEIGHT + CHART_DISTANCE;
                    break;
                case "PGY2":
                    chart_top_left_y = LABEL_ROLE_TOP_LEFT_Y + num_pgy2 * LABEL_HEIGHT + CHART_DISTANCE;
                    break;
                case "PGY3":
                    chart_top_left_y = LABEL_ROLE_TOP_LEFT_Y + num_pgy3 * LABEL_HEIGHT + CHART_DISTANCE;
                    break;
            }

            old_info_arr = new_info_arr;
            new_info_arr = schedule.get_block_info_role_id(role, rot_id);
            in_between_arr = generate_in_between_arr(old_info_arr, new_info_arr, ANIMATION_LENGTH);
            old_color = new_color;
            new_color = ROTATIONS_COLOR[id_pressed];
            in_between_color = generate_in_between_arr(old_color, new_color, ANIMATION_LENGTH);
            old_min_height = new_min_height;
            old_max_height = new_max_height;
            switch (role) {
                case "PGY1":
                    new_min_height = rotations_dict[rot_id].min1;
                    new_max_height = rotations_dict[rot_id].max1;
                    break;
                case "PGY2":
                    new_min_height = rotations_dict[rot_id].min2;
                    new_max_height = rotations_dict[rot_id].max2;
                    break;
                case "PGY3":
                    new_min_height = rotations_dict[rot_id].min3;
                    new_max_height = rotations_dict[rot_id].max3;
                    break;
            }
            in_between_min_height = generate_in_between_val(old_min_height, new_min_height, ANIMATION_LENGTH);
            in_between_max_height = generate_in_between_val(old_max_height, new_max_height, ANIMATION_LENGTH);


            // Calculate information regarding underdone bars
            var trainee_count = 0;
            for (var trainee_i = 0; trainee_i < trainees.length; trainee_i++) {
                var t = trainees[trainee_i];
                if (t.role != current_pgy) continue; // Skip the loop if it's not the pgy in need of visualized

                // Push underdone_arr into underdone array
                var underdone_arr = t.get_underdone_spec_array(rot_id);
                old_underdone_arrs[trainee_count] = new_underdone_arrs[trainee_count];
                new_underdone_arrs[trainee_count] = underdone_arr;
                in_between_underdone_arrs[trainee_count] =
                    generate_in_between_arr(old_underdone_arrs[trainee_count],
                        new_underdone_arrs[trainee_count],
                        ANIMATION_LENGTH);
                trainee_count += 1;
            }

            // Calculate information regarding overdone bars
            var trainee_count = 0;
            for (var trainee_i = 0; trainee_i < trainees.length; trainee_i++) {
                var t = trainees[trainee_i];
                if (t.role != current_pgy) continue; // Skip the loop if it's not the pgy in need of visualized

                // Push overdone_arr into overdone array
                var overdone_arr = t.get_overdone_spec_array(rot_id);
                old_overdone_arrs[trainee_count] = new_overdone_arrs[trainee_count];
                new_overdone_arrs[trainee_count] = overdone_arr;
                in_between_overdone_arrs[trainee_count] =
                    generate_in_between_arr(old_overdone_arrs[trainee_count],
                        new_overdone_arrs[trainee_count],
                        ANIMATION_LENGTH);
                trainee_count += 1;
            }

            // reset animation
            animation_count = 0;

            // switch to explore square state
            program_state = STATE_INDIVIDUAL;

        } else if (program_state == STATE_SELECT) {

            // Draw Popup
            var x = this.x + 20;
            var y = close_to_border(this.y, "full");

            // Draw popup;
            draw_full_popup(x, y, this.trainee_name, this.rot_name);

            // Switch to popup state
            program_state = STATE_POPUP;
        }
    }

}

/**
 * Handles the event when mouse hovers over a square
 */
function onSquareOver() {

    if (program_state == STATE_EXPLORE || program_state == STATE_SELECT || program_state == STATE_INDIVIDUAL || program_state == STATE_POPUP_SELECT_BUFFER) {

        temp_line.clear();
        temp_line.lineStyle(1, 0x000000, 1);
        temp_line.moveTo(LABEL_ROLE_TOP_LEFT_X - DISTANCE, this.y - SQUARE_DISTANCE / 2);
        temp_line.lineTo(LABEL_ROLE_TOP_LEFT_X - DISTANCE + num_block * (SQUARE_SIZE + SQUARE_DISTANCE) + DISTANCE + (SQUARE_TOP_LEFT[0] - LABEL_TOP_LEFT_X), this.y - SQUARE_DISTANCE / 2);
        temp_line.lineTo(LABEL_ROLE_TOP_LEFT_X - DISTANCE + num_block * (SQUARE_SIZE + SQUARE_DISTANCE) + DISTANCE + (SQUARE_TOP_LEFT[0] - LABEL_TOP_LEFT_X), this.y + SQUARE_SIZE + SQUARE_DISTANCE / 2);
        temp_line.lineTo(LABEL_ROLE_TOP_LEFT_X - DISTANCE, this.y + SQUARE_SIZE + SQUARE_DISTANCE / 2);
        temp_line.lineTo(LABEL_ROLE_TOP_LEFT_X - DISTANCE, this.y - SQUARE_DISTANCE / 2);
        var x = this.x + 20;
        var y = close_to_border(this.y, "partial");
        draw_partial_popup(x, y, this.trainee_name, this.rot_name);

        if (program_state == STATE_POPUP_SELECT_BUFFER) program_state = STATE_SELECT;
    }
}

/**
 * Handles the event when mouse moves out of a square
 */
function onSquareOut() {
    if (program_state == STATE_EXPLORE || program_state == STATE_SELECT || program_state == STATE_INDIVIDUAL || program_state == STATE_POPUP_SELECT_BUFFER) {
        popup_label1.visible = false;
        popup_label2.visible = false;
        popup_label3.visible = false;
        popup_label4.visible = false;
        popup_info1.visible = false;
        popup_info2.visible = false;
        popup_info3.visible = false;
        popup_info4.visible = false;
        popup_click_to_view.visible = false;
        remove_popup();

        if (program_state == STATE_POPUP_SELECT_BUFFER) program_state = STATE_SELECT;
    }
}

/**
 * Handles the event when mouse hovers over a specific rotation in the popup to let the user know which rotation the user is selecting
 */
function onPopupOver() {
    this.alpha = 1;
}

/**
 * Handles the event when mouse moves out of a specific rotation
 */
function onPopupOut() {
    this.alpha = 0;
}

/**
 * Handles the event when a block's assigned rotation is changed
 */
function onPopupPressed() {
    if (program_state != STATE_POPUP) return;
    remove_popup();
    var rot_change_to = this.rot_id.toString();
    if (trainee_selected && Number.isFinite(block_num_selected) && sprite_selected && rot_change_to != sprite_selected.rot_id &&
        schedule_mode == SCHEDULE_MODE_QUARTER) {
        changeRotation(this, rot_change_to, block_num_selected);
    } else if (trainee_selected && Number.isFinite(block_num_selected) && sprite_selected && schedule_mode == SCHEDULE_MODE_WHOLE) {
        var start_block = Math.floor(block_num_selected / 4) * 4;
        var end_block = start_block + 4;

        for (var block_num = start_block; block_num < end_block; block_num++) {
            changeRotation(this, rot_change_to, block_num)
        }
    }
    calculate_underdone_overdone_bars();
    animation_count = 0;

    program_state = STATE_POPUP_SELECT_BUFFER;
}

/**
 * Changes the look of the close button in the popup window
 */
function onPopupCloseBtnOver() {
    this.alpha = 0.75;
}

/**
 * Changes the look of the close button in the popup window
 */
function onPopupCloseBtnOut() {
    this.alpha = 0.5;
}

/**
 * Closes the popup
 */
function onPopupCloseBtnPressed() {
    if (program_state != STATE_POPUP) return;
    remove_popup();
    program_state = STATE_SELECT;
}

/**
 * Changes the look of all squares
 */
function resetBlur() {
    animation_count = 0;
    for (var key in squares_dict) {
        squares_dict[key].old_alpha = squares_dict[key].alpha;
        squares_dict[key].new_alpha = 1;
    }
}

var isShown = false;
var isScheduled = false;
$("#radio-form").fadeIn();

/**
 * When clear button is clicked
 */
$('#clear_btn').click(function onClearPressed() {
    // isScheueld no longer true.
    isScheduled = false;
    isShown = false;

    // Turn back to schedule mode if it is currently exploring
    if (current_mode == MODE_EXPLORE) switch_button._toggleSwitch(false);

    // Clean all schedules.
    onPopupCloseBtnPressed();
    reset_schedule();
    visualize_data();
});

/**
 * When save csv button is clicked
 */
$('#save_btn').click(function onSavePressed() {
    download(schedule.get_schedule_info_csv(), "schedule.csv", "text/plain");
    finish_download_dialog();
});

/**
 * When greedy schedule button is hovered
 */
$('#greedy_schedule_btn').qtip({
   content: {
       text: 'Greedy schedule option allows you to find a basic solution'
   },
    style: {
       classes: 'qtip-light qtip-bootstrap qtip-rounded'
    }
});

/**
 * When solver schedule button is hovered
 */
$('#solver_schedule_btn').qtip({
   content: {
       text: 'Solver schedule option allows you to find an optimal solution which might not be able to be found'
   },
    style: {
       classes: 'qtip-light qtip-bootstrap qtip-rounded'
    }
});


/**
 * When greedy schedule button is clicked
 */
$('#greedy_schedule_btn').click(function onGreedySchedulePressed() {

    if (!isScheduled) {
        open_modal();
        $.ajax({
        type: "POST",
        url: "/requestToSchedule/greedy",
        data: JSON.stringify({title: schedule.generate_problem_text()}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            close_modal();
            if (!isShown) {
                isShown = true;
                isScheduled = true;

                // Read in the data
                var received_text = data['data'];

                read_in_data(received_text);
                reset_app();
                sort_trainees(trainees);
                visualize_data();

                if (current_mode == MODE_SCHEDULE) switch_button._toggleSwitch(false);
            }
        }
    });}
    else {alert_scheduled();}
});

/**
 * When solver schedule button is clicked
 */
$('#solver_schedule_btn').click(function onSolverSchedulePressed() {
    if (!isScheduled) {
        open_modal();
        $.ajax({
        type: "POST",
        url: "/requestToSchedule/solver",
        data: JSON.stringify({title: schedule.generate_problem_text()}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            close_modal();
            if (!isShown) {
                isShown = true;
                isScheduled = true;

                // Read in the data
                var received_text = data['data'];

                read_in_data(received_text);
                reset_app();
                sort_trainees(trainees);
                visualize_data();

                if (current_mode == MODE_SCHEDULE) switch_button._toggleSwitch(false);
            }
        }
    });}
    else {alert_scheduled();}
});

/**
 * When ESC key is pressed
 */
$(document).keyup(function(e) {
     if (e.keyCode == 27) { // escape key maps to keycode `27`
        resetBlur();
        remove_popup();
    }
});

/**
 * When mode is switched
 */
$("input[type=checkbox]").switchButton({
    on_label: 'Edit',
    off_label: 'Explore',
    width: 60,
    height: 25,
    button_width: 25
});


/**
 * When schedule whole block or quarter block mode is switched
 */
$("input[type=checkbox]").on("change", function(){
    if ($(this).is(":not(:checked)")) {
        program_state = STATE_EXPLORE;
        current_mode = MODE_EXPLORE;
        $("#radio-form").fadeOut(FADE_LENGTH);
    }

    else if ($(this).is(":checked")) {
        program_state = STATE_SELECT;
        current_mode = MODE_SCHEDULE;
        $("#radio-form").fadeIn(FADE_LENGTH);
    }
});

/**
 * When whole block is selected
 */
$("#radio_whole").on("click", function() {
    schedule_mode = SCHEDULE_MODE_WHOLE;
});

/**
 * When quarter block is selected
 */
$("#radio_quarter").on("click", function() {
    schedule_mode = SCHEDULE_MODE_QUARTER;
    console.log("SHIT");
})

var fileInput = $("#file_upload");

/**
 * When upload data button is clicked
 */
$("#upload_btn").click(function() {
    $("#file_upload").click();
})

/**
 * Upload data file
 */
$("#file_upload").on('change', function() {
    var input = fileInput.get(0);

    // Create a reader object
    var reader = new FileReader();
    if (input.files.length) {
        var textFile = input.files[0];
        // Read the file
        reader.readAsText(textFile);
        // When it's loaded, process it
        $(reader).on('load', processFile);
    } else {
        alert('Please upload a file before continuing')
    }
});

/**
 * Processes the uploaded data file
 * @param e
 */
function processFile(e) {
    var file = e.target.result;
    problem_text = file;
    processProblemText();
}

////////////////////
// OTHER HELPER  ///
///////////////////

/**
 * Process the file to the format that works with this platform
 */
function processProblemText() {
    read_in_data_from_medtrics(problem_text);

    var num_pgy_vis; // Num of students visualized
    if (current_pgy == "PGY1") num_pgy_vis = num_pgy1;
    else if (current_pgy == "PGY2") num_pgy_vis = num_pgy2;
    else if (current_pgy == "PGY3") num_pgy_vis = num_pgy3;

    app_height = LABEL_ROLE_TOP_LEFT_Y + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST +
        num_pgy_vis * LABEL_HEIGHT + CHART_DISTANCE + num_pgy_vis * CHART_UNIT + 100;

    create_objects(app_width, app_height);
    sort_trainees(trainees);
    for (var t of trainees) {
        helper_square_dict[t.id] = new Array(num_block);
    }
    visualize_data();
}