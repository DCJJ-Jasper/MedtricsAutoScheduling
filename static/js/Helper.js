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

        // Create a new trainee based on these information
        new_trainee = new Trainee(name, role, id, num_block, id_list);
        new_trainee.set_scheduled_blocks(schedule_info);
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

        rot_name = data[0];
        rot_id = rot_name_to_id_dict[rot_name];
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

        rot_name = data[0];
        rot_id = rot_name_to_id_dict[rot_name];
        num_block_required = parseFloat(data[1]);

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

///////////////////////
// VISUALIZATION HELPER
///////////////////////

function visualize_data() {

    // Clear out all containers
    squares_dict = {};
    underdone_bars = {};

    // Clear out all list
    pgy_squares_list = [];

    // Clean pgy label stuffs
    app.stage.removeChild(pgy_container);
    pgy_container = new PIXI.Container();
    pgy_container.interactive = true;
    pgy_container.width = 1080;
    pgy_container.height = 1920;
    app.stage.addChild(pgy_container);

    // Clean all squares
    app.stage.removeChild(rot_squares_list);
    rot_squares_list = [];

    // Clean all underdone container
    for (var underdone_bar of underdone_list) {
        app.stage.removeChild(underdone_bar);
    }
    underdone_list = [];

    // Clean all chart list
    app.stage.removeChild(chart_bars);
    chart_bars = new PIXI.Graphics();
    app.stage.addChild(chart_bars);

    var start_x = SQUARE_TOP_LEFT[0];
    var start_y = LABEL_ROLE_TOP_LEFT_Y + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST;

    var num_pgy_vis; // Num of students visualized
    if (current_pgy == "PGY1") num_pgy_vis = num_pgy1;
    else if (current_pgy == "PGY2") num_pgy_vis = num_pgy2;
    else if (current_pgy == "PGY3") num_pgy_vis = num_pgy3;
    var trainee_count = 0;

    // Draw block number labels
    var blockNumberLabelPositions = new Array(13);
    blockNumberLabelPositions[0] = SQUARE_TOP_LEFT[0] + SQUARE_SIZE * 4 / 2;
    for (var i = 1; i < (num_block + 1) / 4; i++) {
        if (i < 10) {
            blockNumberLabelPositions[i] = SQUARE_TOP_LEFT[0] + SQUARE_SIZE * 4 * (i + 0.5) + SQUARE_DISTANCE * 4 * i - LABEL_SIZE / 2;
        } else {
            blockNumberLabelPositions[i] = SQUARE_TOP_LEFT[0] + SQUARE_SIZE * 4 * (i + 0.5) + SQUARE_DISTANCE * 4 * i - LABEL_SIZE / 2;
        }
        var blockNumberLabel = new PIXI.Text(i, {fontSize: LABEL_SIZE});
        blockNumberLabel.position.set(blockNumberLabelPositions[i - 1], BLOCK_LABEL_HEIGHT);
        app.stage.addChild(blockNumberLabel);
    }

    var pgy_count = 0;

    // Create labels for all the trainees
    for (var t of trainees) {
        if (t.role == current_pgy) {
            var trainee_label = new PIXI.Text(t.name, {fontSize: LABEL_SIZE});
            trainee_label.position.set(LABEL_TOP_LEFT_X, LABEL_TOP_LEFT_Y + pgy_count * LABEL_HEIGHT);
            pgy_container.addChild(trainee_label);
            pgy_count += 1;
        }
    }

    // Drawing the static_stuffs
    pgy_count = 0;

    // Dictionaries of the containers
    for (var i = 0; i < rotations.length; i++) {
        for (var role of ROLES_LIST) {
            var new_container = new PIXI.Container();
            new_container.interactive = true;
            new_container.width = 1080;
            new_container.height = 1920;
            squares_dict[role + "-" + rotations[i].id.toString()] = new_container;
            rot_squares_list.push(new_container);
            app.stage.addChild(new_container);
        }
    }

    for (var role of ROLES_LIST) {
        // Add containers for empty and vacation
        var empty_container = new PIXI.Container();
        empty_container.interactive = true;
        empty_container.width = 1080;
        empty_container.height = 1920;
        squares_dict[role + "-" + "-1"] = empty_container;
    }

    for (var role of ROLES_LIST) {
        var vac_container = new PIXI.Container();
        vac_container.interactive = true;
        vac_container.width = 1080;
        vac_container.height = 1920;
        squares_dict[role + "-" + "-2"] = empty_container;
    }

    // Draw out squares
    for (var t of trainees) {
        var color;
        var role = t.role;
        var start_name_label_y = LABEL_TOP_LEFT_Y;

        if (t.role != current_pgy) continue; // Skip the loop if it's not the pgy in need of visualized

        for (var rot_count = 0; rot_count < num_block; rot_count++) {
            var id = t.scheduled_blocks[rot_count];
            if (id == -1) id = EMPTY_BLOCK_GRAPHIC_ID;

            t.processed_reqs[id] -= 1;

            color = convert_to_color_code(ROTATIONS_COLOR[id]);

            var x = start_x + rot_count * UNIT_RANGE + Math.floor(rot_count / 4) * BLOCK_DISTANCE;
            var y = start_name_label_y + trainee_count * LABEL_HEIGHT;

            var rot = rotations_dict[id];
            var rot_name = "";
            var trainee_name = t.name;
            var block_num = rot_count;

            if (rot) {
                rot_name = rot.name;
            }

            var newSquare;
            if ((rot_count % 4 != 3) && (t.scheduled_blocks[rot_count] == t.scheduled_blocks[rot_count + 1])) {
                newSquare = new LongSquare(x, y, color, app.renderer, rot_name, id, role, t, trainee_name, block_num);
            } else {
                newSquare = new Square(x, y, color, app.renderer, rot_name, id, role, t, trainee_name, block_num);
            }

            // Push the square into the 2D array
            // TODO: Push the square into 2D array here.

            newSquare.draw();
            squares_sprites_list.push(newSquare.sprite);
            newSquare.sprite.on('mousedown', onSquarePressed);
            newSquare.sprite.on('mouseover', onButtonOver);
            newSquare.sprite.on('mouseout', onButtonOut);

            squares_dict[role + "-" + id.toString()].addChild(newSquare.sprite);
            pgy_squares_list.push(newSquare.sprite);
        }
        trainee_count += 1;
    }

    for (var r of rotations) {
        var new_graphic = new PIXI.Graphics();
        underdone_bars[r.id] = new_graphic;
        underdone_list.push(new_graphic);
        app.stage.addChild(new_graphic);
    }

    // Draw out underdone bars on the right by using PIXI.Graphics
    var underdone_top_left_x = SQUARE_TOP_LEFT[0] + UNIT_RANGE * num_block + UNDERDONE_OFFSET_X + UNDERDONE_UNIT_LENGTH * num_block;
    var base_x = underdone_top_left_x;
    var base_y = SQUARE_TOP_LEFT[1];
    var trainee_count = 0;
    for (var trainee_i = 0; trainee_i < trainees.length; trainee_i++) {
        var t = trainees[trainee_i];
        if (t.role != current_pgy) continue; // Skip the loop if it's not the pgy in need of visualized

        // Push underdone_arr into underdone array
        var underdone_arr = t.get_underdone_array();
        old_underdone_arrs[trainee_count] = underdone_arr;
        new_underdone_arrs[trainee_count] = underdone_arr;
        in_between_underdone_arrs[trainee_count] =
            generate_in_between_arr(old_underdone_arrs[trainee_count],
                new_underdone_arrs[trainee_count],
                ANIMATION_LENGTH);
        trainee_count += 1;
    }

    // Draw requirement for the first time
    var num_pgy_vis;
    switch (current_pgy) {
        case "PGY1":
            num_pgy_vis = num_pgy1; break;
        case "PGY2":
            num_pgy_vis = num_pgy2; break;
        case "PGY3":
            num_pgy_vis = num_pgy2; break;
    }

    for (var i = 0; i < num_pgy_vis; i++) {
        for (var j = 0; j < num_rotations; j++) {
            var rot_id = id_list[j]
            var color = convert_to_color_code(ROTATIONS_COLOR[rot_id]);
            var graphic = underdone_bars[rot_id];

            // Calculate points
            if (j == 0) {
                var x1 = base_x;
                var y1 = base_y + UNDERDONE_UNIT_RANGE * i;
                var x2 = base_x + UNDERDONE_UNIT_LENGTH * new_underdone_arrs[i][j];
                var y2 = base_y + UNDERDONE_UNIT_RANGE * i + UNDERDONE_SIZE;
            } else {
                var x1 = base_x + UNDERDONE_UNIT_LENGTH * new_underdone_arrs[i][j - 1];
                var y1 = base_y + UNDERDONE_UNIT_RANGE * i;
                var x2 = base_x + UNDERDONE_UNIT_LENGTH * new_underdone_arrs[i][j];
                var y2 = base_y + UNDERDONE_UNIT_RANGE * i + UNDERDONE_SIZE;
            }

            // Draw the rectangle
            draw_rectangle(graphic, color, x1, y1, x2, y2);
        }
    }
}

