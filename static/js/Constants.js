// Copyright (C) Medtrics Lab, Inc - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential
// Written by Chengjunjie(Jasper) Ding, Son Pham, Yadong(AC) Li, Tung Phan <son@medtricslab.com>, May 2017

//////////////////////
// SCHEDULER CONSTANTS
//////////////////////

var ROLES_LIST = ["PGY1", "PGY2", "PGY3"]

/////////////////////
// POSITION CONSTANTS
/////////////////////

var DISTANCE = 2;
var SIZE = 10;
var NUM_BLOCK = 30;
var NUM_TRAINEE = 40;

var BUTTON_TOP_LEFT_X = 40;
var BUTTON_TOP_LEFT_Y = 15;
var BUTTON_WIDTH = 150;
var BUTTON_HEIGHT = 40;
var BUTTON_DISTANCE = 15;
var BUTTON_TEXT_SIZE = 14;
var BUTTON_PADDING = (BUTTON_HEIGHT - BUTTON_TEXT_SIZE) / 2
var BUTTON_TEXT_COLOR = "0xFFFFFF";
var BUTTON_COLOR = "0x006DCC"
var TOP_BAR_RANGE = BUTTON_TOP_LEFT_Y + BUTTON_HEIGHT + BUTTON_DISTANCE

var LABEL_ROLE_TOP_LEFT_X = 40;
//var LABEL_ROLE_TOP_LEFT_Y = 30 + TOP_BAR_RANGE;
var LABEL_ROLE_TOP_LEFT_Y = 15;
var LABEL_TOP_LEFT_X = 40;
var LABEL_SIZE = 14;
var LABEL_HEIGHT = 17;
var LABEL_ROLE_SIZE = 26;
var LABEL_ROLE_HEIGHT = 0; // Role name label height
var ROLE_LABEL_TRAINEE_DIST = 5; // Distance between role name and trainees" names
var BLOCK_LABEL_HEIGHT = LABEL_ROLE_TOP_LEFT_Y;
var LABEL_TOP_LEFT_Y = 40 + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST;

var POPUP_LABEL_SIZE = 14;
var POPUP_LABEL_HEIGHT = 22;
var POPUP_SQUARE_SIZE = 14;
var POPUP_CLOSE_OFFSET = 35;
var POPUP_INFO_X_OFFSET = 85;
var POPUP_PADDING = 7;
var POPUP_WIDTH = 350;
var POPUP_WEIGHT = 120;
var POPUP_ROTATION_OFFSET = 4;
var POPUP_ROTATION_SQUARE = 10;
var POPUP_SQUARE_OFFSET_X = 1;
var POPUP_SQUARE_OFFSET_Y = 3;
var POPUP_ROTATION_LABEL_OFFSET = 18;
var POPUP_ROTATION_SIZE = 12;

var SQUARE_TOP_LEFT = [250, 40 + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST];
var SQUARE_SIZE = 14;
var SQUARE_HEIGHT = LABEL_HEIGHT;
var BLOCK_DISTANCE = 0;
var SQUARE_DISTANCE = 3;
var UNIT_RANGE = SQUARE_SIZE + SQUARE_DISTANCE;

var CHART_SIZE = SQUARE_SIZE;
var CHART_UNIT = SQUARE_SIZE;
var CHART_BLOCK_DISTANCE = BLOCK_DISTANCE;
var CHART_RANGE = UNIT_RANGE;

var UNDERDONE_BASE_Y = LABEL_ROLE_TOP_LEFT_Y;
var UNDERDONE_OFFSET_X = 40;
var UNDERDONE_UNIT_LENGTH = 6;
var UNDERDONE_UNIT_RANGE = UNIT_RANGE;
var UNDERDONE_SIZE = SQUARE_SIZE;
var UNDERDONE_LINE_COLOR = "0xEDEDED";
var UNDERDONE_QUARTER_ALPHA = 0.2;
var UNDERDONE_INTEGER_ALPHA = 1;
var UNDERDONE_LABEL_SIZE = 14;
var UNDERDONE_LABEL_COLOR = 0x121212;
var UNDERDONE_LABEL_HEIGHT = BLOCK_LABEL_HEIGHT;

var OVERDONE_OFFSET_X = UNDERDONE_OFFSET_X;
var OVERDONE_UNIT_LENGTH = UNDERDONE_UNIT_LENGTH;
var OVERDONE_UNIT_RANGE = UNDERDONE_UNIT_RANGE;
var OVERDONE_SIZE = UNDERDONE_SIZE;
var OVERDONE_LINE_COLOR = UNDERDONE_LINE_COLOR;
var OVERDONE_QUARTER_ALPHA = UNDERDONE_QUARTER_ALPHA;
var OVERDONE_INTEGER_ALPHA = UNDERDONE_INTEGER_ALPHA;
var OVERDONE_LABEL_SIZE = UNDERDONE_LABEL_SIZE;
var OVERDONE_LABEL_COLOR = UNDERDONE_LABEL_COLOR;
var OVERDONE_LABEL_HEIGHT = UNDERDONE_LABEL_HEIGHT;

var UNDER_OVER_DISTANCE = 40;

var GROUP_DISTANCE = 40; // Distance between two role groups
var CHART_DISTANCE = 40; // Distance between charts and square

var TOP_BORDER_OFFSET = 60;
var TOP_BORDER_MULTIPLIER = 1.2;
var FIRST_TWO_ROWS_BOUND = 47;

//////////////////
// COLOR CONSTANTS
//////////////////

var BACKGROUND_COLOR = [255.0, 255.0, 255.0]
var SQUARE_BLUR = 0.5;
var OTHER_ROLE_BLUR = 0.08;

