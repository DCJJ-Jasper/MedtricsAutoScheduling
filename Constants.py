

# ------------------
# SCHEDULE CONSTANTS
# ------------------

NUM_PGY1 = 20
NUM_PGY2 = 0
NUM_PGY3 = 0
NUM_TRAINEES = NUM_PGY1 + NUM_PGY2 + NUM_PGY3
NUM_BLOCK = 52

# -----------------------
# GRADUATION REQUIREMENTS
# -----------------------

# NOTE: The number in requirements represent the number of blocks that student have to take. For example,
#       Each PGY1 has to take 16 blocks of Ambulatory Medicine in order to graduate.

ROLES = ["PGY1", "PGY2", "PGY3"]
REQUIREMENTS = {}
# REQUIREMENTS["PGY1"] = {
#                         #"Vacation": 4,
#                         "Ambulatory Medicine Blocks": 16,
#                         "Emergency Medicine": 2,
#                         "Coronary Care Unit": 4,
#                         "Medical Intensive Care Unit": 4,
#                         "Inpatient Wards": 14,
#                         "Elective": 4,
#                         "Backup Staffing / Urgent Visit": 2,
#                         "Neurology": 2}
# Note: The above is traditional requirement

# requirements for 1.25 and 1.5 issue
# REQUIREMENTS["PGY1"] = {
#     "Ambulatory Medicine Blocks": 5,
#     "Backup Staffing / Urgent Visit": 4,
#     "Coronary Care Unit": 8,
#     "Elective": 8,
#     "Emergency Medicine": 4,
#     "Inpatient Wards": 8,
#     "Medical Intensive Car Unit": 6,
#     "Neurology": 4,
#     # "Vacation": 1
# }

# requirements for 1.25 and 1.5 issue
# REQUIREMENTS["PGY1"] = {
#     "Ambulatory Medicine Blocks": 1,
#     "Backup Staffing / Urgent Visit": 1,
#     "Coronary Care Unit": 2,
#     "Elective": 2,
#     "Emergency Medicine": 1,
#     "Inpatient Wards": 2,
#     "Medical Intensive Care Unit": 1,
#     "Neurology": 1,
#     # "Vacation": 1
# }

REQUIREMENTS["PGY1"] = {
    "Ambulatory Medicine Blocks": 5,
    "Backup Staffing / Urgent Visit": 4,
    "Coronary Care Unit": 8,
    "Elective": 8,
    "Emergency Medicine": 4,
    "Inpatient Wards": 8,
    "Medical Intensive Care Unit": 6,
    "Neurology": 4,
    # "Vacation": 1
}

REQUIREMENTS["PGY1-half"] = {
    "Ambulatory Medicine Blocks": (1.25, 1, 2, 5),
    "Backup Staffing / Urgent Visit": (1, 1, 2, 4),
    "Coronary Care Unit": (2.5, 2, 5, 10),
    "Elective": (2, 2, 4, 8),
    "Emergency Medicine": (1.75, 1, 3, 7),
    "Inpatient Wards": (1, 1, 2, 4),
    "Medical Intensive Care Unit": (1, 1, 2, 4),
    "Neurology": (1, 1, 2, 4),
    # "Vacation": 1
}

REQUIREMENTS["PGY2"] = {
                        #"Vacation": 4,
                        "Ambulatory Medicine Blocks": 16,
                        "Non-CCU Cardiology": 2,
                        "Coronary Care Unit": 4,
                        "Medical Intensive Care Unit": 4,
                        "Inpatient Wards": 14,
                        "Elective": 4,
                        "Backup Staffing / Urgent Visit": 2}

REQUIREMENTS["PGY3"] = {
                        #"Vacation": 4,
                        "Ambulatory Medicine Blocks": 18,
                        "Emergency Medicine": 2,
                        "Medical Intensive Care Unit": 4,
                        "Inpatient Wards": 14,
                        "Elective": 8,
                        "Backup Staffing / Urgent Visit": 4}

VACATION_ALLOWED = {}
VACATION_ALLOWED["PGY1"] = {
    "Ambulatory Medicine Blocks": False,
    "Backup Staffing / Urgent Visit": True,
    "Coronary Care Unit": False,
    "Elective": True,
    "Emergency Medicine": False,
    "Inpatient Wards": True,
    "Medical Intensive Care Unit": False,
    "Neurology": True,
    # "Vacation": True
}

