// Copyright (C) Medtrics Lab, Inc - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential
// Written by Chengjunjie(Jasper) Ding, Son Pham, Yadong(AC) Li, Tung Phan <son@medtricslab.com>, May 2017

/**
 * Visualization.js
 */

//////////////////////
// GLOBAL VARIABLES //
//////////////////////

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

//////////////////////
// OBJECTS CREATION //
//////////////////////

/**
 * Create all the visualization objects
 * @param width
 * @param height
 */
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



///////////////////////////
// VISUALIZATION Drawers //
//////////////////////////

/**
 * Draws out all the visualizations on the page
 */
function visualize_data() {

    // Clear out all containers
    squares_dict = {};
    underdone_bars = {};
    ooverdone_bars = {};

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

    // Clean all underdone and overdone container
    for (var underdone_bar of underdone_list) {
        app.stage.removeChild(underdone_bar);
    }
    underdone_list = [];

    for (var overdone_bar of overdone_list) {
        app.stage.removeChild(overdone_bar);
    }
    overdone_list = [];

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

    // Clean all block labels
    for (var label of block_labels) app.stage.removeChild(label);
    block_labels = [];

    // Draw block number labels
    var blockNumberLabelPositions = new Array(13);
    blockNumberLabelPositions[0] = SQUARE_TOP_LEFT[0] + SQUARE_SIZE * 4 / 2;
    for (var i = 1; i < (num_block + 1) / 4; i++) {
        if (i < 9) {
            blockNumberLabelPositions[i] = SQUARE_TOP_LEFT[0] + SQUARE_SIZE * 4 * (i + 0.5) + SQUARE_DISTANCE * 4 * i;
        } else {
            blockNumberLabelPositions[i] = SQUARE_TOP_LEFT[0] + SQUARE_SIZE * 4 * (i + 0.5) + SQUARE_DISTANCE * 4 * i - LABEL_SIZE / 2;
        }
        var blockNumberLabel = new PIXI.Text(i, {fontSize: LABEL_SIZE});
        blockNumberLabel.position.set(blockNumberLabelPositions[i - 1], BLOCK_LABEL_HEIGHT);
        block_labels.push(blockNumberLabel);
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
    var trainee_count = 0;
    for (var t of trainees) {
        var color;
        var role = t.role;
        var start_name_label_y = LABEL_TOP_LEFT_Y;

        if (t.role != current_pgy) continue; // Skip the loop if it's not the pgy in need of visualized

        for (var rot_count = 0; rot_count < num_block; rot_count++) {
            var id = t.scheduled_blocks[rot_count];
            if (id == -1) id = EMPTY_BLOCK_GRAPHIC_ID;

            color = convert_to_color_code(ROTATIONS_COLOR[id]);

            var x = start_x + rot_count * UNIT_RANGE + Math.floor(rot_count / 4) * BLOCK_DISTANCE;
            var y = start_name_label_y + trainee_count * LABEL_HEIGHT;

            var rot = rotations_dict[id];
            var rot_name = "";
            var trainee_name = t.name;
            var block_num = rot_count;
            var trainee_id = t.id;

            if (rot) {
                rot_name = rot.name;
            }

            var newSquare;
            if ((rot_count % 4 != 3) && (t.scheduled_blocks[rot_count] == t.scheduled_blocks[rot_count + 1])) {
                newSquare = new LongSquare(x, y, color, app.renderer, rot_name, id, role, t, trainee_name, block_num);
            } else {
                newSquare = new Square(x, y, color, app.renderer, rot_name, id, role, t, trainee_name, block_num);
            }

            helper_square_dict[trainee_id][rot_count] = newSquare;

            newSquare.draw();
            squares_sprites_list.push(newSquare.sprite);
            newSquare.sprite.on('mousedown', onSquarePressed);
            newSquare.sprite.on('mouseover', onSquareOver);
            newSquare.sprite.on('mouseout', onSquareOut);

            squares_dict[role + "-" + id.toString()].addChild(newSquare.sprite);
            pgy_squares_list.push(newSquare.sprite);
        }
        trainee_count += 1;
    }

    // Underdone graphics
    for (var r of rotations) {
        var new_graphic = new PIXI.Graphics();
        underdone_bars[r.id] = new_graphic;
        underdone_list.push(new_graphic);
        app.stage.addChild(new_graphic);
    }

    // Draw out underdone bars on the right by using PIXI.Graphics
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

    // overdone graphics
    for (var r of rotations) {
        var new_graphic = new PIXI.Graphics();
        overdone_bars[r.id] = new_graphic;
        overdone_list.push(new_graphic);
        app.stage.addChild(new_graphic);
    }

    // Draw out overdone bars on the right by using PIXI.Graphics
    var trainee_count = 0;
    for (var trainee_i = 0; trainee_i < trainees.length; trainee_i++) {
        var t = trainees[trainee_i];
        if (t.role != current_pgy) continue; // Skip the loop if it's not the pgy in need of visualized

        // Push overdone_arr into overdone array
        var overdone_arr = t.get_overdone_array();
        old_overdone_arrs[trainee_count] = overdone_arr;
        new_overdone_arrs[trainee_count] = overdone_arr;
        in_between_overdone_arrs[trainee_count] =
            generate_in_between_arr(old_overdone_arrs[trainee_count],
                new_overdone_arrs[trainee_count],
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
            num_pgy_vis = num_pgy3; break;
    }

    // Add line graphic at the end
    app.stage.addChild(line_graphic);
    line_graphic.clear();

    // Draw underdone bar for the first time
    var underdone_top_left_x = SQUARE_TOP_LEFT[0] + UNIT_RANGE * num_block + UNDERDONE_OFFSET_X;
    var base_x = underdone_top_left_x;
    var base_y = SQUARE_TOP_LEFT[1];
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

    // White lines
    for (var i = 0; i < num_block; i++) {

        // Choose appropriate line color
        if (i % 4 == 0) line_graphic.lineStyle(1, UNDERDONE_LINE_COLOR, UNDERDONE_INTEGER_ALPHA);
        else line_graphic.lineStyle(1, UNDERDONE_LINE_COLOR, UNDERDONE_QUARTER_ALPHA);

        // Draw the line
        var x = base_x + i * UNDERDONE_UNIT_LENGTH + 0.5;
        var y1 = base_y;
        var y2 = base_y + UNIT_RANGE * num_pgy_vis;
        line_graphic.moveTo(x, y1);
        line_graphic.lineTo(x, y2);
    }
    line_graphic.lineStyle(2, UNDERDONE_LINE_COLOR, UNDERDONE_INTEGER_ALPHA);
    line_graphic.moveTo(base_x, base_y);
    line_graphic.lineTo(base_x, base_y + UNIT_RANGE * num_pgy_vis);

    app.stage.removeChild(underdone_label);
    underdone_label = new PIXI.Text('Underdone', {fontSize: UNDERDONE_LABEL_SIZE, fill: UNDERDONE_LABEL_COLOR});
    underdone_label.x = underdone_top_left_x;
    underdone_label.y = UNDERDONE_LABEL_HEIGHT;
    app.stage.addChild(underdone_label);

    // Draw overdone bar for the first time
    var overdone_top_left_x = SQUARE_TOP_LEFT[0] + UNIT_RANGE * num_block + OVERDONE_OFFSET_X + OVERDONE_UNIT_LENGTH * num_block + UNDER_OVER_DISTANCE;
    var base_x = overdone_top_left_x;
    var base_y = SQUARE_TOP_LEFT[1];
    for (var i = 0; i < num_pgy_vis; i++) {
        for (var j = 0; j < num_rotations; j++) {
            var rot_id = id_list[j]
            var color = convert_to_color_code(ROTATIONS_COLOR[rot_id]);
            var graphic = overdone_bars[rot_id];

            // Calculate points
            if (j == 0) {
                var x1 = base_x;
                var y1 = base_y + OVERDONE_UNIT_RANGE * i;
                var x2 = base_x + OVERDONE_UNIT_LENGTH * new_overdone_arrs[i][j];
                var y2 = base_y + OVERDONE_UNIT_RANGE * i + OVERDONE_SIZE;
            } else {
                var x1 = base_x + OVERDONE_UNIT_LENGTH * new_overdone_arrs[i][j - 1];
                var y1 = base_y + OVERDONE_UNIT_RANGE * i;
                var x2 = base_x + OVERDONE_UNIT_LENGTH * new_overdone_arrs[i][j];
                var y2 = base_y + OVERDONE_UNIT_RANGE * i + OVERDONE_SIZE;
            }

            // Draw the rectangle
            draw_rectangle(graphic, color, x1, y1, x2, y2);
        }
    }


    // White lines
    for (var i = 0; i < num_block; i++) {

        // Choose appropriate line color
        if (i % 4 == 0) line_graphic.lineStyle(1, OVERDONE_LINE_COLOR, OVERDONE_INTEGER_ALPHA);
        else line_graphic.lineStyle(1, OVERDONE_LINE_COLOR, OVERDONE_QUARTER_ALPHA);

        // Draw the line
        var x = base_x + i * OVERDONE_UNIT_LENGTH + 0.5;
        var y1 = base_y;
        var y2 = base_y + UNIT_RANGE * num_pgy_vis;
        line_graphic.moveTo(x, y1);
        line_graphic.lineTo(x, y2);
    }
    line_graphic.lineStyle(2, OVERDONE_LINE_COLOR, OVERDONE_INTEGER_ALPHA);
    line_graphic.moveTo(base_x, base_y);
    line_graphic.lineTo(base_x, base_y + UNIT_RANGE * num_pgy_vis);

    app.stage.removeChild(overdone_label);
    overdone_label = new PIXI.Text('Overdone', {fontSize: OVERDONE_LABEL_SIZE, fill: OVERDONE_LABEL_COLOR});
    overdone_label.x = overdone_top_left_x;
    overdone_label.y = OVERDONE_LABEL_HEIGHT;
    app.stage.addChild(overdone_label);

    animation_count += 1;

}

/**
 * Draw out the full popup (displaying all rotations so that user can make modifications) which will appear when the user clicks on a specific block
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
 * Draws a briefer popup (only displays information of current block) when user hovers over a certain block
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
 * Draw the underdone bars on the right
 */
function draw_underdone_and_overdone_bars() {

    var num_pgy_vis;
    switch (current_pgy) {
        case "PGY1":
            num_pgy_vis = num_pgy1; break;
        case "PGY2":
            num_pgy_vis = num_pgy2; break;
        case "PGY3":
            num_pgy_vis = num_pgy3; break;
    }

    // Draw underdone bars
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

    // White lines
    for (var i = 0; i < num_block; i++) {

        // Choose appropriate line color
        if (i % 4 == 0) line_graphic.lineStyle(1, UNDERDONE_LINE_COLOR, UNDERDONE_INTEGER_ALPHA);
        else line_graphic.lineStyle(1, UNDERDONE_LINE_COLOR, UNDERDONE_QUARTER_ALPHA);

        // Draw the line
        var x = base_x + i * UNDERDONE_UNIT_LENGTH + 0.5;
        var y1 = base_y;
        var y2 = base_y + UNIT_RANGE * num_pgy_vis;
        line_graphic.moveTo(x, y1);
        line_graphic.lineTo(x, y2);
    }

    line_graphic.lineStyle(2, UNDERDONE_LINE_COLOR, UNDERDONE_INTEGER_ALPHA);
    line_graphic.moveTo(base_x, base_y);
    line_graphic.lineTo(base_x, base_y + UNIT_RANGE * num_pgy_vis);

    // Draw overdone bars
    var overdone_top_left_x = SQUARE_TOP_LEFT[0] + UNIT_RANGE * num_block + OVERDONE_OFFSET_X + OVERDONE_UNIT_LENGTH * num_block + UNDER_OVER_DISTANCE;
    var base_x = overdone_top_left_x;
    var base_y = SQUARE_TOP_LEFT[1];

    for (var j = 0; j < num_rotations; j++) {
        var rot_id = id_list[j];
        var graphic = overdone_bars[rot_id];
        graphic.clear();
    }

    for (var i = 0; i < num_pgy_vis; i++) {
        for (var j = 0; j < num_rotations; j++) {
            var rot_id = id_list[j]
            var color = convert_to_color_code(ROTATIONS_COLOR[rot_id]);
            var graphic = overdone_bars[rot_id];

            // Calculate points
            if (j == 0) {
                var x1 = base_x;
                var y1 = base_y + OVERDONE_UNIT_RANGE * i;
                var x2 = base_x + OVERDONE_UNIT_LENGTH * in_between_overdone_arrs[i][animation_count][j];
                var y2 = base_y + OVERDONE_UNIT_RANGE * i + OVERDONE_SIZE;
            } else {
                var x1 = base_x + OVERDONE_UNIT_LENGTH * in_between_overdone_arrs[i][animation_count][j - 1];
                var y1 = base_y + OVERDONE_UNIT_RANGE * i;
                var x2 = base_x + OVERDONE_UNIT_LENGTH * in_between_overdone_arrs[i][animation_count][j];
                var y2 = base_y + OVERDONE_UNIT_RANGE * i + OVERDONE_SIZE;
            }

            // Draw the rectangle
            draw_rectangle(graphic, color, x1, y1, x2, y2)
        }
    }


    // White lines
    for (var i = 0; i < num_block; i++) {

        // Choose appropriate line color
        if (i % 4 == 0) line_graphic.lineStyle(1, OVERDONE_LINE_COLOR, OVERDONE_INTEGER_ALPHA);
        else line_graphic.lineStyle(1, OVERDONE_LINE_COLOR, OVERDONE_QUARTER_ALPHA);

        // Draw the line
        var x = base_x + i * OVERDONE_UNIT_LENGTH + 0.5;
        var y1 = base_y;
        var y2 = base_y + UNIT_RANGE * num_pgy_vis;
        line_graphic.moveTo(x, y1);
        line_graphic.lineTo(x, y2);
    }

    line_graphic.lineStyle(2, OVERDONE_LINE_COLOR, OVERDONE_INTEGER_ALPHA);
    line_graphic.moveTo(base_x, base_y);
    line_graphic.lineTo(base_x, base_y + UNIT_RANGE * num_pgy_vis);
}

/**
 * Short function for drawing rectangle
 */
function draw_rectangle(graphic, color, x1, y1, x2, y2) {
    graphic.beginFill(color);
    graphic.moveTo(x1, y1);
    graphic.lineTo(x1, y2);
    graphic.lineTo(x2, y2);
    graphic.lineTo(x2, y1);
    graphic.lineTo(x1, y1);
    graphic.endFill();
}