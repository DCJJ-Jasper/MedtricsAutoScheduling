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

var trainees = [];
var rotations = [];
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

var schedule_button;

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

// Hold all squares graphics
rot_squares_list = [];

// Hold all underdone bars
underdone_list = [];

// Schedule button
schedule_button = new PIXI.Container();
var temp_graphic = new PIXI.Graphics();
temp_graphic.beginFill(BUTTON_COLOR);

var x1 = BUTTON_TOP_LEFT_X;
var y1 = BUTTON_TOP_LEFT_Y;
var x2 = BUTTON_TOP_LEFT_X + BUTTON_WIDTH;
var y2 = BUTTON_TOP_LEFT_Y + BUTTON_HEIGHT;

temp_graphic.moveTo(x1, y1);
temp_graphic.lineTo(x1, y2);
temp_graphic.lineTo(x2, y2);
temp_graphic.lineTo(x2, y1);
temp_graphic.lineTo(x1, y1);
temp_graphic.endFill();

schedule_button.addChild(temp_graphic);

var button_title = new PIXI.Text("Schedule", {
    fontSize: BUTTON_TEXT_SIZE,
});
button_title.x = BUTTON_TOP_LEFT_X + BUTTON_PADDING;
button_title.y = BUTTON_TOP_LEFT_Y + BUTTON_PADDING;
button_title.style.fill = "0xFFFFFF";

schedule_button.addChild(button_title);
app.stage.addChild(schedule_button);

// schedule_button.on('mousedown', onSchedulePressed);

/**
 * Call pushTrainees in the python server, which sends a bunch of text for processing
 * and visualizations.
 */
$.getJSON('/pushTrainees', function (data) {
    // Read in the data
    var sample_text = data['sample_text'];
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

    var msg = new PIXI.Text('Rotation id');
    msg.visible = false;
    // msg.position.set(num_block * (SQUARE_SIZE + SQUARE_DISTANCE), start_y);

    // create an array to store all the sprites
    var maggots = [];
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

        var rot_count = 0;
        for (var j = 0; j < num_block; j++) {
            var id = t.scheduled_blocks[j];

            t.base_reqs[id] -= 1;

            color = convert_to_color_code(ROTATIONS_COLOR[id]);

            var x = start_x + rot_count * UNIT_RANGE;
            var y = start_name_label_y + trainee_count * UNIT_RANGE;

            var newSquare = new Square(x, y, color, '', id, role, app.renderer);
            newSquare.draw();

            newSquare.sprite
                .on('mousedown', onSquarePressed);

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

            rot_count += 1;
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
    };

    var base_x = underdone_top_left_x;
    var base_y;
    for (var trainee_i = 0; trainee_i < trainees.length; trainee_i++) {
        var t = trainees[trainee_i];
        var underdone_arr = t.get_underdone_array();
        console.log(underdone_arr)

        switch (t.role) {
            case "PGY1": base_y = pgy1_top_left_y; pgy1_count += 1; trainee_count = pgy1_count; break;
            case "PGY2": base_y = pgy2_top_left_y; pgy2_count += 1; trainee_count = pgy2_count; break;
            case "PGY3": base_y = pgy3_top_left_y; pgy3_count += 1; trainee_count = pgy3_count; break;
        }

        for (var j = 0; j < id_list.length; j++) {
            var rot_id = id_list[j]
            var color = convert_to_color_code(ROTATIONS_COLOR[rot_id]);
            var graphic = underdone_bars[rot_id];

            console.log(trainee_count)
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
});

// $.getJSON('/requestToSchedule', function (data) {
//     console.log(data)
// });

/////////////////////
// INTERACTION HELPER
/////////////////////

function onSquarePressed() {
    this.isOver = true;
    //this.visible = false;
    var rot_id = this.rot_id;
    var role = this.role;
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
    squares_dict[rot_id].alpha = 1

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
    
}

function onButtonOut() {
    this.isOver = false;
    this.visible = true;
}


/**
 * All animation lives here
 */
function animate() {

}

$('#test_btn').click(function onSchedulePressed() {
        $.ajax({
            type: "POST",
            url: "/requestToSchedule",
            data: JSON.stringify({title: 'hello'}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                alert('JSON sent');
            }
        })
});