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

var colorPressed = '';

///////////////////
// OBJECTS CREATION
///////////////////

app = new PIXI.Application();
app.renderer = PIXI.autoDetectRenderer(1920, 1080, {antialias: true});
app.renderer.backgroundColor = 0xffffff;
app.renderer.autoResize = true;
document.body.appendChild(app.view);

// Hold static elements such as labels
static_stuffs = new PIXI.Container();
static_stuffs.interactive = true;
static_stuffs.width = 1080;
static_stuffs.height = 1920;
app.stage.addChild(static_stuffs);

// Hold static elements such as labels
pgy1_container = new PIXI.Container();
pgy1_container.interactive = true;
pgy1_container.width = 1080;
pgy1_container.height = 1920;
app.stage.addChild(pgy1_container);

// Hold static elements such as labels
pgy2_container = new PIXI.Container();
pgy2_container.interactive = true;
pgy2_container.width = 1080;
pgy2_container.height = 1920;
app.stage.addChild(pgy2_container);

// Hold static elements such as labels
pgy3_container = new PIXI.Container();
pgy3_container.interactive = true;
pgy3_container.width = 1080;
pgy3_container.height = 1920;
app.stage.addChild(pgy3_container);

// Popup stuffs
var popup_label1 = new PIXI.Text('Rotation:', {fontStyle: "bold", fontSize: POPUP_LABEL_SIZE});
var popup_label2 = new PIXI.Text('When:', {fontStyle: "bold", fontSize: POPUP_LABEL_SIZE});
var popup_label3 = new PIXI.Text('Duration:', {fontStyle: "bold", fontSize: POPUP_LABEL_SIZE});
var popup_label4 = new PIXI.Text('Trainee', {fontStyle: "bold", fontSize: POPUP_LABEL_SIZE});
var popup_info1 = new PIXI.Text('', {fontSize: LABEL_SIZE});
var popup_info2 = new PIXI.Text('', {fontSize: LABEL_SIZE});
var popup_info3 = new PIXI.Text('', {fontSize: LABEL_SIZE});
var popup_info4 = new PIXI.Text('', {fontSize: LABEL_SIZE});
var popup_click_to_view = new PIXI.Text('Click to change this rotation', {fontStyle: "italic", fill: 0x3D78BD, fontSize: LABEL_SIZE});
popup_label1.visible = false;
popup_label2.visible = false;
popup_label3.visible = false;
popup_label4.visible = false;
popup_info1.visible = false;
popup_info2.visible = false;
popup_info3.visible = false;
popup_info4.visible = false;
popup_click_to_view.visible = false;
var temp_graphic = new PIXI.Graphics();
var temp_line = new PIXI.Graphics();

// Hold all squares graphics
rot_squares_list = [];

// Hold all underdone bars
underdone_list = [];

// All stuffs related to the popup info window

/////////////////////
// INTERACTION HELPER
/////////////////////