/**
 * Draw out the popup
 */
function draw_full_popup(x1, y1, trainee_name, rot_name) {

    temp_graphic.clear();
    temp_graphic.beginFill(0xFFFFFF);
    temp_graphic.lineStyle(1, '0xDEDDDD', 1);

    var x2 = x1 + POPUP_WIDTH;
    var y2 = y1 + POPUP_WEIGHT + POPUP_LABEL_HEIGHT * (num_rotations + 1);

    temp_graphic.moveTo(x1, y1);
    temp_graphic.lineTo(x1, y2);
    temp_graphic.lineTo(x2, y2);
    temp_graphic.lineTo(x2, y1);
    temp_graphic.lineTo(x1, y1);
    temp_graphic.endFill();

    var start_x = x1 + POPUP_PADDING;
    var start_y = y1 + POPUP_PADDING;

    popup_close_btn.visible = true;
    popup_close_btn.interactive = true;
    popup_label1.visible = true;
    popup_label2.visible = true;
    popup_label3.visible = true;
    popup_label4.visible = true;
    popup_info1.visible = true;
    popup_info2.visible = true;
    popup_info3.visible = true;
    popup_info4.visible = true;
    popup_click_to_view.visible = true;

    popup_close_btn.x = start_x + POPUP_WIDTH - POPUP_CLOSE_OFFSET;
    popup_close_btn.y = start_y;

    popup_label1.x = start_x;
    popup_label1.y = start_y;

    popup_label2.x = start_x;
    popup_label2.y = start_y + POPUP_LABEL_HEIGHT;

    popup_label3.x = start_x;
    popup_label3.y = start_y + POPUP_LABEL_HEIGHT * 2;

    popup_label4.x = start_x;
    popup_label4.y = start_y + POPUP_LABEL_HEIGHT * 3;

    popup_click_to_view.x = start_x;
    popup_click_to_view.y = start_y + POPUP_LABEL_HEIGHT * 4;
    popup_click_to_view.text = 'Select a rotation you would like to change to'

    popup_info1.x = start_x + POPUP_INFO_X_OFFSET;
    popup_info1.y = start_y;
    popup_info1.text = rot_name;

    popup_info2.x = start_x + POPUP_INFO_X_OFFSET;
    popup_info2.y = start_y + POPUP_LABEL_HEIGHT;

    popup_info3.x = start_x + POPUP_INFO_X_OFFSET;
    popup_info3.y = start_y + POPUP_LABEL_HEIGHT * 2;

    popup_info4.x = start_x + POPUP_INFO_X_OFFSET;
    popup_info4.y = start_y + POPUP_LABEL_HEIGHT * 3;
    popup_info4.text = trainee_name;

    rot_top_left_x = start_x;
    rot_top_left_y = start_y + POPUP_LABEL_HEIGHT * 5;

    var label;
    var square;
    var click_field;
    for (var i = 0; i < num_rotations + 1; i++) {
        click_field = rotation_click_fields[i];
        square = rotation_squares[i];
        label = rotation_labels[i];

        click_field.x = start_x;
        square.x = start_x + POPUP_SQUARE_OFFSET_X;
        square.y = start_y + POPUP_LABEL_HEIGHT * (5 + i) + POPUP_SQUARE_OFFSET_Y + POPUP_ROTATION_OFFSET;

        click_field.y = start_y + POPUP_LABEL_HEIGHT * (5 + i);
        label.x = start_x + POPUP_ROTATION_LABEL_OFFSET;
        label.y = start_y + POPUP_LABEL_HEIGHT * (5 + i) + POPUP_ROTATION_OFFSET;
    }

    app.stage.addChild(temp_line);
    app.stage.addChild(temp_graphic);
    app.stage.addChild(popup_close_btn);
    app.stage.addChild(popup_label1);
    app.stage.addChild(popup_label2);
    app.stage.addChild(popup_label3);
    app.stage.addChild(popup_label4);
    app.stage.addChild(popup_info1);
    app.stage.addChild(popup_info2);
    app.stage.addChild(popup_info3);
    app.stage.addChild(popup_info4);
    app.stage.addChild(popup_click_to_view);
    app.stage.addChild(rotation_click_fields_container);
    app.stage.addChild(rotation_labels_container);
    app.stage.addChild(rotation_squares_container);
    app.stage.addChild(temp_popup);
}