var ROTATIONS_COLOR = {
    "-2": [50.0, 50.0, 50.0],
    "-1": [230.0, 230.0, 230.0],
    "0": [243.0, 154.0, 97.0],
    "1": [177.0, 135.0, 78.0],
    "2": [86.0, 207.0, 170.0],
    "3": [83.0, 213.0, 163.0],
    "4": [48.0, 208.0, 253.0],
    "5": [73.0, 112.0, 247.0],
    "6": [100.0, 87.0, 232.0],
    "7": [243.0, 144.0, 171.0],
    "8": [196.0, 135.0, 232.0],
    "9": [227.0, 135.0, 78.0],
    "10": [89.0, 192.0, 237.0],
    "11": [170.0, 207.0, 86.0],
    "12": [56.0, 194.0, 143.0],
    "13": [14.0, 189.0, 244.0],
    "14": [55.0, 89.0, 229.0],
    "15": [81.0, 70.0, 214.0],
    "16": [227.0, 120.0, 148.0],
    "17": [117.0, 112.0, 211.0],
    "18": [117.0, 215.0, 23.0],
    "19": [63.0, 31.0, 166.0],
    "20": [225.0, 42.0, 96.0],
    "21": [215.0, 105.0, 38.0],
    "22": [225.0, 56.0, 39.0],
    "23": [215.0, 82.0, 154.0],
    "24": [40.0, 123.0, 215.0],
    "25": [222.0, 200.0, 49.0],
};

// Some special treatment for empty block
EMPTY_BLOCK_NAME = "Blank";
EMPTY_BLOCK_ID = -1;
EMPTY_BLOCK_GRAPHIC_ID = 1000;
EMPTY_BLOCK_COLOR = [230.0, 230.0, 230.0];
ROTATIONS_COLOR[EMPTY_BLOCK_GRAPHIC_ID.toString()] = EMPTY_BLOCK_COLOR;

// Note: EMPTY_BLOCK_GRAPHIC_ID = 1000 is a hack to ensure that Blank block will be able to visualize
// Somehow, the code doesn't accept this ID to be a negative number.

// Texture dictionary
var ROTATIONS_SQUARE_TEXTURE = {};
for (var key in ROTATIONS_COLOR) {
    var texture = new PIXI.Graphics();
    texture.beginFill(convert_to_color_code(ROTATIONS_COLOR[key]));
    texture.drawRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);
    texture.endFill();
    ROTATIONS_SQUARE_TEXTURE[key] = texture;
}

// Texture dictionary
var ROTATIONS_LONG_SQUARE_TEXTURE = {};
for (var key in ROTATIONS_COLOR) {
    var texture = new PIXI.Graphics();
    texture.beginFill(convert_to_color_code(ROTATIONS_COLOR[key]));
    texture.drawRect(0, 0, UNIT_RANGE, SQUARE_SIZE);
    texture.endFill();
    ROTATIONS_LONG_SQUARE_TEXTURE[key] = texture;
}

// Color for popup
var POPUP_BACKGROUND = [233.0, 233.0, 233.0];
var POPUP_FILLED = [242.0, 246.0, 252.0];
var POPUP_CLOSE_BTN_OFFSET = 262;

//////////////////////
// CONTROLLER CONSTANT
//////////////////////

var MODE_EXPLORE = 0;
var MODE_SCHEDULE = 1;

var SCHEDULE_MODE_WHOLE = 0;
var SCHEDULE_MODE_QUARTER = 1;

var STATE_EXPLORE = "explore";
var STATE_INDIVIDUAL = "invidiual";
var STATE_SELECT = "selected";
var STATE_POPUP = "popup";
var STATE_POPUP_SELECT_BUFFER = "buffer";

/////////////////////
// ANIMATION CONSTANT
/////////////////////

var ANIMATION_LENGTH = 10;
var FADE_LENGTH = 100;

//////////////////////
// SAMPLE READ-IN TEXT
//////////////////////

/**
 * This is data sent from the javascript to the server
 * @type {string}
 */
