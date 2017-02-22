# ------------
# WINDOW CLASS
# ------------

import pyglet

from Helper import *
from Class import *
from Constants import *

class Window(pyglet.window.Window):

    def __init__(self, width, height):
        super(Window, self).__init__(width, height)
        self.state = STATE_BEGIN
        self.steps = 0