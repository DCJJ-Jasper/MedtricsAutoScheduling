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
var rotations = [];
var rotations_dict = {};
var id_list = [];

var schedule;

// GRAPHIC VARIABLES

var pgy1_top_left_y;
var pgy2_top_left_y;
var pgy3_top_left_y;

var app_width = 1920;
var app_height;

// GRAPHIC OBJECT VARIABLES

var app;
var static_stuffs;
var pgy1_container;
var pgy2_container;
var pgy3_container;

var rot_squares_list;
var pgy1_squares_list;
var pgy2_squares_list;
var pgy3_squares_list;
var underdone_list;
var chart_bars;

var squares_dict = {};
var underdone_bars = {};

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

// GRAPHIC CONTROL VARIABLES
var square_selected = false;
var id_pressed = -3;
var role_pressed = "";

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
    pgy1_container = new PIXI.Container();
    pgy1_container.interactive = true;
    pgy1_container.width = width;
    pgy1_container.height = height;
    app.stage.addChild(pgy1_container);

    // Hold static elements such as labels
    pgy2_container = new PIXI.Container();
    pgy2_container.interactive = true;
    pgy2_container.width = width;
    pgy2_container.height = height;
    app.stage.addChild(pgy2_container);

    // Hold static elements such as labels
    pgy3_container = new PIXI.Container();
    pgy3_container.interactive = true;
    pgy3_container.width = width;
    pgy3_container.height = height;
    app.stage.addChild(pgy3_container);

    // Popup stuffs
    popup_label1 = new PIXI.Text('Rotation:', {fontStyle: "bold", fontSize: POPUP_LABEL_SIZE});
    popup_label2 = new PIXI.Text('When:', {fontStyle: "bold", fontSize: POPUP_LABEL_SIZE});
    popup_label3 = new PIXI.Text('Duration:', {fontStyle: "bold", fontSize: POPUP_LABEL_SIZE});
    popup_label4 = new PIXI.Text('Trainee', {fontStyle: "bold", fontSize: POPUP_LABEL_SIZE});
    popup_info1 = new PIXI.Text('', {fontSize: LABEL_SIZE});
    popup_info2 = new PIXI.Text('', {fontSize: LABEL_SIZE});
    popup_info3 = new PIXI.Text('', {fontSize: LABEL_SIZE});
    popup_info4 = new PIXI.Text('', {fontSize: LABEL_SIZE});
    popup_click_to_view = new PIXI.Text('Click to change this rotation', {fontStyle: "italic", fill: 0x3D78BD, fontSize: LABEL_SIZE});
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
        sprite.on('mouseover',onPopupOver);
        sprite.on('mouseout', onPopupOut);
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

    // Hold all squares graphics
    rot_squares_list = [];

    // Hold all underdone bars
    underdone_list = [];
}

/////////////////////
// INTERACTION HELPER
/////////////////////

function onSquarePressed() {
    var rot_id = this.rot_id;
    var role = this.role;

    if ((id_pressed == rot_id) & (role_pressed == role)) {
        resetBlur();
        id_pressed = -3;
        role_pressed = "";
        square_selected = false;

        // Draw popup;
        remove_popup();
        draw_partial_popup(x1, y1, this.trainee_name, this.rot_name);

    } else {
        id_pressed = rot_id;
        role_pressed = role;
        square_selected = true;
        for (key in squares_dict) squares_dict[key].alpha = OTHER_ROLE_BLUR;
        for (var id of id_list) squares_dict[role + "-" + id.toString()].alpha = SQUARE_BLUR;

        squares_dict[role + "-" + rot_id].alpha = 1;

        // Draw out chart bars under the role by using PIXI.Graphics
        // TODO: Fail so far
        var base_x = 300;
        var base_y;
        var chart_pgy1_top_left_y = pgy1_top_left_y + num_pgy1 * LABEL_HEIGHT + CHART_DISTANCE;
        var chart_pgy2_top_left_y = pgy2_top_left_y + num_pgy2 * LABEL_HEIGHT + CHART_DISTANCE;
        var chart_pgy3_top_left_y = pgy3_top_left_y + num_pgy3 * LABEL_HEIGHT + CHART_DISTANCE;

        var color = convert_to_color_code(ROTATIONS_COLOR[rot_id]);
        var info_arr = schedule.get_block_info_role_id(role, rot_id);

        switch (role) {
            case "PGY1":
                base_y = chart_pgy1_top_left_y;
                break;
            case "PGY2":
                base_y = chart_pgy2_top_left_y;
                break;
            case "PGY3":
                base_y = chart_pgy3_top_left_y;
                break;
        }
        chart_bars.clear();
        chart_bars.beginFill(color);

        for (var i = 0; i < num_block; i++) {
            var x1 = base_x + i * CHART_RANGE;
            var y1 = base_y;
            var x2 = base_x + i * CHART_RANGE + CHART_SIZE;
            var y2 = base_y + info_arr[i] * CHART_UNIT;
            chart_bars.moveTo(x1, y1);
            chart_bars.lineTo(x1, y2);
            chart_bars.lineTo(x2, y2);
            chart_bars.lineTo(x2, y1);
            chart_bars.lineTo(x1, y1);
        }
        chart_bars.endFill();
        app.stage.addChild(chart_bars);

        var x1 = this.x + 20;
        var y1 = this.y - POPUP_WEIGHT;

        // Draw popup;
        draw_full_popup(x1, y1, this.trainee_name, this.rot_name);
    }
}