var FAKE_TEXT = "Program,Psychiatry,13\n" +
    "USER_ID,FIRST_NAME,LAST_NAME\n" +
    "Num_PGY1,40\n" +
    "1,Santhosh,Cherian\n" +
    "2,Ron,Rivera\n" +
    "3,Todd,Wilkinson\n" +
    "4,Mary,Renner\n" +
    "5,Randy,Moss\n" +
    "6,Chris,Tokodi\n" +
    "7,Grant,Fuhr\n" +
    "8,Fred,Marston\n" +
    "9,Dodie,Woodman\n" +
    "10,Edie,Ballin\n" +
    "11,Christine,Weible\n" +
    "12,Corina,Colwell\n" +
    "13,Corrin,Ingersoll\n" +
    "14,Soledad,Levey\n" +
    "15,Ron,Dhillon\n" +
    "16,Eileen,Telford\n" +
    "17,In,Trimpe\n" +
    "18,Larisa,Owen\n" +
    "19,Gaynell,Vanleuven\n" +
    "20,Milagros,Tanner\n" +
    "21,Mila,Span\n" +
    "22,Patrina,Pettaway\n" +
    "23,Takako,Jarrells\n" +
    "24,Jenee,Lach\n" +
    "25,Santina,Gwynn\n" +
    "26,Alisia,Durbin\n" +
    "27,Carolyne,Backes\n" +
    "28,Reyes,Turberville\n" +
    "29,Mignon,Jesus\n" +
    "30,Carina,Milbourn\n" +
    "31,Erick,Mines\n" +
    "32,Timothy,Boyes\n" +
    "33,Dorothea,Steckler\n" +
    "34,Tony,Rizzio\n" +
    "35,Roxann,Schwanbeck\n" +
    "36,Fran,Schifo\n" +
    "37,Tawna,Roehrs\n" +
    "38,Evelynn,Sharp\n" +
    "39,Tawana,Vonbank\n" +
    "40,Tung,Phan\n" +
    "Num_PGY2,40\n" +
    "41,Wendi,Fijal\n" +
    "42,Daisy,Gautsch\n" +
    "43,Kathey,Lorenzana\n" +
    "44,Marget,Dure\n" +
    "45,Hilario,Fenbert\n" +
    "46,Magdalene,Menesez\n" +
    "47,Marcel,Cartwright\n" +
    "48,Leda,Spiegle\n" +
    "49,Rosemary,Aurelia\n" +
    "50,Susie,Lustberg\n" +
    "51,Shaina,Trolinger\n" +
    "52,Virgen,Hastin\n" +
    "53,Nicholle,Steeby\n" +
    "54,Starla,Fostervold\n" +
    "55,Sheree,Nech\n" +
    "56,Epifania,Semke\n" +
    "57,Walker,Zumot\n" +
    "58,Coleman,Eavey\n" +
    "59,Ladawn,Progl\n" +
    "60,Myrtice,Brummet\n" +
    "61,Milagro,Mathewson\n" +
    "62,Nelson,Shuart\n" +
    "63,Jeff,Viesselman\n" +
    "64,Sherryl,Ellifritt\n" +
    "65,Amee,Steines\n" +
    "66,Barney,Puebla\n" +
    "67,Dudley,Gubbins\n" +
    "68,Miguel,Biron\n" +
    "69,Amos,Heriford\n" +
    "70,Estefana,Laiche\n" +
    "71,Melvina,Rufo\n" +
    "72,Brigida,Doiel\n" +
    "73,Cinda,Theall\n" +
    "74,Elaine,Stefanick\n" +
    "75,Shanelle,Preus\n" +
    "76,Melony,Contrino\n" +
    "77,Arletta,Dancey\n" +
    "78,Vito,Cossa\n" +
    "79,Jacquelin,Sabatelli\n" +
    "80,Renetta,Glunt\n" +
    "Num_PGY3,40\n" +
    "81,Russel,Javers\n" +
    "82,Judie,Dspain\n" +
    "83,Dave,Rend\n" +
    "84,Ulrike,Face\n" +
    "85,Diedre,Jannise\n" +
    "86,Porfirio,Garahan\n" +
    "87,Lorene,Wisecarver\n" +
    "88,Virgilio,Austria\n" +
    "89,Twana,Knoeppel\n" +
    "90,Bambi,Briagas\n" +
    "91,Doris,Ziler\n" +
    "92,Javier,Croskey\n" +
    "93,Ollie,Hersh\n" +
    "94,Sanora,Crissman\n" +
    "95,Romelia,Schiele\n" +
    "96,Joseph,Redinger\n" +
    "97,Liza,Procter\n" +
    "98,Shantelle,Toca\n" +
    "99,Frederica,Schaack\n" +
    "100,Edelmira,Mclester\n" +
    "101,Onita,Ruud\n" +
    "102,Tressa,Gutenberger\n" +
    "103,Lynn,Zapato,\n" +
    "104,Charlie,Borrero\n" +
    "105,Ronald,Zappala\n" +
    "106,Adele,Maxi\n" +
    "107,Tonita,Maline\n" +
    "108,Naoma,Michaeli\n" +
    "109,Kristin,Kudasik\n" +
    "110,Reva,Weglage\n" +
    "111,Donny,Lainez\n" +
    "112,Pa,Amert\n" +
    "113,Daphne,Orner\n" +
    "114,Valery,Bomgardner\n" +
    "115,Barbar,Zangger\n" +
    "116,Jona,Allder\n" +
    "117,Ira,Wigg\n" +
    "118,Glen,Huppert\n" +
    "119,Lauryn,Scrudato\n" +
    "120,Troy,Homes\n" +
    "---\n" +
    "Num_rotations,8\n" +
    "ROTATION_ID, ROTATION,WORK_WITH_ALLOWED_VACATION,MINIMUM_BLOCK_LENGTH,MAX_BLOCKS_PER_YEAR,TYPE\n" +
    "0,Ambulatory Medicine Blocks,Yes,0.25,6,Core\n" +
    "1,Backup Staffing / Urgent Visit,No,1,6,Core\n" +
    "2,Coronary Care Unit,Yes,1,6,Core\n" +
    "3,Elective,No,0.25,1,Core\n" +
    "4,Emergency Medicine,No,1,6,Core\n" +
    "5,Inpatient Wards,No,1,6,Core\n" +
    "6,Medical Intensive Care Unit,No,0.5,6,Core\n" +
    "7,Neurology,Yes,1,6,Core\n" +
    "---\n" +
    "Workforce_requirements,8\n" +
    "ROTATION_ID,ROTATION,MIN1,MAX1,MIN2,MAX2,MIN3,MAX3,MIN12,MAX12,MIN13,MIN13,MIN23,MAX23,MIN_TOTAL,MAX_TOTAL\n" +
    "0,Ambulatory Medicine Blocks,1,5,1,5,1,5,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "1,Backup Staffing / Urgent Visit,1,5,-1,-1,-1,-1,-1,-1,-1,-1,2,10,-1,-1\n" +
    "2,Coronary Care Unit,1,7,1,7,1,7,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "3,Elective,2,7,-1,-1,-1,-1,-1,-1,-1,-1,4,14,-1,-1\n" +
    "4,Emergency Medicine,1,5,1,5,1,5,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "5,Inpatient Wards,-1,-1,-1,-1,3,7,6,14,-1,-1,-1,-1,-1,-1\n" +
    "6,Medical Intensive Care Unit,1,5,1,5,1,5,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "7,Neurology,1,5,1,5,1,5,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "---\n" +
    "ROTATION,MIN_BLOCKS_REQUIRED\n" +
    "PGY1_REQUIREMENT,8\n" +
    "Ambulatory Medicine Blocks,1.25\n" +
    "Backup Staffing / Urgent Visit,1\n" +
    "Coronary Care Unit,2\n" +
    "Elective,2\n" +
    "Emergency Medicine,1\n" +
    "Inpatient Wards,2\n" +
    "Medical Intensive Care Unit,1.5\n" +
    "Neurology,1\n" +
    "PGY2_REQUIREMENT,8\n" +
    "Ambulatory Medicine Blocks,1.25\n" +
    "Backup Staffing / Urgent Visit,1\n" +
    "Coronary Care Unit,2\n" +
    "Elective,2\n" +
    "Emergency Medicine,1\n" +
    "Inpatient Wards,2\n" +
    "Medical Intensive Care Unit,1.5\n" +
    "Neurology,1\n" +
    "PGY3_REQUIREMENT,8\n" +
    "Ambulatory Medicine Blocks,1.25\n" +
    "Backup Staffing / Urgent Visit,1\n" +
    "Coronary Care Unit,2\n" +
    "Elective,2\n" +
    "Emergency Medicine,1\n" +
    "Inpatient Wards,2\n" +
    "Medical Intensive Care Unit,1.5\n" +
    "Neurology,1\n" +
    "---\n" +
    "ROTATION,LIMITATION\n" +
    "PGY1_LIMITATION,8\n" +
    "Ambulatory Medicine Blocks,10\n" +
    "Backup Staffing / Urgent Visit,10\n" +
    "Coronary Care Unit,10\n" +
    "Elective,10\n" +
    "Emergency Medicine,10\n" +
    "Inpatient Wards,10\n" +
    "Medical Intensive Care Unit,10\n" +
    "Neurology,10\n" +
    "PGY2_LIMITATION,8\n" +
    "Ambulatory Medicine Blocks,10\n" +
    "Backup Staffing / Urgent Visit,10\n" +
    "Coronary Care Unit,10\n" +
    "Elective,10\n" +
    "Emergency Medicine,10\n" +
    "Inpatient Wards,10\n" +
    "Medical Intensive Care Unit,10\n" +
    "Neurology,10\n" +
    "PGY3_LIMITATION,8\n" +
    "Ambulatory Medicine Blocks,10\n" +
    "Backup Staffing / Urgent Visit,10\n" +
    "Coronary Care Unit,10\n" +
    "Elective,10\n" +
    "Emergency Medicine,10\n" +
    "Inpatient Wards,10\n" +
    "Medical Intensive Care Unit,10\n" +
    "Neurology,10\n" +
    "---\n" +
    "Prefilled,0\n" +
    "USERID,BLOCK,ROTATION,WHERE_IN_BLOCK_RANG\n" +
        "1,Santhosh Cherian,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "2,Ron Rivera,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "3,Todd Wilkinson,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "4,Mary Renner,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "5,Randy Moss,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "6,Chris Tokodi,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "7,Grant Fuhr,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "8,Fred Marston,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "9,Dodie Woodman,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "10,Edie Ballin,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "11,Christine Weible,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "12,Corina Colwell,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "13,Corrin Ingersoll,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "14,Soledad Levey,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "15,Ron Dhillon,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "16,Eileen Telford,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "17,In Trimpe,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "18,Larisa Owen,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "19,Gaynell Vanleuven,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "20,Milagros Tanner,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "21,Mila Span,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "22,Patrina Pettaway,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "23,Takako Jarrells,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "24,Jenee Lach,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "25,Santina Gwynn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "26,Alisia Durbin,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "27,Carolyne Backes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "28,Reyes Turberville,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "29,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "30,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "31,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "32,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "33,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "34,Patrina Pettaway,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "35,Takako Jarrells,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "36,Jenee Lach,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "37,Santina Gwynn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "38,Alisia Durbin,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "39,Carolyne Backes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "40,Reyes Turberville,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "41,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "42,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "43,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "44,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "45,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
        "46,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "47,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "48,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "49,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "50,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
        "51,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "52,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "53,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "54,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "55,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
        "56,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "57,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "58,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "59,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "60,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
        "61,Santhosh Cherian,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "62,Ron Rivera,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "63,Todd Wilkinson,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "64,Mary Renner,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "65,Randy Moss,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "66,Chris Tokodi,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "67,Grant Fuhr,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "68,Fred Marston,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "69,Dodie Woodman,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "70,Edie Ballin,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "71,Christine Weible,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "72,Corina Colwell,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "73,Corrin Ingersoll,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "74,Soledad Levey,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "75,Ron Dhillon,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "76,Eileen Telford,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "77,In Trimpe,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "78,Larisa Owen,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "79,Gaynell Vanleuven,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "80,Milagros Tanner,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "81,Mila Span,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "82,Patrina Pettaway,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "83,Takako Jarrells,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "84,Jenee Lach,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "85,Santina Gwynn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "86,Alisia Durbin,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "87,Carolyne Backes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "88,Reyes Turberville,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "89,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "90,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "91,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "92,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "93,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "94,Patrina Pettaway,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "95,Takako Jarrells,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "96,Jenee Lach,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "97,Santina Gwynn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "98,Alisia Durbin,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "99,Carolyne Backes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "100,Reyes Turberville,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "101,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "102,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "103,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "104,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "105,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
        "106,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "107,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "108,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "109,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "110,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
        "111,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "112,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "113,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "114,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "115,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
        "116,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "117,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "118,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "119,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "120,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n";

