/**
 * Created by AC on 2/9/17.
 */

///////////////////
// GLOBAL VARIABLES
///////////////////

// SCHEDULING VARIABLES

var num_block = 0;
var num_roles = 0;
var num_trainees = 0;
var num_rotations = 0;

var num_pgy1 = 0;
var num_pgy2 = 0;
var num_pgy3 = 0;

var pgy1_reqs = {};
var pgy2_reqs = {};
var pgy3_reqs = {};

var pgy1_lims = {};
var pgy2_lims = {};
var pgy3_lims = {};

var trainees = [];
var trainees_dict = [];
var rotations = [];
var rotations_dict = {};
var rot_name_to_id_dict = {};
var id_list = [];

var schedule;
var problem_text = FAKE_TEXT;

var trainee_selected = null;
var block_num_selected = Number.POSITIVE_INFINITY;
var sprite_selected = null;

// GRAPHIC VARIABLES

var app_width = 1920;
var app_height;

// GRAPHIC OBJECT VARIABLES

var app;
var static_stuffs;
var pgy_container;
var loader_container;

var rot_squares_list;
var underdone_list;
var overdone_list;

var chart_bars;
var old_info_arr;
var new_info_arr;
var in_between_arr;
var old_color;
var new_color;
var in_between_color;
var chart_top_left_y;
var old_min_height;
var new_min_height;
var in_between_min_height;
var old_max_height;
var new_max_height;
var in_between_max_height;

var squares_sprites_list = [];
var squares_dict = {};

var underdone_bars = {};
var old_underdone_arrs;
var new_underdone_arrs;
var in_between_underdone_arrs;
var underdone_label;
var overdone_label;

var overdone_bars = {};
var old_overdone_arrs;
var new_overdone_arrs;
var in_between_overdone_arrs;

var helper_square_dict = {};

var popup_close_btn;
var popup_label1;
var popup_label2;
var popup_label3;
var popup_label4;
var popup_info1;
var popup_info2;
var popup_info3;
var popup_info4;
var popup_click_to_view;
var temp_popup;
var rot_top_left_x;
var rot_top_left_y;
var rotation_click_fields;
var rotation_click_fields_container;
var rotation_labels;
var rotation_labels_container;
var rotation_squares;
var rotation_squares_container;
var temp_graphic;
var temp_line;
var loader_gif;
var loader_label;

var line_graphic;

var block_labels  = [];

var switch_button;

// GRAPHIC CONTROL VARIABLES

var program_state = STATE_SELECT; // Program starts with state explore

var square_selected = false;
var id_pressed = -3;
var role_pressed = "";
var current_mode = MODE_SCHEDULE;
var schedule_mode = SCHEDULE_MODE_WHOLE;
var current_pgy = "PGY1";

// ANIMATION CONTROL VARIABLES
var animation_count = ANIMATION_LENGTH + 1;

///////////////////
// OBJECTS CREATION
///////////////////

