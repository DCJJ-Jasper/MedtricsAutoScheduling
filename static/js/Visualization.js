/**
 * Created by AC on 2/9/17.
 */

// Initialize some important schedule variables
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
var num_groups = 3;
var id_list = [];


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

    for (var i = 0; i < num_pgy1; i++) {
        line_num += 1;
        data = str_list[line_num].trim().split(",");
        console.log(data);
        console.log(data[3]);
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

    for (var i = 0; i < num_pgy2; i++) {
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

    for (var i = 0; i < num_pgy3; i++) {
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
}

read_in_data(SAMPLE_TEXT);
console.log(trainees);
console.log(rotations);

var start_x = SQUARE_TOP_LEFT[0];
var start_y = LABEL_ROLE_TOP_LEFT_Y + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST;

var app = new PIXI.Application();
app.renderer = PIXI.autoDetectRenderer(1920, 1080, {antialias: true});
app.renderer.backgroundColor = 0xffffff;
app.renderer.autoResize = true;
document.body.appendChild(app.view);

var stuffs = new PIXI.Container();
stuffs.interactive = true;
stuffs.width = 1080;
stuffs.height = 1920;

var msg = new PIXI.Text('Rotation id');
msg.visible = false;
// msg.position.set(num_block * (SQUARE_SIZE + SQUARE_DISTANCE), start_y);
app.stage.addChild(stuffs);

// create an array to store all the sprites
var maggots = [];
var trainee_count = 0;

num_pgy1 = 0;
num_pgy2 = 0;
num_pgy3 = 0;
for (var t of trainees) {
    switch (t.role) {
        case "PGY1": num_pgy1 += 1; break;
        case "PGY2": num_pgy2 += 1; break;
        case "PGY3": num_pgy3 += 1; break;
    }
}

num_trainees = num_pgy1 + num_pgy2 + num_pgy3;

// Create labels for role groups
// PGY1
var pgy1_label = new PIXI.Text("PGY1", {
    fontSize: LABEL_ROLE_SIZE
});
pgy1_label.position.set(LABEL_ROLE_TOP_LEFT_X, LABEL_ROLE_TOP_LEFT_Y);
var pgy1_top_left_y = LABEL_ROLE_TOP_LEFT_Y + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST;
stuffs.addChild(pgy1_label);

// PGY2
var pgy2_label = new PIXI.Text("PGY2", {
    fontSize: LABEL_ROLE_SIZE
});

pgy2_label.position.set(LABEL_ROLE_TOP_LEFT_X, pgy1_top_left_y + num_pgy1 * LABEL_HEIGHT + GROUP_DISTANCE);
var pgy2_top_left_y = pgy1_top_left_y + num_pgy1 * LABEL_HEIGHT + GROUP_DISTANCE + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST;

stuffs.addChild(pgy2_label);

// PGY3
var pgy3_label = new PIXI.Text("PGY3", {
    fontSize: LABEL_ROLE_SIZE
});
pgy3_label.position.set(LABEL_ROLE_TOP_LEFT_X, pgy2_top_left_y + num_pgy2 * LABEL_HEIGHT + GROUP_DISTANCE);
var pgy3_top_left_y = pgy2_top_left_y + num_pgy2 * LABEL_HEIGHT + GROUP_DISTANCE + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST;
stuffs.addChild(pgy3_label);

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
        case "PGY1": start_name_label_y = pgy1_top_left_y; pgy1_count += 1; trainee_count = pgy1_count; break;
        case "PGY2": start_name_label_y = pgy2_top_left_y; pgy2_count += 1; trainee_count = pgy2_count; break;
        case "PGY3": start_name_label_y = pgy3_top_left_y; pgy3_count += 1; trainee_count = pgy3_count; break;
    }
    trainee_label.position.set(LABEL_TOP_LEFT_X, start_name_label_y + trainee_count * LABEL_HEIGHT);
    stuffs.addChild(trainee_label);
}
trainee_count = 0;

// Drawing the stuffs
pgy1_count = 0;
pgy2_count = 0;
pgy3_count = 0;

// Dictionaries or the containers