/**
 * This is data sent from the javascript to the server
 * @type {string}
 */
var FAKE_TEXT_SMALL = "Program,Psychiatry,13\n" +
    "USER_ID,FIRST_NAME,LAST_NAME\n" +
    "Num_PGY1,10\n" +
    "1,Santhosh,Cherian\n" +
    "2,Ron,Rivera\n" +
    "3,Todd,Wilkinson\n" +
    "4,Mary,Renner\n" +
    "5,Randy,Moss\n" +
    "6,Chris,Tokodi\n" +
    "7,Grant,Fuhr\n" +
    "8,Fred,Marston\n" +
    "9,Dodie,Woodman\n" +
    "10,Edie,Ballin\n" +
    "Num_PGY2,10\n" +
    "41,Wendi,Fijal\n" +
    "42,Daisy,Gautsch\n" +
    "43,Kathey,Lorenzana\n" +
    "44,Marget,Dure\n" +
    "45,Hilario,Fenbert\n" +
    "46,Magdalene,Menesez\n" +
    "47,Marcel,Cartwright\n" +
    "48,Leda,Spiegle\n" +
    "49,Rosemary,Aurelia\n" +
    "50,Susie,Lustberg\n" +
    "Num_PGY3,10\n" +
    "81,Russel,Javers\n" +
    "82,Judie,Dspain\n" +
    "83,Dave,Rend\n" +
    "84,Ulrike,Face\n" +
    "85,Diedre,Jannise\n" +
    "86,Porfirio,Garahan\n" +
    "87,Lorene,Wisecarver\n" +
    "88,Virgilio,Austria\n" +
    "89,Twana,Knoeppel\n" +
    "90,Bambi,Briagas\n" +
    "---\n" +
    "Num_rotations,8\n" +
    "ROTATION_ID, ROTATION,WORK_WITH_ALLOWED_VACATION,MINIMUM_BLOCK_LENGTH,MAX_BLOCKS_PER_YEAR,TYPE\n" +
    "0,Ambulatory Medicine Blocks,Yes,1,6,Core\n" +
    "1,Backup Staffing / Urgent Visit,No,1,6,Core\n" +
    "2,Coronary Care Unit,Yes,1,6,Core\n" +
    "3,Elective,No,0.25,1,Core\n" +
    "4,Emergency Medicine,No,1,6,Core\n" +
    "5,Inpatient Wards,No,1,6,Core\n" +
    "6,Medical Intensive Care Unit,No,1,6,Core\n" +
    "7,Neurology,Yes,1,6,Core\n" +
    "---\n" +
    "Workforce_requirements,8\n" +
    "ROTATION_ID,ROTATION,MIN1,MAX1,MIN2,MAX2,MIN3,MAX3,MIN12,MAX12,MIN13,MIN13,MIN23,MAX23,MIN_TOTAL,MAX_TOTAL\n" +
    "0,Ambulatory Medicine Blocks,1,5,1,5,1,5,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "1,Backup Staffing / Urgent Visit,1,5,-1,-1,-1,-1,-1,-1,-1,-1,2,10,-1,-1\n" +
    "2,Coronary Care Unit,1,7,1,7,1,7,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "3,Elective,2,7,-1,-1,-1,-1,-1,-1,-1,-1,4,14,-1,-1\n" +
    "4,Emergency Medicine,1,5,1,5,1,5,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "5,Inpatient Wards,-1,-1,-1,-1,3,7,6,14,-1,-1,-1,-1,-1,-1\n" +
    "6,Medical Intensive Care Unit,1,5,1,5,1,5,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "7,Neurology,1,5,1,5,1,5,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "---\n" +
    "ROTATION,MIN_BLOCKS_REQUIRED\n" +
    "PGY1_REQUIREMENT,8\n" +
    "Ambulatory Medicine Blocks,1.25\n" +
    "Backup Staffing / Urgent Visit,1\n" +
    "Coronary Care Unit,2\n" +
    "Elective,2\n" +
    "Emergency Medicine,1\n" +
    "Inpatient Wards,2\n" +
    "Medical Intensive Care Unit,1.5\n" +
    "Neurology,1\n" +
    "PGY2_REQUIREMENT,8\n" +
    "Ambulatory Medicine Blocks,1.25\n" +
    "Backup Staffing / Urgent Visit,1\n" +
    "Coronary Care Unit,2\n" +
    "Elective,2\n" +
    "Emergency Medicine,1\n" +
    "Inpatient Wards,2\n" +
    "Medical Intensive Care Unit,1.5\n" +
    "Neurology,1\n" +
    "PGY3_REQUIREMENT,8\n" +
    "Ambulatory Medicine Blocks,1.25\n" +
    "Backup Staffing / Urgent Visit,1\n" +
    "Coronary Care Unit,2\n" +
    "Elective,2\n" +
    "Emergency Medicine,1\n" +
    "Inpatient Wards,2\n" +
    "Medical Intensive Care Unit,1.5\n" +
    "Neurology,1\n" +
    "---\n" +
    "ROTATION,LIMITATION\n" +
    "PGY1_LIMITATION,8\n" +
    "Ambulatory Medicine Blocks,10\n" +
    "Backup Staffing / Urgent Visit,10\n" +
    "Coronary Care Unit,10\n" +
    "Elective,10\n" +
    "Emergency Medicine,10\n" +
    "Inpatient Wards,10\n" +
    "Medical Intensive Care Unit,10\n" +
    "Neurology,10\n" +
    "PGY2_LIMITATION,8\n" +
    "Ambulatory Medicine Blocks,10\n" +
    "Backup Staffing / Urgent Visit,10\n" +
    "Coronary Care Unit,10\n" +
    "Elective,10\n" +
    "Emergency Medicine,10\n" +
    "Inpatient Wards,10\n" +
    "Medical Intensive Care Unit,10\n" +
    "Neurology,10\n" +
    "PGY3_LIMITATION,8\n" +
    "Ambulatory Medicine Blocks,10\n" +
    "Backup Staffing / Urgent Visit,10\n" +
    "Coronary Care Unit,10\n" +
    "Elective,10\n" +
    "Emergency Medicine,10\n" +
    "Inpatient Wards,10\n" +
    "Medical Intensive Care Unit,10\n" +
    "Neurology,10\n" +
    "---\n" +
    "Prefilled,0\n" +
    "USERID,BLOCK,ROTATION,WHERE_IN_BLOCK_RANG\n";

