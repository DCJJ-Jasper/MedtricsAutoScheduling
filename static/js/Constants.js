/**
 * Created by AC on 2/10/17.
 */

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
var LABEL_ROLE_TOP_LEFT_Y = 30 + TOP_BAR_RANGE;
var LABEL_TOP_LEFT_X = 40;
var LABEL_TOP_LEFT_Y = 40 + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST;
var LABEL_SIZE = 14;
var LABEL_HEIGHT = 17;
var LABEL_ROLE_SIZE = 26;
var LABEL_ROLE_HEIGHT = 26; // Role name label height
var ROLE_LABEL_TRAINEE_DIST = 5; // Distance between role name and trainees" names

var POPUP_LABEL_SIZE = 14;
var POPUP_LABEL_HEIGHT = 22;
var POPUP_SQUARE_SIZE = 14;
var POPUP_INFO_X_OFFSET = 85;
var POPUP_PADDING = 7;
var POPUP_WIDTH = 300;
var POPUP_WEIGHT = 124;
var POPUP_ROTATION_OFFSET = 4;
var POPUP_ROTATION_SQUARE = 10;
var POPUP_SQUARE_OFFSET_X = 1;
var POPUP_SQUARE_OFFSET_Y = 3;
var POPUP_ROTATION_LABEL_OFFSET = 18;
var POPUP_ROTATION_SIZE = 12;

var SQUARE_TOP_LEFT = [300, 40 + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST];
var SQUARE_SIZE = 14;
var SQUARE_HEIGHT = LABEL_HEIGHT;
var BLOCK_DISTANCE = 0;
var SQUARE_DISTANCE = 3;
var UNIT_RANGE = SQUARE_SIZE + SQUARE_DISTANCE;

var CHART_SIZE = SQUARE_SIZE;
var CHART_UNIT = SQUARE_SIZE;
var CHART_DISTANCE = SQUARE_DISTANCE;
var CHART_BLOCK_DISTANCE = BLOCK_DISTANCE;
var CHART_RANGE = UNIT_RANGE;

var UNDERDONE_UNIT_LENGTH = SQUARE_SIZE;
var UNDERDONE_UNIT_RANGE = UNIT_RANGE;
var UNDERDONE_SIZE = SQUARE_SIZE;

var GROUP_DISTANCE = 40; // Distance between two role groups
var CHART_DISTANCE = 40; // Distance between charts and square

//////////////////
// COLOR CONSTANTS
//////////////////

var SQUARE_BLUR = 0.2;
var OTHER_ROLE_BLUR = 0.08;

var ROTATIONS_COLOR = {
    "-2": [50.0, 50.0, 50.0],
    "-1": [230.0, 230.0, 230.0],
    "0": [117.0, 215.0, 23.0],
    "1": [63.0, 31.0, 166.0],
    "2": [225.0, 42.0, 96.0],
    "3": [215.0, 105.0, 38.0],
    "4": [225.0, 56.0, 39.0],
    "5": [215.0, 82.0, 154.0],
    "6": [40.0, 123.0, 215.0],
    "7": [222.0, 200.0, 49.0],
    "8": [82.0, 50.0, 225.0],
    "9": [50.0, 225.0, 136],
    "10": [195.0, 184.0, 243.0],
    "11": [139.0, 143.0, 203.0],
    "12": [66.0, 31.0, 215.0],
    "13": [164.0, 47.0, 189.0],
    "14": [211.0, 246.0, 111.0],
    "15": [177.0, 130.0, 167.0],
    "16": [102.0, 252.0, 171.0],
    "17": [251.0, 253.0, 238.0],
    "18": [214.0, 170.0, 210.0],
    "19": [24.0, 192.0, 229.0],
    "20": [107.0, 113.0, 13.0],
    "21": [247.0, 121.0, 206.0],
    "22": [209.0, 108.0, 117.0],
    "23": [139.0, 53.0, 211.0],
    "24": [95.0, 203.0, 17.0],
    "25": [132.0, 231.0, 82.0]
};

// Some special treatment for empty block
EMPTY_BLOCK_NAME = "Blank";
EMPTY_BLOCK_GRAPHIC_ID = 1000;
EMPTY_BLOCK_COLOR = [230.0, 230.0, 230.0]
ROTATIONS_COLOR[EMPTY_BLOCK_GRAPHIC_ID] = EMPTY_BLOCK_COLOR;

// Texture dictionary
var ROTATIONS_SQUARE_TEXTURE = {}
for (var key in ROTATIONS_COLOR) {
    var texture = new PIXI.Graphics();
    texture.beginFill(convert_to_color_code(ROTATIONS_COLOR[key]));
    texture.drawRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);
    texture.endFill();
    ROTATIONS_SQUARE_TEXTURE[key] = texture;
}

// Texture dictionary
var ROTATIONS_LONG_SQUARE_TEXTURE = {}
for (var key in ROTATIONS_COLOR) {
    var texture = new PIXI.Graphics();
    texture.beginFill(convert_to_color_code(ROTATIONS_COLOR[key]));
    texture.drawRect(0, 0, UNIT_RANGE, SQUARE_SIZE);
    texture.endFill();
    ROTATIONS_LONG_SQUARE_TEXTURE[key] = texture;
}

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