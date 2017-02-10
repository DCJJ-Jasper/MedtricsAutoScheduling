/**
 * Created by AC on 2/9/17.
 */

var DISTANCE = 5;
var SIZE = 10;
var NUM_BLOCK = 30;
var NUM_TRAINEE = 30;
var LABEL_HEIGHT = 18;
var SQUARE_TOP_LEFT = [300, 40];
var SQUARE_SIZE = 12;
var SQUARE_HEIGHT = LABEL_HEIGHT;
var SQUARE_DISTANCE = 4;
var UNIT_RANGE = SQUARE_SIZE + SQUARE_DISTANCE;

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
msg.position.set(NUM_BLOCK * (SQUARE_SIZE + SQUARE_DISTANCE), start_y);

app.stage.addChild(squares);
app.stage.addChild(msg);

// create an array to store all the sprites
var maggots = [];

var trainee_count = 0;

for (var i = 0; i < NUM_TRAINEE; i ++) {

    var rot_count = 0;

    for (var j = 0; j < NUM_BLOCK; j++) {

        // create a new Sprite
        var square = new PIXI.Graphics();

        if (j % 3) {
            var color = getRandomColor();
        }

        square.beginFill(color);

        var x1 = start_x + rot_count * UNIT_RANGE;
        var y1 = start_y + trainee_count * UNIT_RANGE;

        square.drawRect(x1, y1, SQUARE_SIZE, SQUARE_SIZE);

        square.endFill();

        var texture = app.renderer.generateTexture(square);

        var spirite = new PIXI.Sprite(texture);
        spirite.buttonMode = true;

        spirite.x = x1;
        spirite.y = y1;

        spirite.interactive = true;

        spirite
            .on('mouseover', onButtonOver);

        // finally we push the dude into the maggots array so it it can be easily accessed later
        maggots.push(spirite);
        squares.addChild(spirite);

        rot_count += 1;
    }
    trainee_count += 1;
}

function onButtonOver() {
    this.isOver = true;
    msg.visible = true;
    this.visible = false;

}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}