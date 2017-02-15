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
    this.scheduled_blocks = [];

    this.base_reqs = {};
    this.processed_reqs = {};
}

Trainee.prototype.set_requirements = function(reqs) {
    this.base_reqs = reqs;
    this.processed_reqs = Object.assign({}, reqs);;
};

Trainee.prototype.set_scheduled_blocks = function(scheduled_blocks) {
    this.scheduled_blocks = scheduled_blocks;
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

//////////////////
// GRAPHIC CLASSES
//////////////////
function Square(x, y, color, rot_name, id, renderer) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.rot_name = rot_name;
        this.id = id;
        this.renderer = renderer;
        this.sprite = new PIXI.Sprite();
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.interactive = true;
}

Square.prototype.draw = function() {
    let texture = new PIXI.Graphics();
    texture.beginFill(this.color);
    texture.drawRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);
    texture.endFill();
    this.sprite.texture = this.renderer.generateTexture(texture);
};


/**
 * ChartBars show information about the number of people at a given rotation at anytime
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