# ROTATIONS_LIST = [("Ambulatory Medicine Blocks", 3, 20, 3, 20, 3, 20),
#                   ("Backup Staffing / Urgent Visit", 1, 20, 1, 20, 1, 20),
#                   ("Emergency Medicine", 1, 20, 1, 20, 1, 20),
#                   ("Vacation", 2, 20, 2, 20, 2, 20),
#                   ("Inpatient Wards", 5, 20, 5, 20, 5, 20),
#                   ("Neurology", 1, 20, 1, 20, 1, 20),
#                   ("Coronary Care Unit", 1, 20, 1, 20, 1, 20),
#                   ("Medical Intensive Care Unit", 1, 20, 1, 20, 1, 20),
#                   ("Non-CCU Cardiology", 1, 20, 1, 20, 1, 20),
#                   ("Elective", 2, 20, 2, 20, 2, 20)]
#
# ROTATIONS_LIST = [("Ambulatory Medicine Blocks", 1, 5, 0, 0, 0, 0),
#                   ("Backup Staffing / Urgent Visit", 1, 6, 0, 0, 0, 0),
#                   ("Coronary Care Unit", 1, 7, 0, 0, 0, 0),
#                   ("Elective", 2, 7, 0, 0, 0, 0),
#                   ("Emergency Medicine", 1, 5, 0, 0, 0, 0),
#                   ("Inpatient Wards", 3, 7, 0, 0, 0, 0),
#                   ("Medical Intensive Care Unit", 1, 5, 0, 0, 0, 0),
#                   ("Neurology", 1, 5, 0, 0, 0, 0),
#                   # ("Vacation", 2, 5)
#                   ]

ROTATIONS_LIST = [("Ambulatory Medicine Blocks", 1, 8, 0, 8, 0, 8),
                  ("Backup Staffing / Urgent Visit", 1, 8, 0, 8, 0, 8),
                  ("Coronary Care Unit", 3, 8, 0, 0, 0, 0),
                  ("Elective", 2, 8, 0, 0, 0, 0),
                  ("Emergency Medicine", 1, 8, 0, 0, 0, 0),
                  ("Inpatient Wards", 3, 8, 0, 0, 0, 0),
                  ("Medical Intensive Care Unit", 1, 8, 0, 0, 0, 0),
                  ("Neurology", 1, 8, 0, 0, 0, 0),
                  # ("Vacation", 2, 5)
                  ]

DESIRED_LENGTH_ROTATION = [("Ambulatory Medicine Blocks", 0.25, 3, 0, 0, 0, 0),
                  ("Backup Staffing / Urgent Visit", 0.25, 1, 0, 0, 0, 0),
                  ("Coronary Care Unit", 0.5, 3, 0, 0, 0, 0),
                  ("Elective", 1, 3, 0, 0, 0, 0),
                  ("Emergency Medicine", 0.25, 3, 0, 0, 0, 0),
                  ("Inpatient Wards", 1, 3, 0, 0, 0, 0),
                  ("Medical Intensive Care Unit", 1, 3, 0, 0, 0, 0),
                  ("Neurology", 1, 3, 0, 0, 0, 0),
                  # ("Vacation", 0.25, 2)
                  ]
NUM_ROT = len(ROTATIONS_LIST)
ROTATIONS_DICT = {}
ROTATIONS_ID = {}
ROTATIONS = []
id_count = 0

# TODO: Limitations
LIMITATIONS = {}

LIMITATIONS["PGY1"] = {
    "Ambulatory Medicine Blocks": 10,
    "Backup Staffing / Urgent Visit": 8,
    "Coronary Care Unit": 10,
    "Elective": 10,
    "Emergency Medicine": 6,
    "Inpatient Wards": 14,
    "Medical Intensive Care Unit": 8,
    "Neurology": 6,
    #"Vacation": 1
}

# ---------------
# LABEL CONSTANTS
# ---------------

ROT_NAME_LEN = 5
TRAINEE_NAME_LEN = 25
ROTATON_NAME_LEN = 35

# ----------------
# GRAPHIC CONSTANT
# ----------------

