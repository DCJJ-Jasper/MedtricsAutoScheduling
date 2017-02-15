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
        console.log(data)
        console.log(data[3])
        // Parse the data
        name = data[0];
        id = parseInt(data[1]);
        role = data[2];
        schedule = data[3].split(".");

        // Create a new trainee based on these information
        new_trainee = new Trainee(name, role, id, num_block);
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
        new_trainee = new Trainee(name, role, id, num_block);
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
        new_trainee = new Trainee(name, role, id, num_block);
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
        line_num += 1
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
    }

    // Skip 2 lines
    line_num += 2

    // Read in requirements for each type of students
    var amount = 0
    for (var i = 0; i < num_rotations; i++) {
        line_num += 1
        data = str_list[line_num].trim().split(",");

        // Parse the data
        id = parseInt(data[0], 10);
        amount = parseInt(data[2], 10);

        // Input the requirement for pgy1
        pgy1_reqs[id] = amount
    }

    for (var i = 0; i < num_rotations; i++) {
        line_num += 1
        data = str_list[line_num].trim().split(",");

        // Parse the data
        id = parseInt(data[0], 10);
        amount = parseInt(data[2], 10);

        // Input the requirement for pgy1
        pgy2_reqs[id] = amount
    }

    for (var i = 0; i < num_rotations; i++) {
        line_num += 1
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
var start_y = SQUARE_TOP_LEFT[1];

var app = new PIXI.Application();
app.renderer.backgroundColor = 0xffffff;
app.renderer.autoResize = true;
document.body.appendChild(app.view);

var squares = new PIXI.Container();
squares.interactive = true;

var msg = new PIXI.Text('Rotation id');
msg.visible = false;
// msg.position.set(num_block * (SQUARE_SIZE + SQUARE_DISTANCE), start_y);
app.stage.addChild(squares);

// create an array to store all the sprites
var maggots = [];
var trainee_count = 0;

// Create fake trainees
for (var k = 0; k < NUM_TRAINEE; k ++) {
    var new_trainee = new Trainee(chance.name(), "PGY1", 3, num_block);
    trainees.push(new_trainee);
}

for (var t of trainees) {
    var trainee_label = new PIXI.Text(t.name, {
        fontSize: LABEL_SIZE
    });
    trainee_label.position.set(LABEL_TOP_LEFT_X, LABEL_TOP_LEFT_Y + trainee_count * LABEL_HEIGHT);
    squares.addChild(trainee_label);
    trainee_count += 1;
}

trainee_count = 0;

for (var i = 0; i < NUM_TRAINEE; i ++) {
>>>>>>> fa2db519a019b2b51cb010d80d049ae1512c7f0a

    var rot_count = 0;
    var color;
    for (var j = 0; j < num_block; j++) {
        id = trainees[i].scheduled_blocks[j];
        console.log(trainees[i].scheduled_blocks);
        console.log(id);
        console.log(ROTATIONS_COLOR[id]);
        color = convert_to_color_code(ROTATIONS_COLOR[id]);
        console.log(color);

        var x1 = start_x + rot_count * UNIT_RANGE;
        var y1 = start_y + trainee_count * UNIT_RANGE;

        var newSquare = new Square(x1, y1, color, '', i, app.renderer);
        newSquare.draw();

        newSquare.sprite
            .on('mousedown', onButtonPressed);

        squares.addChild(newSquare.sprite);

        // Merge conflict here
        rot_count += 1;
    }
    trainee_count += 1;
}

function onButtonPressed() {
    this.isOver = true;
    this.visible = false;
}

function onButtonOut() {
    this.isOver = false;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function convert_to_color_code(color_tuple) {
    var r = color_tuple[0];
    var g = color_tuple[1];
    var b = color_tuple[2];
    return "0x" + r.toString(16) + g.toString(16) + b.toString(16);
}
/**
 * All animation lives here
 */
function animate() {

}