function onButtonOver() {

    temp_line.clear();
    temp_line.lineStyle(1, 0x000000, 1);
    temp_line.moveTo(LABEL_ROLE_TOP_LEFT_X - DISTANCE, this.y - SQUARE_DISTANCE / 2);
    temp_line.lineTo(LABEL_ROLE_TOP_LEFT_X - DISTANCE + num_block * (SQUARE_SIZE + SQUARE_DISTANCE) + DISTANCE + (SQUARE_TOP_LEFT[0] - LABEL_TOP_LEFT_X), this.y - SQUARE_DISTANCE / 2);
    temp_line.lineTo(LABEL_ROLE_TOP_LEFT_X - DISTANCE + num_block * (SQUARE_SIZE + SQUARE_DISTANCE) + DISTANCE + (SQUARE_TOP_LEFT[0] - LABEL_TOP_LEFT_X), this.y + SQUARE_SIZE + SQUARE_DISTANCE / 2);
    temp_line.lineTo(LABEL_ROLE_TOP_LEFT_X - DISTANCE, this.y + SQUARE_SIZE + SQUARE_DISTANCE / 2);
    temp_line.lineTo(LABEL_ROLE_TOP_LEFT_X - DISTANCE, this.y - SQUARE_DISTANCE / 2);

    if (square_selected == false) {

        var x1 = this.x + 20;
        var y1 = this.y - POPUP_WEIGHT;

        draw_partial_popup(x1, y1, this.trainee_name, this.rot_name);;
    }
}

function onButtonOut() {
    if (square_selected == false) {
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
    }
}

function onPopupOver() {
    console.log("SHIT");

    this.alpha = 1;
    // temp_popup.clear();
    //
    // temp_popup.beginFill(convert_to_color_code(POPUP_FILLED));
    // var x1 = this.x;
    // var y1 = this.y;
    // var x2 = this.x + POPUP_WIDTH - POPUP_PADDING * 2
    // var y2 = this.y + POPUP_LABEL_HEIGHT - 2;
    //
    // temp_popup.moveTo(x1, y1);
    // temp_popup.lineTo(x2, y1);
    // temp_popup.lineTo(x2, y2);
    // temp_popup.lineTo(x1, y2);
    // temp_popup.lineTo(x1, y1);
    // temp_popup.endFill();
}

function onPopupOut() {
    this.alpha = 0;
}

function resetBlur() {
    for (key in squares_dict) squares_dict[key].alpha = 1;
    app.stage.removeChild(chart_bars);
}

var isShown = false;
var isScheduled = false;

/**
 * When schedule button is clicked
 */
$('#save_btn').click(function onSavePressed() {
    download(schedule.get_schedule_info_csv(), "schedule.csv", "text/plain")
});

/**
 * When schedule button is clicked
 */
$('#greedy_schedule_btn').click(function onGreedySchedulePressed() {
        if (!isScheduled) {
            $.ajax({
            type: "POST",
            url: "/requestToSchedule",
            data: JSON.stringify({title: PROBLEM_TEXT, method: "greedy"}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (!isShown) {
                    isShown = true;
                    isScheduled = true;
                    alert('Scheduling');
                    // Read in the data
                    var sample_text = data['data'];

                    read_in_data(sample_text);
                    reset_app();
                    visualize_data();
                }
            }
        });}
        else {alert('Scheduled');}
});

/**
 * When schedule button is clicked
 */
$('#solver_schedule_btn').click(function onGreedySchedulePressed() {
        if (!isScheduled) {
            $.ajax({
            type: "POST",
            url: "/requestToSchedule",
            data: JSON.stringify({title: PROBLEM_TEXT, method: "solver"}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (!isShown) {
                    isShown = true;
                    isScheduled = true;
                    alert('Scheduling');
                    // Read in the data
                    var sample_text = data['data'];

                    read_in_data(sample_text);
                    reset_app();
                    visualize_data();
                }
            }
        });}
        else {alert('Scheduled');}
});


$(document).ready(function () {
    read_in_data_from_medtrics(PROBLEM_TEXT);
    app_height = LABEL_ROLE_TOP_LEFT_Y + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST +
        num_pgy1 * LABEL_HEIGHT + GROUP_DISTANCE + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST +
        num_pgy2 * LABEL_HEIGHT + GROUP_DISTANCE + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST +
        num_pgy3 * LABEL_HEIGHT + GROUP_DISTANCE + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST;
    create_objects(app_width, app_height);
    visualize_data();
});

