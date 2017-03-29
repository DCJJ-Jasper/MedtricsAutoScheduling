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

function convert_to_graphic_id(schedule_info) {
    cloned_info = JSON.parse(JSON.stringify(schedule_info))
    for (var i = 0; i < cloned_info.length; i++) {
        if (cloned_info[i] == String(EMPTY_BLOCK_ID)) cloned_info[i] = String(EMPTY_BLOCK_GRAPHIC_ID);
    }
    return cloned_info;
}

function convert_to_schedule_id(schedule_info) {
    cloned_info = JSON.parse(JSON.stringify(schedule_info))
    for (var i = 0; i < cloned_info.length; i++) {
        if (cloned_info[i] == String(EMPTY_BLOCK_GRAPHIC_ID)) cloned_info[i] = String(EMPTY_BLOCK_ID);
    }
    return cloned_info;
}

// Function to download data to a file
function download(data, filename, type) {
    var a = document.createElement("a"),
        file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}