function onSquarePressed() {
    var rot_id = this.rot_id;
    var role = this.role;

    if (colorPressed == this.color) {
        resetBlur();
        colorPressed = '';
    } else {
        colorPressed = this.color;
        for (key in squares_dict) squares_dict[key].alpha = SQUARE_BLUR;
    switch (role) {
        case "PGY1":
            for (var square of pgy1_squares_list) square.alpha = 1;
            for (var square of pgy2_squares_list) square.alpha = OTHER_ROLE_BLUR;
            for (var square of pgy3_squares_list) square.alpha = OTHER_ROLE_BLUR;
            pgy1_container.alpha = 1;
            pgy2_container.alpha = OTHER_ROLE_BLUR;
            pgy3_container.alpha = OTHER_ROLE_BLUR;
            break;
        case "PGY2":
            for (var square of pgy1_squares_list) square.alpha = OTHER_ROLE_BLUR;
            for (var square of pgy2_squares_list) square.alpha = 1;
            for (var square of pgy3_squares_list) square.alpha = OTHER_ROLE_BLUR;
            pgy1_container.alpha = OTHER_ROLE_BLUR;
            pgy2_container.alpha = 1;
            pgy3_container.alpha = OTHER_ROLE_BLUR;
            break;
        case "PGY3":
            for (var square of pgy1_squares_list) square.alpha = OTHER_ROLE_BLUR;
            for (var square of pgy2_squares_list) square.alpha = OTHER_ROLE_BLUR;
            for (var square of pgy3_squares_list) square.alpha = 1;
            pgy1_container.alpha = OTHER_ROLE_BLUR;
            pgy2_container.alpha = OTHER_ROLE_BLUR;
            pgy3_container.alpha = 1;
            break;
    }
    squares_dict[rot_id].alpha = 1;

    // Draw out chart bars under the role by using PIXI.Graphics
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

    temp_graphic.clear();
    temp_graphic.beginFill(0xFFFFFF);
    temp_graphic.lineStyle(1, '0xDEDDDD', 1);

    var x1 = this.x + 20;
    var y2 = this.y;
    var x2 = x1 + POPUP_WIDTH;
    var y1 = y2 - POPUP_WEIGHT;

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

    popup_info1.x = start_x + POPUP_INFO_X_OFFSET;
    popup_info1.y = start_y;
    popup_info1.text = this.rot_name;

    popup_info2.x = start_x + POPUP_INFO_X_OFFSET;
    popup_info2.y = start_y + POPUP_LABEL_HEIGHT;

    popup_info3.x = start_x + POPUP_INFO_X_OFFSET;
    popup_info3.y = start_y + POPUP_LABEL_HEIGHT * 2;

    popup_info4.x = start_x + POPUP_INFO_X_OFFSET;
    popup_info4.y = start_y + POPUP_LABEL_HEIGHT * 3;
    popup_info4.text = this.trainee_name;

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

function onButtonOut() {
    popup_label1.visible = false;
    popup_label2.visible = false;
    popup_label3.visible = false;
    popup_label4.visible = false;
    popup_info1.visible = false;
    popup_info2.visible = false;
    popup_info3.visible = false;
    popup_info4.visible = false;
    popup_click_to_view.visible = false;

    app.stage.removeChild(temp_line);
    app.stage.removeChild(temp_graphic);
    app.stage.removeChild(popup_label1);
    app.stage.removeChild(popup_label2);
    app.stage.removeChild(popup_label3);
    app.stage.removeChild(popup_label4);
    app.stage.removeChild(popup_info1);
    app.stage.removeChild(popup_info2);
    app.stage.removeChild(popup_info3);
    app.stage.removeChild(popup_info4);
    app.stage.removeChild(popup_click_to_view);
}

function resetBlur() {
    for (key in squares_dict) squares_dict[key].alpha = 1;
    pgy1_container.alpha = 1;
    pgy2_container.alpha = 1;
    pgy3_container.alpha = 1;
    app.stage.removeChild(chart_bars);
}


var isShown = false;
var isScheduled = false;
/**
 * When schedule button is clicked
 */
$('#schedule_btn').click(function onSchedulePressed() {
        if (!isScheduled) {

            $.ajax({
            type: "POST",
            url: "/requestToSchedule",
            data: JSON.stringify({title: FAKE_TEXT}),
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
                    schedule = new Schedule(trainees, rotations, num_block);

                    // Clear out all containers
                    squares_dict = {};
                    underdone_bars = {};

                    // Clear out all list
                    pgy1_squares_list = [];
                    pgy2_squares_list = [];
                    pgy3_squares_list = [];

                    // Clean pgy label stuffs
                    app.stage.removeChild(pgy1_container);
                    pgy1_container = new PIXI.Container();
                    pgy1_container.interactive = true;
                    pgy1_container.width = 1080;
                    pgy1_container.height = 1920;
                    app.stage.addChild(pgy1_container);

                    app.stage.removeChild(pgy2_container);
                    pgy2_container = new PIXI.Container();
                    pgy2_container.interactive = true;
                    pgy2_container.width = 1080;
                    pgy2_container.height = 1920;
                    app.stage.addChild(pgy2_container);

                    app.stage.removeChild(pgy3_container);
                    pgy3_container = new PIXI.Container();
                    pgy3_container.interactive = true;
                    pgy3_container.width = 1080;
                    pgy3_container.height = 1920;
                    app.stage.addChild(pgy3_container);

                    // Clean all squares
                    app.stage.removeChild(rot_squares_list);
                    rot_squares_list = [];

                    // Clean all underdone container
                    app.stage.removeChild(underdone_list);
                    underdone_list = [];

                    // Clean all chart list
                    app.stage.removeChild(chart_bars);
                    chart_bars = new PIXI.Graphics();
                    app.stage.addChild(chart_bars);

                    var start_x = SQUARE_TOP_LEFT[0];
                    var start_y = LABEL_ROLE_TOP_LEFT_Y + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST;

                    var trainee_count = 0;

                    num_trainees = num_pgy1 + num_pgy2 + num_pgy3;

                    // Create labels for role groups
                    // PGY1
                    var pgy1_label = new PIXI.Text("PGY1", {
                        fontSize: LABEL_ROLE_SIZE
                    });
                    pgy1_label.position.set(LABEL_ROLE_TOP_LEFT_X, LABEL_ROLE_TOP_LEFT_Y);
                    pgy1_top_left_y = LABEL_ROLE_TOP_LEFT_Y + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST;
                    pgy1_container.addChild(pgy1_label);

                    // PGY2
                    var pgy2_label = new PIXI.Text("PGY2", {
                        fontSize: LABEL_ROLE_SIZE
                    });

                    pgy2_label.position.set(LABEL_ROLE_TOP_LEFT_X, pgy1_top_left_y + num_pgy1 * LABEL_HEIGHT + GROUP_DISTANCE);
                    pgy2_top_left_y = pgy1_top_left_y + num_pgy1 * LABEL_HEIGHT + GROUP_DISTANCE + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST;
                    pgy2_container.addChild(pgy2_label);

                    // PGY3
                    var pgy3_label = new PIXI.Text("PGY3", {
                        fontSize: LABEL_ROLE_SIZE
                    });
                    pgy3_label.position.set(LABEL_ROLE_TOP_LEFT_X, pgy2_top_left_y + num_pgy2 * LABEL_HEIGHT + GROUP_DISTANCE);
                    pgy3_top_left_y = pgy2_top_left_y + num_pgy2 * LABEL_HEIGHT + GROUP_DISTANCE + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST;
                    pgy3_container.addChild(pgy3_label);

                    // Draw block number labels
                    var blockNumberLabelPositions = new Array(13);
                    blockNumberLabelPositions[0] = SQUARE_TOP_LEFT[0] + SQUARE_SIZE * 4 / 2;
                    for (var i = 1; i < (num_block + 1) / 4; i++) {
                        if (i < 10) {
                            blockNumberLabelPositions[i] = blockNumberLabelPositions[i - 1] + SQUARE_SIZE * 4 / 2 + SQUARE_SIZE * 4 / 2 + SQUARE_DISTANCE + (LABEL_SIZE - 1) / 2;
                        } else {
                            blockNumberLabelPositions[i] = blockNumberLabelPositions[i - 1] + SQUARE_SIZE * 4 / 2 + SQUARE_SIZE * 4 / 2 + SQUARE_DISTANCE + (LABEL_SIZE - 2) / 2;
                        }
                        var blockNumberLabel = new PIXI.Text(i, {fontSize: LABEL_SIZE});
                        blockNumberLabel.position.set(blockNumberLabelPositions[i - 1], SQUARE_TOP_LEFT[1] - SQUARE_DISTANCE);
                        app.stage.addChild(blockNumberLabel);
                    }

                    console.log(blockNumberLabelPositions);

                    var pgy1_count = 0;
                    var pgy2_count = 0;
                    var pgy3_count = 0;
                    // Create labels for all the trainees
                    for (var t of trainees) {
                        var trainee_label = new PIXI.Text(t.name, {
                            fontSize: LABEL_SIZE
                        });
                        var start_name_label_y = 0;
                        switch (t.role) {
                            case "PGY1":
                                start_name_label_y = pgy1_top_left_y;
                                pgy1_count += 1;
                                trainee_count = pgy1_count;
                                trainee_label.position.set(LABEL_TOP_LEFT_X, start_name_label_y + trainee_count * LABEL_HEIGHT);
                                pgy1_container.addChild(trainee_label);
                                break;
                            case "PGY2":
                                start_name_label_y = pgy2_top_left_y;
                                pgy2_count += 1;
                                trainee_count = pgy2_count;
                                trainee_label.position.set(LABEL_TOP_LEFT_X, start_name_label_y + trainee_count * LABEL_HEIGHT);
                                pgy2_container.addChild(trainee_label);
                                break;
                            case "PGY3":
                                start_name_label_y = pgy3_top_left_y;
                                pgy3_count += 1;
                                trainee_count = pgy3_count;
                                trainee_label.position.set(LABEL_TOP_LEFT_X, start_name_label_y + trainee_count * LABEL_HEIGHT);
                                pgy3_container.addChild(trainee_label);
                                break;
                        }
                    }

                    trainee_count = 0;

                    // Drawing the static_stuffs
                    pgy1_count = 0;
                    pgy2_count = 0;
                    pgy3_count = 0;

                    // Dictionaries of the containers
                    for (var i = 0; i < rotations.length; i++) {
                        var new_container = new PIXI.Container();
                        new_container.interactive = true;
                        new_container.width = 1080;
                        new_container.height = 1920;
                        squares_dict[rotations[i].id] = new_container;
                        rot_squares_list.push(new_container);
                        app.stage.addChild(new_container);
                    }

                    // Add containers for empty and vacation
                    var empty_container = new PIXI.Container();
                    empty_container.interactive = true;
                    empty_container.width = 1080;
                    empty_container.height = 1920;
                    squares_dict[-1] = empty_container;

                    var vac_container = new PIXI.Container();
                    vac_container.interactive = true;
                    vac_container.width = 1080;
                    vac_container.height = 1920;
                    squares_dict[-2] = empty_container;

                    // Draw out squares

                    for (var t of trainees) {
                        var color;
                        var role = t.role;

                        var start_name_label_y = 0;
                        switch (role) {
                            case "PGY1":
                                start_name_label_y = pgy1_top_left_y;
                                pgy1_count += 1;
                                trainee_count = pgy1_count;
                                break;
                            case "PGY2":
                                start_name_label_y = pgy2_top_left_y;
                                pgy2_count += 1;
                                trainee_count = pgy2_count;
                                break;
                            case "PGY3":
                                start_name_label_y = pgy3_top_left_y;
                                pgy3_count += 1;
                                trainee_count = pgy3_count;
                                break;
                        }

                        for (var rot_count = 0; rot_count < num_block; rot_count++) {
                            var id = t.scheduled_blocks[rot_count];

                            t.base_reqs[id] -= 1;

                            color = convert_to_color_code(ROTATIONS_COLOR[id]);

                            var x = start_x + rot_count * UNIT_RANGE + Math.floor(rot_count / 4) * BLOCK_DISTANCE;
                            var y = start_name_label_y + trainee_count * LABEL_HEIGHT;

                            var rot = rotations_dict[id];
                            var rot_name = '';
                            var trainee_name = t.name;
                            var block_num = rot_count;

                            if (rot) {
                                rot_name = rot.name;
                            }

                            var newSquare;
                            if ((rot_count % 4 != 3) && (t.scheduled_blocks[rot_count] == t.scheduled_blocks[rot_count + 1])) {
                                newSquare = new LongSquare(x, y, color, app.renderer, rot_name, id, role, trainee_name, block_num);
                            } else {
                                newSquare = new Square(x, y, color, app.renderer, rot_name, id, role, trainee_name, block_num);
                            }
                            newSquare.draw();

                            newSquare.sprite
                                .on('mousedown', onSquarePressed);
                            newSquare.sprite.on('mouseover',onButtonOver);
                            newSquare.sprite.on('mouseout', onButtonOut);

                            squares_dict[id.toString()].addChild(newSquare.sprite);

                            switch (role) {
                                case "PGY1":
                                    pgy1_squares_list.push(newSquare.sprite);
                                    break;
                                case "PGY2":
                                    pgy2_squares_list.push(newSquare.sprite);
                                    break;
                                case "PGY3":
                                    pgy3_squares_list.push(newSquare.sprite);
                                    break;
                            }
                        }
                    }

                    // Draw out underdone bars on the right by using PIXI.Graphics
                    pgy1_count = 0;
                    pgy2_count = 0;
                    pgy3_count = 0;
                    var underdone_top_left_x = 300 + UNIT_RANGE * num_block + 40;
                    var base_x = underdone_top_left_x;

                    for (var r of rotations) {
                        var new_graphic = new PIXI.Graphics();
                        underdone_bars[r.id] = new_graphic;
                        underdone_list.push(new_graphic);
                        app.stage.addChild(new_graphic);
                    }                    ;

                    var base_x = underdone_top_left_x;
                    var base_y;
                    for (var trainee_i = 0; trainee_i < trainees.length; trainee_i++) {
                        var t = trainees[trainee_i];
                        var underdone_arr = t.get_underdone_array();
                        console.log(underdone_arr);

                        switch (t.role) {
                            case "PGY1":
                                base_y = pgy1_top_left_y;
                                pgy1_count += 1;
                                trainee_count = pgy1_count;
                                break;
                            case "PGY2":
                                base_y = pgy2_top_left_y;
                                pgy2_count += 1;
                                trainee_count = pgy2_count;
                                break;
                            case "PGY3":
                                base_y = pgy3_top_left_y;
                                pgy3_count += 1;
                                trainee_count = pgy3_count;
                                break;
                        }

                        for (var j = 0; j < id_list.length; j++) {
                            var rot_id = id_list[j]
                            var color = convert_to_color_code(ROTATIONS_COLOR[rot_id]);
                            var graphic = underdone_bars[rot_id];

                            console.log(trainee_count);
                            // Calculate points
                            if (j == 0) {
                                var x1 = base_x;
                                var y1 = base_y + UNDERDONE_UNIT_RANGE * trainee_count;
                                var x2 = base_x + UNDERDONE_UNIT_LENGTH * underdone_arr[j];
                                var y2 = base_y + UNDERDONE_UNIT_RANGE * trainee_count + UNDERDONE_SIZE;
                            } else {
                                var x1 = base_x + UNDERDONE_UNIT_LENGTH * underdone_arr[j - 1];
                                var y1 = base_y + UNDERDONE_UNIT_RANGE * trainee_count;
                                var x2 = base_x + UNDERDONE_UNIT_LENGTH * underdone_arr[j];
                                var y2 = base_y + UNDERDONE_UNIT_RANGE * trainee_count + UNDERDONE_SIZE;
                            }

                            // Draw the rectangle
                            graphic.beginFill(color);
                            graphic.moveTo(x1, y1);
                            graphic.lineTo(x1, y2);
                            graphic.lineTo(x2, y2);
                            graphic.lineTo(x2, y1);
                            graphic.lineTo(x1, y1);
                            graphic.endFill();

                        }
                    }
                }    }
        }); }
        else {alert('Scheduled');}
});