squares_dict = {}
for (var i = 0; i < rotations.length; i++) {
    var new_container = new PIXI.Container();
    new_container.interactive = true;
    new_container.width = 1080;
    new_container.height = 1920;
    squares_dict[rotations[i].id] = new_container;
    app.stage.addChild(new_container);
}

// Add containers for empty and vacation
var empty_container = new PIXI.Container();
empty_container.interactive = true;
empty_container.width = 1080;
empty_container.height = 1920;
squares_dict[-1] = empty_container

var vac_container = new PIXI.Container();
vac_container.interactive = true;
vac_container.width = 1080;
vac_container.height = 1920;
squares_dict[-2] = empty_container

// Draw out squares

for (var t of trainees) {
    var rot_count = 0;
    var color;

    var start_name_label_y = 0;
    switch (t.role) {
        case "PGY1": start_name_label_y = pgy1_top_left_y; pgy1_count += 1; trainee_count = pgy1_count; break;
        case "PGY2": start_name_label_y = pgy2_top_left_y; pgy2_count += 1; trainee_count = pgy2_count; break;
        case "PGY3": start_name_label_y = pgy3_top_left_y; pgy3_count += 1; trainee_count = pgy3_count; break;
    }

    for (var j = 0; j < num_block; j++) {
        id = t.scheduled_blocks[j];

        t.base_reqs[id] -= 1;

        color = convert_to_color_code(ROTATIONS_COLOR[id]);

        var x = start_x + rot_count * UNIT_RANGE;
        var y = start_name_label_y + trainee_count * UNIT_RANGE;

        var newSquare = new Square(x, y, color, '', id, app.renderer);
        newSquare.draw();

        newSquare.sprite
            .on('mousedown', onSquarePressed);

        console.log(squares_dict, id, squares_dict[id])
        squares_dict[id.toString()].addChild(newSquare.sprite);
        rot_count += 1;
    }
}

// Draw out underdone bars on the right by using PIXI.Graphics
var underdone_bars = {};
var underdone_top_left = [300 + UNIT_RANGE * num_block + 20, 40 + LABEL_ROLE_HEIGHT * 2 + ROLE_LABEL_TRAINEE_DIST];

for (var r of rotations) {
    var new_graphic =  new PIXI.Graphics();
    underdone_bars[r.id] = new_graphic;
    app.stage.addChild(new_graphic);
};

var base_x = underdone_top_left[0];
var base_y = underdone_top_left[1];
for (var trainee_i = 0; trainee_i < trainees.length; trainee_i++) {
    var t = trainees[trainee_i];
    var underdone_arr = t.get_underdone_array();

    for (var j = 0; j < id_list.length; j++) {
        var rot_id = id_list[j]
        var color = convert_to_color_code(ROTATIONS_COLOR[rot_id]);
        var graphic = underdone_bars[rot_id];

        // Calculate points
        if (j == 0) {
            var x1 = base_x;
            var y1 = base_y + UNDERDONE_UNIT_RANGE * trainee_i;
            var x2 = base_x + UNDERDONE_UNIT_LENGTH * underdone_arr[j];
            var y2 = base_y + UNDERDONE_UNIT_RANGE * trainee_i + UNDERDONE_SIZE;
        } else {
            var x1 = base_x + UNDERDONE_UNIT_LENGTH * underdone_arr[j - 1];
            var y1 = base_y + UNDERDONE_UNIT_RANGE * trainee_i;
            var x2 = base_x + UNDERDONE_UNIT_LENGTH * underdone_arr[j];
            var y2 = base_y + UNDERDONE_UNIT_RANGE * trainee_i + UNDERDONE_SIZE;
        }

        console.log(x1, y1, x2, y2);
        // Draw the rectangle
        graphic.beginFill(color);
        graphic.moveTo(x1, y1);
        graphic.lineTo(x1, y2);
        graphic.lineTo(x2, y2);
        graphic.lineTo(x2, y1);
        graphic.lineTo(x1, y1);
        graphic.endFill();
    }
};

function onSquarePressed() {
    this.isOver = true;
    //this.visible = false;
    rot_id = this.rot_id;
    for (key in squares_dict) squares_dict[key].alpha = SQUARE_BLUR;
    squares_dict[rot_id].alpha = 1
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

