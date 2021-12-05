
let NXBT_CONTROLLER_INDEX = false;

const KEYMAP = {
    // Left Stick
    87: "LS_UP",
    65: "LS_LEFT",
    68: "LS_RIGHT",
    83: "LS_DOWN",
    84: "LS_PRESS",
    // Right Stick
    38: "RS_UP",
    37: "RS_LEFT",
    39: "RS_RIGHT",
    40: "RS_DOWN",
    89: "RS_PRESS",
    // Dpad
    71: "DPAD_UP",
    86: "DPAD_LEFT",
    78: "DPAD_RIGHT",
    66: "DPAD_DOWN",
    // Home & Capture
    219: "HOME",
    221: "CAPTURE",
    // Plus & Minus
    54: "PLUS",
    55: "MINUS",
    // A B X Y
    76: "A",
    75: "B",
    73: "X",
    74: "Y",
    // L & ZL
    49: "L",
    50: "ZL",
    // R & ZR
    56: "ZR",
    57: "R",
}

const LEFT_STICK = [
    "LS_UP",
    "LS_LEFT",
    "LS_RIGHT",
    "LS_DOWN"
]
const RIGHT_STICK = [
    "RS_UP",
    "RS_LEFT",
    "RS_RIGHT",
    "RS_DOWN"
]

let INPUT_PACKET = {
    // Sticks
    "L_STICK": {
        "PRESSED": false,
        "X_VALUE": 0,
        "Y_VALUE": 0,
        // Keyboard position calculation values
        "LS_UP": false,
        "LS_LEFT": false,
        "LS_RIGHT": false,
        "LS_DOWN": false
    },
    "R_STICK": {
        "PRESSED": false,
        "X_VALUE": 0,
        "Y_VALUE": 0,
        // Keyboard position calculation values
        "RS_UP": false,
        "RS_LEFT": false,
        "RS_RIGHT": false,
        "RS_DOWN": false
    },
    // Dpad
    "DPAD_UP": false,
    "DPAD_LEFT": false,
    "DPAD_RIGHT": false,
    "DPAD_DOWN": false,
    // Triggers
    "L": false,
    "ZL": false,
    "R": false,
    "ZR": false,
    // Joy-Con Specific Buttons
    "JCL_SR": false,
    "JCL_SL": false,
    "JCR_SR": false,
    "JCR_SL": false,
    // Meta buttons
    "PLUS": false,
    "MINUS": false,
    "HOME": false,
    "CAPTURE": false,
    // Buttons
    "Y": false,
    "X": false,
    "B": false,
    "A": false
}

let socket = io();

socket.on('create_pro_controller', function(index) {
    console.log("Pro controller created")
    NXBT_CONTROLLER_INDEX = index;
});

document.onload = function() {
    console.log("Creating pro controller...")
    socket.emit('create_pro_controller')
}

// Keydown listener
function globalKeydownHandler(evt) {

    evt = evt || window.event;
    // Prevent scrolling on keypress
    if([32, 37, 38, 39, 40].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
    }

    if (Object.keys(KEYMAP).indexOf(JSON.stringify(evt.keyCode)) > -1) {
        control = KEYMAP[evt.keyCode];
        if (LEFT_STICK.indexOf(control) > -1) {
            INPUT_PACKET["L_STICK"][control] = true;
        } else if (RIGHT_STICK.indexOf(control) > -1) {
            INPUT_PACKET["R_STICK"][control] = true;
        } else {
            INPUT_PACKET[control] = true;
        }
        sendUpdate()
    }
}
document.onkeydown = globalKeydownHandler;

// Keyup listener
function globalKeyupHandler(evt) {

    evt = evt || window.event;
    
    if (Object.keys(KEYMAP).indexOf(JSON.stringify(evt.keyCode)) > -1) {
        control = KEYMAP[evt.keyCode];
        if (LEFT_STICK.indexOf(control) > -1) {
            INPUT_PACKET["L_STICK"][control] = false;
        } else if (RIGHT_STICK.indexOf(control) > -1) {
            INPUT_PACKET["R_STICK"][control] = false;
        } else {
            INPUT_PACKET[control] = false;
        }
        sendUpdate()
    }
}
document.onkeyup = globalKeyupHandler;

function sendUpdate() {
    // Calculating left x/y stick values
    lXValue = 0
    lYValue = 0
    if (INPUT_PACKET["L_STICK"]["LS_LEFT"]) {
        lXValue -= 100
    }
    if (INPUT_PACKET["L_STICK"]["LS_RIGHT"]) {
        lXValue += 100
    }
    if (INPUT_PACKET["L_STICK"]["LS_UP"]) {
        lYValue += 100
    }
    if (INPUT_PACKET["L_STICK"]["LS_DOWN"]) {
        lYValue -= 100
    }
    INPUT_PACKET["L_STICK"]["X_VALUE"] = lXValue
    INPUT_PACKET["L_STICK"]["Y_VALUE"] = lYValue

    // Calculating left x/y stick values
    rXValue = 0
    rYValue = 0
    if (INPUT_PACKET["R_STICK"]["RS_LEFT"]) {
        rXValue -= 100
    }
    if (INPUT_PACKET["R_STICK"]["RS_RIGHT"]) {
        rXValue += 100
    }
    if (INPUT_PACKET["R_STICK"]["RS_UP"]) {
        rYValue += 100
    }
    if (INPUT_PACKET["R_STICK"]["RS_DOWN"]) {
        rYValue -= 100
    }
    INPUT_PACKET["R_STICK"]["X_VALUE"] = rXValue
    INPUT_PACKET["R_STICK"]["Y_VALUE"] = rYValue

    socket.emit('input', JSON.stringify([NXBT_CONTROLLER_INDEX, INPUT_PACKET]));
}