function create_objects(width, height) {
    app = new PIXI.Application();
    app.renderer = PIXI.autoDetectRenderer(width, height, {antialias: true});
    app.renderer.backgroundColor = 0xffffff;
    app.renderer.autoResize = true;
    document.body.appendChild(app.view);

    // Hold static elements such as labels
    static_stuffs = new PIXI.Container();
    static_stuffs.interactive = true;
    static_stuffs.width = width;
    static_stuffs.height = height;
    app.stage.addChild(static_stuffs);

    // Hold static elements such as labels
    pgy_container = new PIXI.Container();
    pgy_container.interactive = true;
    pgy_container.width = width;
    pgy_container.height = height;
    app.stage.addChild(pgy_container);

    // Popup stuffs
    popup_close_btn = new PIXI.Sprite.fromImage("static/images/Close Window-25.png");
    popup_label1 = new PIXI.Text('Rotation:', {fontStyle: "bold", fontSize: POPUP_LABEL_SIZE});
    popup_label2 = new PIXI.Text('When:', {fontStyle: "bold", fontSize: POPUP_LABEL_SIZE});
    popup_label3 = new PIXI.Text('Duration:', {fontStyle: "bold", fontSize: POPUP_LABEL_SIZE});
    popup_label4 = new PIXI.Text('Trainee', {fontStyle: "bold", fontSize: POPUP_LABEL_SIZE});
    popup_info1 = new PIXI.Text('', {fontSize: LABEL_SIZE});
    popup_info2 = new PIXI.Text('', {fontSize: LABEL_SIZE});
    popup_info3 = new PIXI.Text('', {fontSize: LABEL_SIZE});
    popup_info4 = new PIXI.Text('', {fontSize: LABEL_SIZE});
    popup_click_to_view = new PIXI.Text('Click to change this rotation', {fontStyle: "italic", fill: 0x3D78BD, fontSize: LABEL_SIZE});
    popup_close_btn.visible = false;
    popup_close_btn.alpha = 0.5;
    popup_close_btn.on('mousedown', onPopupCloseBtnPressed);
    popup_close_btn.on('mouseover', onPopupCloseBtnOver);
    popup_close_btn.on('mouseout', onPopupCloseBtnOut);

    popup_label1.visible = false;
    popup_label2.visible = false;
    popup_label3.visible = false;
    popup_label4.visible = false;
    popup_info1.visible = false;
    popup_info2.visible = false;
    popup_info3.visible = false;
    popup_info4.visible = false;
    popup_click_to_view.visible = false;
    temp_popup = new PIXI.Graphics();
    temp_graphic = new PIXI.Graphics();

    rotation_labels = [];
    rotation_squares = [];
    rotation_click_fields = [];
    rotation_labels_container = new PIXI.Container();
    rotation_squares_container = new PIXI.Container();
    rotation_click_fields_container = new PIXI.Container();

    for (var rot of rotations) {

        // Click field
        var texture = new PIXI.Graphics();
        texture.beginFill(convert_to_color_code(POPUP_FILLED));
        texture.drawRect(0, 0, POPUP_WIDTH - POPUP_PADDING * 2, POPUP_LABEL_HEIGHT - 2);
        texture.endFill();
        var sprite = new PIXI.Sprite();
        sprite.interactive = true;
        sprite.alpha = 0;
        sprite.texture = app.renderer.generateTexture(texture);
        sprite.rot_id = rot.id;
        sprite.rot_name = rot.name;
        sprite.on('mouseover',onPopupOver);
        sprite.on('mouseout', onPopupOut);
        sprite.on('mousedown', onPopupPressed);
        rotation_click_fields.push(sprite);
        rotation_click_fields_container.addChild(sprite);

        // Label
        var label = new PIXI.Text(rot.name, {fontSize: POPUP_ROTATION_SIZE})
        rotation_labels.push(label);
        rotation_labels_container.addChild(label);

        // Square
        var texture = new PIXI.Graphics();
        texture.beginFill(convert_to_color_code(ROTATIONS_COLOR[rot.id]));
        texture.drawRect(0, 0, POPUP_ROTATION_SQUARE, POPUP_ROTATION_SQUARE);
        texture.endFill();
        var sprite = new PIXI.Sprite();
        sprite.texture = app.renderer.generateTexture(texture);
        sprite.rot_id = rot.id;
        rotation_squares.push(sprite);
        rotation_squares_container.addChild(sprite);
    }

    // Temporary line to highlight current trainee.
    temp_line = new PIXI.Graphics();

    // Line graphic holds all the
    line_graphic = new PIXI.Graphics();
    app.stage.addChild(line_graphic);

    // Hold all squares graphics
    rot_squares_list = [];

    // Hold all underdone and over done bars
    underdone_list = [];
    overdone_list = [];
    app.ticker.add(proceedAnimation);
}

/////////////////////
// INTERACTION HELPER
/////////////////////

function onSquarePressed() {

    console.log(program_state);

    var rot_id = this.rot_id;
    console.log(rot_id);
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

function onPopupOver() {
    this.alpha = 1;
}

function onPopupOut() {
    this.alpha = 0;
}

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
    calculate_underdone_overdone_bars()
    animation_count = 0;

    program_state = STATE_POPUP_SELECT_BUFFER;
}

function onPopupCloseBtnOver() {
    this.alpha = 0.75;
}

function onPopupCloseBtnOut() {
    this.alpha = 0.5;
}

function onPopupCloseBtnPressed() {
    if (program_state != STATE_POPUP) return;
    remove_popup();
    program_state = STATE_SELECT;
}

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
 * When schedule button is clicked
 */
$('#clear_btn').click(function onClearPressed() {
    // isScheueld no longer true.
    isScheduled = false;
    isShown = false;

    // Turn back to schedule mode if it is currently exploring
    if (current_mode == MODE_EXPLORE) switch_button._toggleSwitch(false);

    // Clean all schedules.
    reset_schedule();
    visualize_data();
});

/**
 * When schedule button is clicked
 */
$('#save_btn').click(function onSavePressed() {
    download(schedule.get_schedule_info_csv(), "schedule.csv", "text/plain");
    finish_download_dialog();
});

/**
 * When schedule button is hovered
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
 * When schedule button is hovered
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
 * When schedule button is clicked
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
 * When schedule button is clicked
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

$(document).ready();

$(document).keyup(function(e) {
     if (e.keyCode == 27) { // escape key maps to keycode `27`
        resetBlur();
        remove_popup();
    }
});

$("input[type=checkbox]").switchButton({
    on_label: 'Edit',
    off_label: 'Explore',
    width: 60,
    height: 25,
    button_width: 25
});


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

$("#radio_whole").on("click", function() {
    schedule_mode = SCHEDULE_MODE_WHOLE;
})

$("#radio_quarter").on("click", function() {
    schedule_mode = SCHEDULE_MODE_QUARTER;
    console.log("SHIT");
})

var fileInput = $("#file_upload");

$("#upload_btn").click(function() {
    $("#file_upload").click();
})

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

function processFile(e) {
    var file = e.target.result;
    problem_text = file;
    processProblemText();
}

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

console.log(PROBLEM_TEXT)