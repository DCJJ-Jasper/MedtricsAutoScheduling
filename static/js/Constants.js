/**
 * Created by AC on 2/10/17.
 */

/////////////////////
// POSITION CONSTANTS
/////////////////////

var DISTANCE = 5;
var SIZE = 10;
var NUM_BLOCK = 30;
var NUM_TRAINEE = 40;

var BUTTON_TOP_LEFT_X = 40;
var BUTTON_TOP_LEFT_Y = 15;
var BUTTON_WIDTH = 81;
var BUTTON_HEIGHT = 36;
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
var LABEL_HEIGHT = 18;
var LABEL_ROLE_SIZE = 26;
var LABEL_ROLE_HEIGHT = 26; // Role name label height
var ROLE_LABEL_TRAINEE_DIST = 5; // Distance between role name and trainees' names

var SQUARE_TOP_LEFT = [300, 40 + LABEL_ROLE_HEIGHT + ROLE_LABEL_TRAINEE_DIST];
var SQUARE_SIZE = 14;
var SQUARE_HEIGHT = LABEL_HEIGHT;
var SQUARE_DISTANCE = 4;
var UNIT_RANGE = SQUARE_SIZE + SQUARE_DISTANCE;

var CHART_SIZE = SQUARE_SIZE;
var CHART_UNIT = SQUARE_SIZE;
var CHART_DISTANCE = SQUARE_DISTANCE;
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
    '-2': [50.0, 50.0, 50.0],
    '-1': [230.0, 230.0, 230.0],
    '0': [117.0, 215.0, 23.0],
    '1': [63.0, 31.0, 166.0],
    '2': [225.0, 42.0, 96.0],
    '3': [215.0, 105.0, 38.0],
    '4': [225.0, 56.0, 39.0],
    '5': [215.0, 82.0, 154.0],
    '6': [40.0, 123.0, 215.0],
    '7': [222.0, 200.0, 49.0],
    '8': [82.0, 50.0, 225.0],
    '9': [50.0, 225.0, 136],
    '10': [195.0, 184.0, 243.0],
    '11': [139.0, 143.0, 203.0],
    '12': [66.0, 31.0, 215.0],
    '13': [164.0, 47.0, 189.0],
    '14': [211.0, 246.0, 111.0],
    '15': [177.0, 130.0, 167.0],
    '16': [102.0, 252.0, 171.0],
    '17': [251.0, 253.0, 238.0],
    '18': [214.0, 170.0, 210.0],
    '19': [24.0, 192.0, 229.0],
    '20': [107.0, 113.0, 13.0],
    '21': [247.0, 121.0, 206.0],
    '22': [209.0, 108.0, 117.0],
    '23': [139.0, 53.0, 211.0],
    '24': [95.0, 203.0, 17.0],
    '25': [132.0, 231.0, 82.0]
};

// Texture dictionary
var ROTATIONS_TEXTURE = {}
for (var key in ROTATIONS_COLOR) {
    var texture = new PIXI.Graphics();
    texture.beginFill(convert_to_color_code(ROTATIONS_COLOR[key]));
    texture.drawRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);
    texture.endFill();
    ROTATIONS_TEXTURE[key] = texture;
}

//////////////////////
// SAMPLE READ-IN TEXT
//////////////////////