/**
 * Partially draw a popup
 */
function draw_partial_popup(x1, y1, trainee_name, rot_name) {

    temp_graphic.clear();
    temp_graphic.beginFill(0xFFFFFF);
    temp_graphic.lineStyle(1, '0xDEDDDD', 1);

    var x2 = x1 + POPUP_WIDTH;
    var y2 = y1 + POPUP_WEIGHT;

    temp_graphic.moveTo(x1, y1);
    temp_graphic.lineTo(x1, y2);
    temp_graphic.lineTo(x2, y2);
    temp_graphic.lineTo(x2, y1);
    temp_graphic.lineTo(x1, y1);
    temp_graphic.endFill();

    var start_x = x1 + POPUP_PADDING;
    var start_y = y1 + POPUP_PADDING;

    popup_label1.visible = true;
    popup_label2.visible = true;
    popup_label3.visible = true;
    popup_label4.visible = true;
    popup_info1.visible = true;
    popup_info2.visible = true;
    popup_info3.visible = true;
    popup_info4.visible = true;
    popup_click_to_view.visible = true;

    popup_label1.x = start_x;
    popup_label1.y = start_y;

    popup_label2.x = start_x;
    popup_label2.y = start_y + POPUP_LABEL_HEIGHT;

    popup_label3.x = start_x;
    popup_label3.y = start_y + POPUP_LABEL_HEIGHT * 2;

    popup_label4.x = start_x;
    popup_label4.y = start_y + POPUP_LABEL_HEIGHT * 3;

    popup_click_to_view.x = start_x;
    popup_click_to_view.y = start_y + POPUP_LABEL_HEIGHT * 4;
    if (current_mode == MODE_EXPLORE) {
        popup_click_to_view.text = 'Click to explore additional information';
    } else if (current_mode == MODE_SCHEDULE) {
        popup_click_to_view.text = 'Click to change rotation';
    }


    popup_info1.x = start_x + POPUP_INFO_X_OFFSET;
    popup_info1.y = start_y;
    popup_info1.text = rot_name;

    popup_info2.x = start_x + POPUP_INFO_X_OFFSET;
    popup_info2.y = start_y + POPUP_LABEL_HEIGHT;

    popup_info3.x = start_x + POPUP_INFO_X_OFFSET;
    popup_info3.y = start_y + POPUP_LABEL_HEIGHT * 2;

    popup_info4.x = start_x + POPUP_INFO_X_OFFSET;
    popup_info4.y = start_y + POPUP_LABEL_HEIGHT * 3;
    popup_info4.text = trainee_name;

    app.stage.addChild(temp_line);
    app.stage.addChild(temp_graphic);
    app.stage.addChild(popup_label1);
    app.stage.addChild(popup_label2);
    app.stage.addChild(popup_label3);
    app.stage.addChild(popup_label4);
    app.stage.addChild(popup_info1);
    app.stage.addChild(popup_info2);
    app.stage.addChild(popup_info3);
    app.stage.addChild(popup_info4);
    app.stage.addChild(popup_click_to_view);
}

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

