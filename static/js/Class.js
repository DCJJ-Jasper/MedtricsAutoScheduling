/**
 * Created by AC on 2/10/17.
 */

////////////////
// MODEL CLASSES
////////////////

/**
 * A Trainee in the program
 * @param name
 * @param role
 * @param id
 * @param num_block
 * @constructor
 */
function Trainee(name, role, id, num_block) {
    this.name = name;
    this.role = role;
    this.id = id;
    this.num_block = num_block;
    this.id_list = id_list;
    this.scheduled_blocks = [];

    this.base_reqs = {};
    this.processed_reqs = {};
}

Trainee.prototype.set_requirements = function(reqs) {
    this.base_reqs = reqs;
    this.processed_reqs = Object.assign({}, reqs);
};

Trainee.prototype.set_scheduled_blocks = function(scheduled_blocks) {
    this.scheduled_blocks = scheduled_blocks;
};

Trainee.prototype.set_empty_schedule_blocks = function () {
    this.scheduled_blocks = new Array(this.num_block).fill(EMPTY_BLOCK_GRAPHIC_ID);
};

/**
 * Underdone information for graphics
 * @returns {Array}
 */
Trainee.prototype.get_underdone_array = function() {

    var underdone_arr = [];

    // Add the remain requirements for the first rotation
    var num_req = this.processed_reqs[this.id_list[0]];
    if (num_req < 0) underdone_arr.push(0);
    else underdone_arr.push(num_req);

    // Add the remaining require for the rest of the rotation
    for (var i = 1; i < num_rotations; i++) {
        num_req = this.processed_reqs[this.id_list[i]];
        if (num_req < 0) underdone_arr.push(underdone_arr[i-1]);
        else underdone_arr.push(underdone_arr[i-1] + num_req);
    }

    // Return the underdone_arr
    return underdone_arr;
};

/**
 * Underdone array for specs but with only the information of the rotation specified
 * @param rot_id
 */
Trainee.prototype.get_underdone_spec_array = function(rot_id) {
    rot_id = parseInt(rot_id);
    var arr = [];
    var current_value = 0;
    for (var i = 0; i < num_rotations; i++) {
        var temp_id = this.id_list[i];
        if (temp_id == rot_id) {
            var num_req = this.processed_reqs[this.id_list[i]];
            if (num_req < 0) current_value = 0;
            else current_value = num_req;
        }
        arr[i] = current_value;
    }
    return arr;
}

/**
 * Overdone information for graphics
 * @returns {Array}
 */
Trainee.prototype.get_overdone_array = function() {

    var overdone_arr = [];

    // Add the remain requirements for the first rotation
    var num_req = this.processed_reqs[this.id_list[0]];
    if (num_req > 0) overdone_arr.push(0);
    else overdone_arr.push(- num_req);

    // Add the remaining require for the rest of the rotation
    for (var i = 1; i < num_rotations; i++) {
        num_req = this.processed_reqs[this.id_list[i]];
        if (num_req > 0) overdone_arr.push(overdone_arr[i-1]);
        else overdone_arr.push(overdone_arr[i-1] - num_req);
    }

    // Return the underdone_arr
    return overdone_arr;
};


Trainee.prototype.generate_prefill_info = function() {
    var str = "";
    str += String(this.id) + ",";
    str += String(this.name) + ",";
    str += convert_to_schedule_id(this.scheduled_blocks).join(".");
    return str;
}

/**
 * A Rotation with demands
 * @param name
 * @param id
 * @param vacation_allowed
 * @param min_block_length
 * @param type
 * @param num_block
 * @constructor
 */
function Rotation(name, id, vacation_allowed = false, min_block_length = 1.0, type = "Core", num_block = 13) {
    this.name = name;
    this.id = id;
    this.vacation_allowed = vacation_allowed;
    this.min_block_length = min_block_length;
    this.type = type;
    this.num_block = num_block;

    this.min1 = 0;
    this.max1 = 0;
    this.min2 = 0;
    this.max2 = 0;
    this.min3 = 0;
    this.max3 = 0;

    this.processed_min1 = [];
    this.processed_max1 = [];
    this.processed_min2 = [];
    this.processed_max2 = [];
    this.processed_min3 = [];
    this.processed_max3 = [];
}

Rotation.prototype.set_rotation_demands = function(min1, max1, min2, max2, min3, max3) {
    this.min1 = min1;
    this.max1 = max1;
    this.min2 = min2;
    this.max2 = max2;
    this.min3 = min3;
    this.max3 = max3;

    this.processed_min1 = [min1] * num_block;
    this.processed_max1 = [max1] * num_block;
    this.processed_min2 = [min2] * num_block;
    this.processed_max2 = [max2] * num_block;
    this.processed_min3 = [min3] * num_block;
    this.processed_max3 = [max3] * num_block;
};

/**
 * A Schedule that contains trainees and rotations
 * @param trainees
 * @param rotations
 * @param num_block
 * @constructor
 */
function Schedule(trainees, rotations, num_block) {
    this.trainees = trainees;
    this.rotations = rotations;
    this.num_block = num_block;

    // Schedule text information
    this.str_list = [];
    this.schedule_info_mark = 0;
}

