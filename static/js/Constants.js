/**
 * Created by AC on 2/10/17.
 */

////////////////////
// GRAPHIC CONSTANTS
////////////////////

var DISTANCE = 5;
var SIZE = 10;
var NUM_BLOCK = 30;
var NUM_TRAINEE = 30;
var LABEL_TOP_LEFT_X = 40;
var LABEL_TOP_LEFT_Y = 40;
var LABEL_SIZE = 14;
var LABEL_HEIGHT = 18;
var SQUARE_TOP_LEFT = [300, 40];
var SQUARE_SIZE = 14;
var SQUARE_HEIGHT = LABEL_HEIGHT;
var SQUARE_DISTANCE = 4;
var UNIT_RANGE = SQUARE_SIZE + SQUARE_DISTANCE;

//////////////////////
// SAMPLE READ-IN TEXT
//////////////////////

var SAMPLE_TEXT = "13,3\n" +
  "40,0,0\n" +
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
  "Janean Skomsky,18,PGY1,1.2.4.-1.3.7.6.3.-1.2.5.0.5\n" +
  "Ramonita Gryniuk,19,PGY1,6.3.-1.2.5.0.-1.7.1.4.3.5.2\n" +
  "Teisha Stunkard,20,PGY1,6.5.-1.1.4.2.2.-1.7.5.0.3.3\n" +
  "Latesha Conteras,21,PGY1,4.5.7.3.5.0.-1.2.3.-1.2.6.1\n" +
  "Paris Sachse,22,PGY1,3.4.2.-1.3.5.-1.7.0.6.5.1.2\n" +
  "Tyisha Vandenacre,23,PGY1,1.4.5.6.5.2.3.7.0.-1.2.3.-1\n" +
  "Dewitt Petricone,24,PGY1,3.2.0.-1.3.4.-1.2.7.1.5.6.5\n" +
  "Trinidad Dunmead,25,PGY1,-1.7.3.4.2.-1.5.1.2.5.6.3.0\n" +
  "Lanette Schnitzler,26,PGY1,2.4.2.3.-1.7.1.-1.3.0.6.5.5\n" +
  "Jarod Schille,27,PGY1,3.1.2.-1.-1.4.5.5.6.3.0.2.7\n" +
  "Annemarie Warnecke,28,PGY1,7.4.1.6.-1.0.5.2.3.2.3.5.-1\n" +
  "Carla Tylor,29,PGY1,2.6.5.3.-1.5.1.3.2.-1.4.7.0\n" +
  "Randy Solas,30,PGY1,6.3.7.2.1.5.2.0.-1.-1.3.4.5\n" +
  "Cassie Mercy,31,PGY1,2.5.6.4.0.3.1.3.-1.2.7.5.-1\n" +
  "Gilberte Rezendes,32,PGY1,4.2.0.-1.5.5.2.1.-1.7.3.6.3\n" +
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
  "Rotation ID, Name, Requirement" +
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
}