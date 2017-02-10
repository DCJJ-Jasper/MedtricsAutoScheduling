

# ------------------
# SCHEDULE CONSTANTS
# ------------------

NUM_PGY1 = 40
NUM_PGY2 = 0
NUM_PGY3 = 0
NUM_TRAINEES = NUM_PGY1 + NUM_PGY2 + NUM_PGY3
NUM_BLOCK = 12

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
#                         "Medical Intensive Car Unit": 4,
#                         "Inpatient Wards": 14,
#                         "Elective": 4,
#                         "Backup Staffing / Urgent Visit": 2,
#                         "Neurology": 2}
# Note: The above is traditional requirement

REQUIREMENTS["PGY1"] = {
    "Ambulatory Medicine Blocks": 1,
    "Backup Staffing / Urgent Visit": 1,
    "Coronary Care Unit": 2,
    "Elective": 2,
    "Emergency Medicine": 1,
    "Inpatient Wards": 2,
    "Medical Intensive Car Unit": 1,
    "Neurology": 1,
    # "Vacation": 1
}

REQUIREMENTS["PGY2"] = {
                        #"Vacation": 4,
                        "Ambulatory Medicine Blocks": 16,
                        "Non-CCU Cardiology": 2,
                        "Coronary Care Unit": 4,
                        "Medical Intensive Car Unit": 4,
                        "Inpatient Wards": 14,
                        "Elective": 4,
                        "Backup Staffing / Urgent Visit": 2}

REQUIREMENTS["PGY3"] = {
                        #"Vacation": 4,
                        "Ambulatory Medicine Blocks": 18,
                        "Emergency Medicine": 2,
                        "Medical Intensive Car Unit": 4,
                        "Inpatient Wards": 14,
                        "Elective": 8,
                        "Backup Staffing / Urgent Visit": 4}

# ROTATIONS_LIST = [("Ambulatory Medicine Blocks", 3, 20, 3, 20, 3, 20),
#                   ("Backup Staffing / Urgent Visit", 1, 20, 1, 20, 1, 20),
#                   ("Emergency Medicine", 1, 20, 1, 20, 1, 20),
#                   ("Vacation", 2, 20, 2, 20, 2, 20),
#                   ("Inpatient Wards", 5, 20, 5, 20, 5, 20),
#                   ("Neurology", 1, 20, 1, 20, 1, 20),
#                   ("Coronary Care Unit", 1, 20, 1, 20, 1, 20),
#                   ("Medical Intensive Car Unit", 1, 20, 1, 20, 1, 20),
#                   ("Non-CCU Cardiology", 1, 20, 1, 20, 1, 20),
#                   ("Elective", 2, 20, 2, 20, 2, 20)]

ROTATIONS_LIST = [("Ambulatory Medicine Blocks", 1, 5, 0, 0, 0, 0),
                  ("Backup Staffing / Urgent Visit", 1, 6, 0, 0, 0, 0),
                  ("Coronary Care Unit", 1, 7, 0, 0, 0, 0),
                  ("Elective", 2, 7, 0, 0, 0, 0),
                  ("Emergency Medicine", 1, 5, 0, 0, 0, 0),
                  ("Inpatient Wards", 3, 7, 0, 0, 0, 0),
                  ("Medical Intensive Car Unit", 1, 5, 0, 0, 0, 0),
                  ("Neurology", 1, 5, 0, 0, 0, 0),
                  # ("Vacation", 2, 5)
                  ]

NUM_ROT = len(ROTATIONS_LIST)
ROTATIONS = []
ROTATIONS_ID = {}
id_count = 0

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
    -1: (230.0, 230.0, 230.0),
    0: (117.0, 215.0, 23.0),
    1: (215.0, 171.0, 38.0),
    2: (202.0, 98.0, 45.0),
    3: (225.0, 148.0, 39.0),
    4: (225.0, 56.0, 39.0),
    5: (215.0, 82.0, 154.0),
    6: (215.0, 48.0, 203.0),
    7: (55.0, 151.0, 202.0),
    8: (82.0, 50.0, 225.0),
    9: (50.0, 225.0, 136.0)
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