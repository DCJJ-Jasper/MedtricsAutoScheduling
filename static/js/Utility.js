/**
 * Created by Son Pham on 2/21/2017.
 */

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