var PROBLEM_TEXT = "Program,Psychiatry,13\n" +
    "USER_ID,FIRST_NAME,LAST_NAME\n" +
    "Num_PGY1,20\n" +
    "1,Santhosh,Cherian\n" +
    "2,Ron,Rivera\n" +
    "3,Todd,Wilkinson\n" +
    "4,Mary,Renner\n" +
    "5,Randy,Moss\n" +
    "6,Chris,Tokodi\n" +
    "7,Grant,Fuhr\n" +
    "8,Fred,Marston\n" +
    "9,Dodie,Woodman\n" +
    "10,Edie,Ballin\n" +
    "11,Chris,Shadek\n" +
    "34,Jasper,Ding\n" +
    "35,AC,Li\n" +
    "36,Xiaoying,Pu\n" +
    "37,Anmol,Singh\n" +
    "56,Dorothea,Steckler\n" +
    "57,John,Simmons\n" +
    "58,Courtney,Bolivar\n" +
    "59,Eddy,Lopez\n" +
    "60,Brian,King\n" +
    "Num_PGY2,20\n" +
    "12,Corina,Colwell\n" +
    "13,Corrin,Ingersoll\n" +
    "14,Soledad,Levey\n" +
    "15,Ron,Dhillon\n" +
    "16,Eileen,Telford\n" +
    "17,In,Trimpe\n" +
    "18,Larisa,Owen\n" +
    "19,Gaynell,Vanleuven\n" +
    "20,Milagros,Tanner\n" +
    "21,Mila,Span\n" +
    "22,Patrina,Pettaway\n" +
    "38,Fred,Marston\n" +
    "39,Dodie,Woodman\n" +
    "40,Edie,Ballin\n" +
    "41,Christine,Weible\n" +
    "51,Dorothea,Steckler\n" +
    "52,Fred,Marston\n" +
    "53,Dodie,Woodman\n" +
    "54,Edie,Ballin\n" +
    "55,Christine,Weible\n" +
    "Num_PGY3,30\n" +
    "23,Takako,Jarrells\n" +
    "24,Jenee,Lach\n" +
    "25,Santina,Gwynn\n" +
    "26,Alisia,Durbin\n" +
    "27,Carolyne,Backes\n" +
    "28,Reyes,Turberville\n" +
    "29,Mignon,Jesus\n" +
    "30,Carina,Milbourn\n" +
    "31,Erick,Mines\n" +
    "32,Timothy,Boyes\n" +
    "33,Dorothea,Steckler\n" +
    "42,Fred,Marston\n" +
    "43,Dodie,Woodman\n" +
    "44,Edie,Ballin\n" +
    "45,Christine,Weible\n" +
    "46,Dorothea,Steckler\n" +
    "47,Fred,Marston\n" +
    "48,Dodie,Woodman\n" +
    "49,Edie,Ballin\n" +
    "50,Christine,Weible\n" +
    "61,Dorothea,Steckler\n" +
    "62,Fred,Marston\n" +
    "63,Dodie,Woodman\n" +
    "64,Edie,Ballin\n" +
    "65,Christine,Weible\n" +
    "66,Dorothea,Steckler\n" +
    "67,Fred,Marston\n" +
    "68,Dodie,Woodman\n" +
    "69,Edie,Ballin\n" +
    "70,Christine,Weible\n" +
    "---\n" +
    "Num_rotations,24\n" +
    "ROTATION_ID,ROTATION,WORK_WITH_ALLOWED_VACATION,MINIMUM_BLOCK_LENGTH,MAX_BLOCKS_PER_YEAR,TYPE\n" +
    "0,Inpatient Psychiatry at VCUHS,Yes,1,6,Core\n" +
    "1,Neurology,No,1,6,Core\n" +
    "2,Emergency Medicine,Yes,1,6,Core\n" +
    "3,Night Float,No,0.25,1,Core\n" +
    "4,Inpatient Psychiatry at VAMC,No,1,6,Core\n" +
    "5,Inpatient Psychiatry with Substance Abuse at VAMC,No,1,6,Core\n" +
    "6,Inpatient Medicine,No,1,6,Elective\n" +
    "7,Pediatrics,Yes,1,6,Elective\n" +
    "8,Child and Adolescent Elective,No,1,6,Elective\n" +
    "9,Consult Liaison at VCUHS,No,1,6,Elective\n" +
    "10,ECT,No,0.25,6,Elective\n" +
    "11,Eastern State Hospital/Forensics,Yes,1,6,Elective\n" +
    "12,Outpatient Psychotherapy Clinic,No,1,6,Core\n" +
    "13,ER Psychiatry Night Float,No,1,6,Core\n" +
    "14,VAMC Night Float,No,1,6,Core\n" +
    "15,General Psychiatry,No,1,6,Core\n" +
    "16,Emergency Psychiatry,No,1,6,Core\n" +
    "17,Didactics,No,1,6,Core\n" +
    "18,Child and Adolescent,No,1,6,Core\n" +
    "19,Psychotherapy,No,0.25,6,Core\n" +
    "20,Grand Rounds,No,1,6,Core\n" +
    "21,Consultation and Liaison Psychiatry,No,1,6,Core\n" +
    "22,Community Psychiatry,No,1,6,Core\n" +
    "23,Elective,No,0.25,6,Core\n" +
    "---\n" +
    "Workforce_requirements,24\n" +
    "ROTATION_ID,ROTATION,LEVEL,MIN1,MAX1,MIN2,MAX2,MIN3,MAX3\n" +
    "0,Inpatient Psychiatry at VCUHS,1,10,1,10,0,10,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "1,Neurology,1,10,0,0,1,10,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "2,Emergency Medicine,1,10,1,10,1,10,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "3,Night Float,1,10,1,10,1,10,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "4,Inpatient Psychiatry at VAMC,1,10,1,10,0,10,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "5,Inpatient Psychiatry with Substance Abuse at VAMC,1,10,1,10,0,10,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "6,Inpatient Medicine,0,10,1,10,0,10,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "7,Pediatrics,1,10,1,10,0,10,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "8,Child and Adolescent Elective,0,10,0,10,0,10,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "9,Consult Liaison at VCUHS,0,10,0,10,0,10,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "10,ECT,0,10,0,10,0,10,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "11,Eastern State Hospital/Forensics,0,10,0,10,0,10,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "12,Outpatient Psychotherapy Clinic,0,20,0,20,0,20,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "13,ER Psychiatry Night Float,0,20,0,20,0,20,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "14,VAMC Night Float,0,20,0,20,0,20,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "15,General Psychiatry,0,20,0,20,0,20,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "16,Emergency Psychiatry,0,20,0,20,0,20,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "17,Didactics,0,20,0,20,0,20,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "18,Child and Adolescent,0,20,0,20,0,20,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "19,Psychotherapy,0,20,0,20,0,20,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "20,Grand Rounds,0,20,0,20,0,20,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "21,Consultation and Liaison Psychiatry,0,20,0,20,0,20,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "22,Community Psychiatry,0,20,0,20,0,20,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "23,Elective,0,20,0,20,0,20,-1,-1,-1,-1,-1,-1,-1,-1\n" +
    "---\n" +
    "ROTATION,MIN_BLOCKS_REQUIRED\n" +
    "PGY1_REQUIREMENT,24\n" +
    "Inpatient Medicine,0\n" +
    "Pediatrics,0\n" +
    "Child and Adolescent Elective,0\n" +
    "Consult Liaison at VCUHS,0\n" +
    "ECT,0\n" +
    "Eastern State Hospital/Forensics,0\n" +
    "Outpatient Psychotherapy Clinic,0\n" +
    "ER Psychiatry Night Float,0\n" +
    "VAMC Night Float,0\n" +
    "General Psychiatry,0\n" +
    "Emergency Psychiatry,0\n" +
    "Didactics,0\n" +
    "Child and Adolescent,0\n" +
    "Psychotherapy,0\n" +
    "Grand Rounds,0\n" +
    "Consultation and Liaison Psychiatry,0\n" +
    "Community Psychiatry,0\n" +
    "Inpatient Psychiatry at VCUHS,3\n" +
    "Neurology,2\n" +
    "Emergency Medicine,1\n" +
    "Night Float,0.25\n" +
    "Inpatient Psychiatry at VAMC,1\n" +
    "Inpatient Psychiatry with Substance Abuse at VAMC,1\n" +
    "Elective,2\n" +
    "PGY2_REQUIREMENT,24\n" +
    "Inpatient Medicine,1\n" +
    "Pediatrics,2\n" +
    "Child and Adolescent Elective,0\n" +
    "Consult Liaison at VCUHS,0\n" +
    "ECT,0\n" +
    "Eastern State Hospital/Forensics,0\n" +
    "Outpatient Psychotherapy Clinic,1\n" +
    "ER Psychiatry Night Float,1\n" +
    "VAMC Night Float,1\n" +
    "General Psychiatry,0\n" +
    "Emergency Psychiatry,0\n" +
    "Didactics,0\n" +
    "Child and Adolescent,0\n" +
    "Psychotherapy,0\n" +
    "Grand Rounds,0\n" +
    "Consultation and Liaison Psychiatry,0\n" +
    "Community Psychiatry,0\n" +
    "Inpatient Psychiatry at VCUHS,1\n" +
    "Neurology,0\n" +
    "Emergency Medicine,0\n" +
    "Night Float,0\n" +
    "Inpatient Psychiatry at VAMC,0\n" +
    "Inpatient Psychiatry with Substance Abuse at VAMC,0\n" +
    "Elective,2\n" +
    "PGY3_REQUIREMENT,24\n" +
    "Inpatient Medicine,1\n" +
    "Pediatrics,1\n" +
    "Child and Adolescent Elective,0\n" +
    "Consult Liaison at VCUHS,0\n" +
    "ECT,0\n" +
    "Eastern State Hospital/Forensics,0\n" +
    "Outpatient Psychotherapy Clinic,0\n" +
    "ER Psychiatry Night Float,0\n" +
    "VAMC Night Float,0\n" +
    "General Psychiatry,1\n" +
    "Emergency Psychiatry,1\n" +
    "Didactics,2\n" +
    "Child and Adolescent,1\n" +
    "Psychotherapy,0.25\n" +
    "Grand Rounds,2\n" +
    "Consultation and Liaison Psychiatry,0\n" +
    "Community Psychiatry,0\n" +
    "Inpatient Psychiatry at VCUHS,0\n" +
    "Neurology,0\n" +
    "Emergency Medicine,0\n" +
    "Night Float,0\n" +
    "Inpatient Psychiatry at VAMC,0\n" +
    "Inpatient Psychiatry with Substance Abuse at VAMC,0\n" +
    "Elective,0\n" +
    "---\n" +
    "ROTATION,LIMITATION\n" +
    "PGY1_LIMITATION, 24\n" +
    "Inpatient Medicine,52\n" +
    "Pediatrics,52\n" +
    "Child and Adolescent Elective,52\n" +
    "Consult Liaison at VCUHS,52\n" +
    "ECT,52\n" +
    "Eastern State Hospital/Forensics,52\n" +
    "Outpatient Psychotherapy Clinic,52\n" +
    "ER Psychiatry Night Float,52\n" +
    "VAMC Night Float,52\n" +
    "General Psychiatry,52\n" +
    "Emergency Psychiatry,52\n" +
    "Didactics,52\n" +
    "Child and Adolescent,52\n" +
    "Psychotherapy,52\n" +
    "Grand Rounds,52\n" +
    "Consultation and Liaison Psychiatry,52\n" +
    "Community Psychiatry,52\n" +
    "Inpatient Psychiatry at VCUHS,4\n" +
    "Neurology,3\n" +
    "Emergency Medicine,1\n" +
    "Night Float,2\n" +
    "Inpatient Psychiatry at VAMC,520\n" +
    "Inpatient Psychiatry with Substance Abuse at VAMC,52\n" +
    "Elective,52\n" +
    "PGY2_LIMITATION, 24\n" +
    "Inpatient Medicine,52\n" +
    "Pediatrics,52\n" +
    "Child and Adolescent Elective,52\n" +
    "Consult Liaison at VCUHS,52\n" +
    "ECT,52\n" +
    "Eastern State Hospital/Forensics,52\n" +
    "Outpatient Psychotherapy Clinic,52\n" +
    "ER Psychiatry Night Float,52\n" +
    "VAMC Night Float,52\n" +
    "General Psychiatry,52\n" +
    "Emergency Psychiatry,52\n" +
    "Didactics,52\n" +
    "Child and Adolescent,52\n" +
    "Psychotherapy,52\n" +
    "Grand Rounds,52\n" +
    "Consultation and Liaison Psychiatry,52\n" +
    "Community Psychiatry,52\n" +
    "Inpatient Psychiatry at VCUHS,52\n" +
    "Neurology,52\n" +
    "Emergency Medicine,52\n" +
    "Night Float,52\n" +
    "Inpatient Psychiatry at VAMC,0\n" +
    "Inpatient Psychiatry with Substance Abuse at VAMC,0\n" +
    "Elective,52\n" +
    "PGY3_LIMITATION,24\n" +
    "Inpatient Medicine,52\n" +
    "Pediatrics,52\n" +
    "Child and Adolescent Elective,52\n" +
    "Consult Liaison at VCUHS,52\n" +
    "ECT,52\n" +
    "Eastern State Hospital/Forensics,52\n" +
    "Outpatient Psychotherapy Clinic,52\n" +
    "ER Psychiatry Night Float,52\n" +
    "VAMC Night Float,52\n" +
    "General Psychiatry,52\n" +
    "Emergency Psychiatry,52\n" +
    "Didactics,52\n" +
    "Child and Adolescent,1\n" +
    "Psychotherapy,52\n" +
    "Grand Rounds,52\n" +
    "Consultation and Liaison Psychiatry,52\n" +
    "Community Psychiatry,52\n" +
    "Inpatient Psychiatry at VCUHS,52\n" +
    "Neurology,52\n" +
    "Emergency Medicine,52\n" +
    "Night Float,52\n" +
    "Inpatient Psychiatry at VAMC,0\n" +
    "Inpatient Psychiatry with Substance Abuse at VAMC,0\n" +
    "Elective,52\n" +
    "---\n" +
    "Prefilled\n" +
    "USERID,NAME,ROLE,SCHEDULE\n" +
    "1,Santhosh Cherian,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "2,Ron Rivera,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "3,Todd Wilkinson,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "4,Mary Renner,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "5,Randy Moss,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "6,Chris Tokodi,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "7,Grant Fuhr,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "8,Fred Marston,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "9,Dodie Woodman,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "10,Edie Ballin,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "11,Christine Weible,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "12,Corina Colwell,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "13,Corrin Ingersoll,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "14,Soledad Levey,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "15,Ron Dhillon,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "16,Eileen Telford,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "17,In Trimpe,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "18,Larisa Owen,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "19,Gaynell Vanleuven,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "20,Milagros Tanner,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "21,Mila Span,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "22,Patrina Pettaway,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "23,Takako Jarrells,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "24,Jenee Lach,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "25,Santina Gwynn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "26,Alisia Durbin,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "27,Carolyne Backes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "28,Reyes Turberville,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "29,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "30,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "31,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "32,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "33,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "34,Patrina Pettaway,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "35,Takako Jarrells,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "36,Jenee Lach,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "37,Santina Gwynn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "38,Alisia Durbin,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "39,Carolyne Backes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "40,Reyes Turberville,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "41,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "42,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "43,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "44,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "45,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
        "46,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "47,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "48,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "49,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "50,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
        "51,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "52,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "53,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "54,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "55,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
        "56,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "57,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "58,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "59,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "60,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
        "61,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "62,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "63,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "64,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "65,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
        "66,Mignon Jesus,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "67,Carina Milbourn,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "68,Erick Mines,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "69,Timothy Boyes,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n" +
    "70,Dorothea Steckler,-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1\n"