var SAMPLE_TEXT = "13,3\n" +
  "28,8,4\n" +
  "Student, Role, Schedule\n" +
  "In Weatherly,0,PGY1,3.3.5.5.6.1.2.7.4.0.-1.2.-1\n" +
  "Bong Dubre,1,PGY1,3.3.5.5.2.1.6.-1.0.7.2.4.-1\n" +
  "Aleisha Platero,2,PGY1,5.1.4.3.3.2.5.6.2.-1.7.-1.0\n" +
  "Adria Guth,3,PGY1,5.5.2.3.2.1.3.-1.6.0.4.7.-1\n" +
  "Merlyn Mccarley,4,PGY1,5.5.2.4.3.3.7.-1.-1.2.1.0.6\n" +
  "Brady Teper,5,PGY1,6.2.3.5.1.0.4.3.5.-1.-1.2.7\n" +
  "Andy Kandoll,6,PGY1,7.5.3.0.1.4.3.5.2.6.2.-1.-1\n" +
  "Donetta Grafe,7,PGY1,-1.0.5.6.5.4.7.2.3.2.3.1.-1\n" +
  "Herbert Cendana,8,PGY1,2.0.6.1.5.2.5.4.3.3.-1.7.-1\n" +
  "Darron Linney,9,PGY1,4.0.7.-1.5.1.5.3.2.3.6.2.-1\n" +
  "Leroy Degroat,10,PGY1,-1.2.-1.0.7.3.6.2.5.5.1.3.4\n" +
  "Faviola Tullio,11,PGY1,-1.0.-1.7.6.5.2.5.3.3.2.4.1\n" +
  "Anette Simmions,12,PGY1,-1.6.2.7.3.0.-1.5.5.4.2.3.1\n" +
  "Mallory Kirley,13,PGY1,-1.7.1.3.2.5.4.2.-1.5.0.6.3\n" +
  "Toi Ehlen,14,PGY1,2.6.-1.1.0.5.4.-1.7.2.3.5.3\n" +
  "Louisa Botellio,15,PGY1,-1.7.0.-1.3.6.2.1.3.2.5.5.4\n" +
  "Kiesha Menlove,16,PGY1,0.7.1.-1.6.2.3.3.-1.4.5.2.5\n" +
  "Joella Middaugh,17,PGY1,-1.-1.3.3.2.2.7.6.4.1.0.5.5\n" +
  "Janean Skomsky,18,PGY2,1.2.4.-1.3.7.6.3.-1.2.5.0.5\n" +
  "Ramonita Gryniuk,19,PGY2,6.3.-1.2.5.0.-1.7.1.4.3.5.2\n" +
  "Teisha Stunkard,20,PGY3,6.5.-1.1.4.2.2.-1.7.5.0.3.3\n" +
  "Latesha Conteras,21,PGY2,4.5.7.3.5.0.-1.2.3.-1.2.6.1\n" +
  "Paris Sachse,22,PGY1,3.4.2.-1.3.5.-1.7.0.6.5.1.2\n" +
  "Tyisha Vandenacre,23,PGY3,1.4.5.6.5.2.3.7.0.-1.2.3.-1\n" +
  "Dewitt Petricone,24,PGY2,3.2.0.-1.3.4.-1.2.7.1.5.6.5\n" +
  "Trinidad Dunmead,25,PGY2,-1.7.3.4.2.-1.5.1.2.5.6.3.0\n" +
  "Lanette Schnitzler,26,PGY1,2.4.2.3.-1.7.1.-1.3.0.6.5.5\n" +
  "Jarod Schille,27,PGY1,3.1.2.-1.-1.4.5.5.6.3.0.2.7\n" +
  "Annemarie Warnecke,28,PGY3,7.4.1.6.-1.0.5.2.3.2.3.5.-1\n" +
  "Carla Tylor,29,PGY2,2.6.5.3.-1.5.1.3.2.-1.4.7.0\n" +
  "Randy Solas,30,PGY2,6.3.7.2.1.5.2.0.-1.-1.3.4.5\n" +
  "Cassie Mercy,31,PGY1,2.5.6.4.0.3.1.3.-1.2.7.5.-1\n" +
  "Gilberte Rezendes,32,PGY3,4.2.0.-1.5.5.2.1.-1.7.3.6.3\n" +
  "Tony Rizzio,33,PGY1,5.3.0.1.2.6.5.2.-1.-1.3.4.7\n" +
  "Roxann Schwanbeck,34,PGY1,1.5.3.5.-1.4.3.0.7.6.2.2.-1\n" +
  "Fran Schifo,35,PGY1,5.2.2.0.1.-1.-1.3.6.5.4.7.3\n" +
  "Tawna Roehrs,36,PGY1,2.3.5.-1.1.3.7.-1.2.0.5.4.6\n" +
  "Evelynn Sharp,37,PGY1,7.2.4.0.1.3.2.6.-1.5.-1.3.5\n" +
  "Tawana Vonbank,38,PGY1,2.7.3.-1.2.3.1.5.4.5.0.6.-1\n" +
  "Barb Tua,39,PGY1,7.4.5.5.-1.3.0.6.2.-1.1.2.3\n" +
  "Rotations,8\n" + // Add this to the text generator
  "ID, Name, Min1, Max1, Min2, Max2, Min3, Max3\n" +
  "0,Ambulatory Medicine Blocks,1,5,0,0,0,0\n" +
  "1,Backup Staffing / Urgent Visit,1,6,0,0,0,0\n" +
  "2,Coronary Care Unit,1,7,0,0,0,0\n" +
  "3,Elective,2,7,0,0,0,0\n" +
  "4,Emergency Medicine,1,5,0,0,0,0\n" +
  "5,Inpatient Wards,3,7,0,0,0,0\n" +
  "6,Medical Intensive Car Unit,1,5,0,0,0,0\n" +
  "7,Neurology,1,5,0,0,0,0\n" +
  "Rotation ID, Name, Requirement\n" +
  "PGY1 Requirements\n" +
  "0,Ambulatory Medicine Blocks,1\n" +
  "1,Backup Staffing / Urgent Visit,1\n" +
  "2,Coronary Care Unit,2\n" +
  "3,Elective,2\n" +
  "4,Emergency Medicine,1\n" +
  "5,Inpatient Wards,2\n" +
  "6,Medical Intensive Car Unit,1\n" +
  "7,Neurology,1\n" +
  "PGY2 Requirements\n" +
  "0,Ambulatory Medicine Blocks,0\n" +
  "1,Backup Staffing / Urgent Visit,0\n" +
  "2,Coronary Care Unit,0\n" +
  "3,Elective,0\n" +
  "4,Emergency Medicine,0\n" +
  "5,Inpatient Wards,0\n" +
  "6,Medical Intensive Car Unit,0\n" +
  "7,Neurology,0\n" +
  "PGY3 Requirements\n" +
  "0,Ambulatory Medicine Blocks,0\n" +
  "1,Backup Staffing / Urgent Visit,0\n" +
  "2,Coronary Care Unit,0\n" +
  "3,Elective,0\n" +
  "4,Emergency Medicine,0\n" +
  "5,Inpatient Wards,0\n" +
  "6,Medical Intensive Car Unit,0\n" +
  "7,Neurology,0\n"

