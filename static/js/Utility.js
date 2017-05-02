// Copyright (C) Medtrics Lab, Inc - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential
// Written by Chengjunjie(Jasper) Ding, Son Pham, Yadong(AC) Li, Tung Phan <son@medtricslab.com>, May 2017

/**
 * Utility.js
 */

/**
 * Based on given rgb values, convert to hex color codes
 * @param color_tuple
 * @returns {string}
 */
function convert_to_color_code(color_tuple) {
    var r = Math.round(color_tuple[0]);
    var g = Math.round(color_tuple[1]);
    var b = Math.round(color_tuple[2]);
    return "0x" + r.toString(16) + g.toString(16) + b.toString(16);
}

/**
 *
 * @param schedule_info
 */
function convert_to_graphic_id(schedule_info) {
    var cloned_info = JSON.parse(JSON.stringify(schedule_info))
    for (var i = 0; i < cloned_info.length; i++) {
        if (cloned_info[i] == String(EMPTY_BLOCK_ID)) cloned_info[i] = String(EMPTY_BLOCK_GRAPHIC_ID);
    }
    return cloned_info;
}

function convert_to_schedule_id(schedule_info) {
    var cloned_info = JSON.parse(JSON.stringify(schedule_info))
    for (var i = 0; i < cloned_info.length; i++) {
        if (cloned_info[i] == String(EMPTY_BLOCK_GRAPHIC_ID)) cloned_info[i] = String(EMPTY_BLOCK_ID);
    }
    return cloned_info;
}

/**
 * Sort the trainees to be displayed in the visualization
 * @param trainees_list
 */
function sort_trainees(trainees_list) {
    trainees_list.sort(function(a, b){
       if(a.name < b.name) return -1;
       if(a.name > b.name) return 1;
       return 0;
    })
}

/**
 * Function to download data to a .csv file
 * */
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

/**
 * Used to represent total number
 * @param arr1
 * @param arr2
 */
function generate_in_between_arr(arr1, arr2, animation_length = ANIMATION_LENGTH) {
    var in_between_arr = new Array(animation_length + 1);
    for (var i = 0; i < animation_length + 1; i++) {
        in_between_arr[i] = new Array(arr1.length);
        // TODO: Use NumJS for this part might be a smart choice for speed up.
        for (var j = 0; j < arr1.length; j++) {
            in_between_arr[i][j] = (arr2[j] - arr1[j]) * (i + 1) / animation_length + arr1[j];
        }
    }
    in_between_arr[animation_length] = arr2;
    return in_between_arr;
}

/**
 * Generate in between graphic values for animation
 * @param val1
 * @param val2
 * @param animation_length
 * @returns {Array}
 */
function generate_in_between_val(val1, val2, animation_length = ANIMATION_LENGTH) {
    var in_between_val = new Array(animation_length + 1);
    for (var i = 0; i < animation_length; i ++) {
        in_between_val[i] = (val2 - val1) * (i + 1) / animation_length + val1;
    }
    in_between_val[animation_length] = val2;
    return in_between_val;
}