WIDTH = 1920
HEIGHT = 1080
BACKGROUND_COLOR = (1, 1, 1, 1)
GREEN = (0, 255, 0)

LINE_COLOR = (255.0, 255.0, 255.0, 128.0)
LINE_WIDTH = 2
MIN_LINE_COLOR = (255.0, 0.0, 0.0, 128.0)
MIN_LINE_WIDTH = 3

LABEL_TOP_LEFT = [40, HEIGHT - 40]
LABEL_SIZE = 11
LABEL_HEIGHT = 18

LEGEND_TOP_LEFT = [40, 40 + LABEL_HEIGHT * NUM_TRAINEES + 40]
LEGEND_LABEL_TOP_LEFT = [66, HEIGHT - (40 + LABEL_HEIGHT * NUM_TRAINEES + 40)]
LEGEND_SIZE = 10
LEGEND_HEIGHT = LABEL_HEIGHT
LEGEND_CLICK_LENGTH = 260

SQUARE_TOP_LEFT = [300, 40]
SQUARE_SIZE = 12
SQUARE_HEIGHT = LABEL_HEIGHT
SQUARE_DISTANCE = 4
UNIT_RANGE = SQUARE_SIZE + SQUARE_DISTANCE

CHART_TOP_LEFT = [300, 40 + LABEL_HEIGHT * NUM_TRAINEES + 40]
CHART_SIZE = SQUARE_SIZE
CHART_UNIT_HEIGHT = SQUARE_SIZE + LINE_WIDTH

UNDERDONE_TOP_LEFT = [300 + UNIT_RANGE * NUM_BLOCK + 40, 40]
UNDERDONE_HEIGHT = SQUARE_HEIGHT
UNDERDONE_SIZE = SQUARE_SIZE
UNDERDONE_UNIT_LENGTH = SQUARE_SIZE + LINE_WIDTH

BELOW_MARK_TOP_LEFT = [300, HEIGHT - (40 + LABEL_HEIGHT * NUM_TRAINEES + 40)]
RIGHT_MARK_TOP_LEFT = [300 + UNIT_RANGE * NUM_BLOCK + 40, HEIGHT - 40]

MIN_LINE_TOP_LEFT = [300, HEIGHT - (40 + LABEL_HEIGHT * NUM_TRAINEES + 40)]
MIN_LINE_EXTENSION = 10

# COLOR
ROTATIONS_COLOR = {
    -2: (50.0, 50.0, 50.0),
    -1: (230.0, 230.0, 230.0),
    0: (117.0, 215.0, 23.0),
    1: (63.0, 31.0, 166.0),
    2: (225.0, 42.0, 96.0),
    3: (215.0, 105.0, 38.0),
    4: (225.0, 56.0, 39.0),
    5: (215.0, 82.0, 154.0),
    6: (40.0, 123.0, 215.0),
    7: (222.0, 200.0, 49.0),
    8: (82.0, 50.0, 225.0),
    9: (50.0, 225.0, 136),
    10: (195.0, 184.0, 243.0),
    11: (139.0, 143.0, 203.0),
    12: (66.0, 31.0, 215.0),
    13: (164.0, 47.0, 189.0),
    14: (211.0, 246.0, 111.0),
    15: (177.0, 130.0, 167.0),
    16: (102.0, 252.0, 171.0),
    17: (251.0, 253.0, 238.0),
    18: (214.0, 170.0, 210.0),
    19: (24.0, 192.0, 229.0),
    20: (107.0, 113.0, 13.0),
    21: (247.0, 121.0, 206.0),
    22: (209.0, 108.0, 117.0),
    23: (139.0, 53.0, 211.0),
    24: (95.0, 203.0, 17.0),
    25: (132.0, 231.0, 82.0)
}

for key in ROTATIONS_COLOR.keys():
    r,g,b = ROTATIONS_COLOR[key]
    ROTATIONS_COLOR[key] = (r, g, b)

# ----------------------
# PROGRAM STATE CONSTANT
# ----------------------

STATE_IDLE = -1
STATE_BEGIN = 0
STATE_ANIMATION = 1

# ------------------
# ANIMATION CONSTANT
# ------------------

ANIMATION_STEPS = 10
UNCHOSEN_BLUR = 0.85
NO_BLUR = 0