var FAKE_TEXT = "Program,Psychiatry,13\n" +
    "USER_ID,FIRST_NAME,LAST_NAME\n" +
    "Num_PGY1,40\n" +
    "1,Santhosh,Cherian\n" +
    "2,Ron,Rivera\n" +
    "3,Todd,Wilkinsonv\n" +
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
    "Num_PGY2,0\n" +
    "Num_PGY3,0\n" +
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
    "ROTATION_ID,ROTATION,MIN1,MAX1,MIN2,MAX2,MIN3,MAX3\n" +
    "0,Ambulatory Medicine Blocks,1,5,0,0,0,0\n" +
    "1,Backup Staffing / Urgent Visit,1,5,0,0,0,0\n" +
    "2,Coronary Care Unit,1,7,0,0,0,0\n" +
    "3,Elective,2,7,0,0,0,0\n" +
    "4,Emergency Medicine,1,5,0,0,0,0\n" +
    "5,Inpatient Wards,3,7,0,0,0,0\n" +
    "6,Medical Intensive Care Unit,1,5,0,0,0,0\n" +
    "7,Neurology,1,5,0,0,0,0\n" +
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
    "Neurology,4\n" +
    "PGY2_REQUIREMENT,8\n" +
    "Ambulatory Medicine Blocks,0\n" +
    "Backup Staffing / Urgent Visit,0\n" +
    "Coronary Care Unit,0\n" +
    "Elective,0\n" +
    "Emergency Medicine,0\n" +
    "Inpatient Wards,0\n" +
    'Medical Intensive Care Unit,0\n" +
    'Neurology,0\n" +
    'PGY3_REQUIREMENT,8\n" +
    'Ambulatory Medicine Blocks,0\n" +
    'Backup Staffing / Urgent Visit,0\n" +
    'Coronary Care Unit,0\n" +
    'Elective,0\n" +
    "Emergency Medicine,0\n" +
    "Inpatient Wards,0\n" +
    "Medical Intensive Care Unit,0\n" +
    "Neurology,0\n" +
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
    "USERID,BLOCK,ROTATION,WHERE_IN_BLOCK_RANGE"