function openModal() {
    var ele = document.getElementById('modal')
    if (ele)
      ele.style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function disableSquaresInteractivity() {
    for (var s of squares_sprites_list) {
        s.interactive = false;
    }
}

function enableSquaresInteractivity() {
    for (var s of squares_sprites_list) {
        s.interactive = true;
    }
}


/**
 * Move forward with the animation.
 */
function proceedAnimation() {
    if (animation_count <= ANIMATION_LENGTH) {

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

        // Min chart line
        y1 = base_y + in_between_min_height[animation_count] * SQUARE_SIZE;
        x1 = base_x;
        x2 = base_x + SQUARE_SIZE * num_block + SQUARE_DISTANCE * (num_block - 1);
        chart_bars.lineStyle(2, "0xFF0000", 1);
        chart_bars.moveTo(x1, y1);
        chart_bars.lineTo(x2, y1);

        // Max chart line
        y1 = base_y + in_between_max_height[animation_count] * SQUARE_SIZE;
        chart_bars.moveTo(x1, y1);
        chart_bars.lineTo(x2, y1);
        chart_bars.lineStyle(0);

        // Draw out all the underdone bars
        var num_pgy_vis;
        switch (current_pgy) {
            case "PGY1":
                num_pgy_vis = num_pgy1; break;
            case "PGY2":
                num_pgy_vis = num_pgy2; break;
            case "PGY3":
                num_pgy_vis = num_pgy2; break;
        }

        var underdone_top_left_x = SQUARE_TOP_LEFT[0] + UNIT_RANGE * num_block + UNDERDONE_OFFSET_X;
        var base_x = underdone_top_left_x;
        var base_y = SQUARE_TOP_LEFT[1];

        for (var j = 0; j < num_rotations; j++) {
            var rot_id = id_list[j]
            var graphic = underdone_bars[rot_id];
            graphic.clear();
        }

        for (var i = 0; i < num_pgy_vis; i++) {
            for (var j = 0; j < num_rotations; j++) {
                var rot_id = id_list[j]
                var color = convert_to_color_code(ROTATIONS_COLOR[rot_id]);
                var graphic = underdone_bars[rot_id];

                // Calculate points
                if (j == 0) {
                    var x1 = base_x;
                    var y1 = base_y + UNDERDONE_UNIT_RANGE * i;
                    var x2 = base_x + UNDERDONE_UNIT_LENGTH * in_between_underdone_arrs[i][animation_count][j];
                    var y2 = base_y + UNDERDONE_UNIT_RANGE * i + UNDERDONE_SIZE;
                } else {
                    var x1 = base_x + UNDERDONE_UNIT_LENGTH * in_between_underdone_arrs[i][animation_count][j - 1];
                    var y1 = base_y + UNDERDONE_UNIT_RANGE * i;
                    var x2 = base_x + UNDERDONE_UNIT_LENGTH * in_between_underdone_arrs[i][animation_count][j];
                    var y2 = base_y + UNDERDONE_UNIT_RANGE * i + UNDERDONE_SIZE;
                }

                // Draw the rectangle
                draw_rectangle(graphic, color, x1, y1, x2, y2)
            }
        }

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