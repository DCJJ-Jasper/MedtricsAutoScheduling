/**
 * Created by AC on 2/10/17.
 */

class Square {
    constructor(x, y, color, rot_name, id, renderer) {
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

    draw() {
        var texture = new PIXI.Graphics();
        texture.beginFill(this.color);
        texture.drawRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);
        texture.endFill();
        this.sprite.texture = this.renderer.generateTexture(texture);
    }


}