Schedule.prototype.get_block_info_role_id = function(role, id) {
    var info_arr = Array(num_block).fill(0);
    var id_str = String(id);
    for (var t of this.trainees) {
        if (t.role == role) {
            for (var i = 0; i < num_block; i++) {
                if (t.scheduled_blocks[i] == id_str) info_arr[i] += 1;
            }
        }
    }
    return info_arr;
};

Schedule.prototype.get_schedule_info = function() {
    var s = "";
    for (var t of trainees) {
        s += String(t.id) + "," + String(t.name) + "," + String(t.role) + ",";
        var subs = "";
        for (id of t.scheduled_blocks) {
            if (String(id) == EMPTY_BLOCK_GRAPHIC_ID) {
                subs += String(EMPTY_BLOCK_ID) + "."
            } else {
                subs += String(id) + "."
            }
        }
        subs.substring(0, subs.length - 1);
        s += subs + "\n"
    }
    return s
};

Schedule.prototype.get_schedule_info_csv = function() {
    var s = "";
    for (var t of trainees) {
        s += String(t.id) + "," + String(t.name) + "," + String(t.role) + ",";
        var subs = "";
        for (id of t.scheduled_blocks) {
            if (String(id) == EMPTY_BLOCK_GRAPHIC_ID) {
                subs += String(EMPTY_BLOCK_ID) + "."
            } else {
                subs += String(id) + "."
            }
        }
        subs.substring(0, subs.length - 1);
        s += subs + "\n"
    }
    return s
};

Schedule.prototype.set_schedule_str_list = function(str_list) {
    this.str_list = str_list;
};

Schedule.prototype.set_schedule_info_mark = function(mark) {
    this.schedule_info_mark = mark;
};

Schedule.prototype.generate_problem_text = function() {
    var line_num;
    var data;
    for (var i = 0; i < this.trainees.length; i++) {
        line_num = this.schedule_info_mark + i;
        this.str_list[line_num] = this.trainees[i].generate_prefill_info();
    };
    return this.str_list.join("\n");
}

//////////////////
// GRAPHIC CLASSES
//////////////////

/**
 * Square of each indepdent thing
 * @param x
 * @param y
 * @param color
 * @param rot_name
 * @param id
 * @param role
 * @param renderer
 * @param rotations_texture
 * @constructor
 */
function Square(x, y, color, renderer, rot_name, id, role, trainee, trainee_name, block_num, rotations_texture = ROTATIONS_SQUARE_TEXTURE) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.rot_name = rot_name;
    this.rot_id = id;
    this.trainee_name = trainee_name;
    this.block_num = block_num;
    this.renderer = renderer;

    this.sprite = new PIXI.Sprite();
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.interactive = true;
    this.sprite.trainee = trainee;
    this.sprite.rot_id = id;
    this.sprite.rot_name = rot_name;
    this.sprite.role = role;
    this.sprite.trainee_name = trainee_name;
    this.sprite.block_num = block_num;
    this.sprite._textureID = 1;
    this.sprite.renderer = renderer;
    this.sprite.square = this;

    this.sprite.color = color;
}

Square.prototype.draw = function() {
    this.sprite.texture = this.renderer.generateTexture(ROTATIONS_SQUARE_TEXTURE[this.rot_id]);
};

/**
 * LongSquare is a child of Square, slightly longer to connect the two same consecutive rotations within block
 * @param x
 * @param y
 * @param color
 * @param renderer
 * @param rot_name
 * @param id
 * @param role
 * @param trainee_name
 * @param block_num
 * @param rotations_texture
 * @constructor
 */
function LongSquare(x, y, color, renderer, rot_name, id, role, trainee, trainee_name, block_num, rotations_texture = ROTATIONS_SQUARE_TEXTURE) {
    Square.call(this, x, y, color, renderer, rot_name, id, role, trainee, trainee_name, block_num, rotations_texture);
}
LongSquare.prototype = new Square();
LongSquare.prototype.constructor = LongSquare;

LongSquare.prototype.draw = function() {
    this.sprite.texture = this.renderer.generateTexture(ROTATIONS_LONG_SQUARE_TEXTURE[this.rot_id]);
};

LongSquare.prototype.convert = function () {
    return new Square(this.x, this.y, this.color, this.renderer, this.rot_name, this.id, this.role, this.trainee, this.trainee_name, this.block_num, this.rotations_texture);
};

/**
 * ChartBars show information about the number of people at a given rotation at anytime
 * @param x
 * @param y
 * @param height
 * @param color
 * @param renderer
 * @constructor
 */
function ChartBars(x, y, height, color, renderer) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.color = color;
    this.renderer = renderer;
}

ChartBars.prototype.draw = function() {

};

/**
 * Underdone bars show information about the number of rotation needed by the trainee
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param color
 * @param renderer
 * @constructor
 */
function UnderdoneBars(x1, y1, x2, y2, color, renderer) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.renderer = renderer;
}

UnderdoneBars.prototype.draw = function() {

};

function RotationSquare(x, y, color, renderer) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.rot_name = rot_name;
    this.id = id;
    this.trainee_name = trainee_name;
    this.block_num = block_num;
    this.renderer = renderer;
}
