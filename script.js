function object(posx, posy, velx, vely, rota, rotaVel, coeff, coeffRota, shape, scaleX, scaleY) {
    this.posx = posx;
    this.posy = posy;
    this.velx = velx;
    this.vely = vely;
    this.rota = rota;
    this.rotaVel = rotaVel;
    this.coeff = coeff;
    this.coeffRota = coeffRota;
    this.shape = shape;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
}

const c = document.getElementById("main");
const button = document.querySelector("#main");
button.addEventListener("click", mouseClick, false);
const painter = c.getContext("2d", { alpha: false });
// painter.imageSmoothingEnabled = false;

const width = c.width;
const height = c.height;
const centerX = width / 2;
const centerY = height / 2;

var pointerX = 0;
var pointerY = 0;

var defaultScale = 10;

var fps = 30;
var frame = 0;

var objects = new Array();

var selectedObject = 0;

var square = new Image();
square.src = `/Images/pog.jpg`;

function setup() {}

function update() {
    if (frame % width > 0 && frame % width < 5) {
        painter.clearRect(0, 0, width, height);
    }
    painter.clearRect(0, 100, width, height);

    document.getElementById("description").innerHTML = `Selected Object: ${selectedObject}`;
    if (objects[selectedObject] != null) {
        document.getElementById("description").innerHTML += `<br> posX: ${objects[selectedObject].posx}`;
        document.getElementById("description").innerHTML += `<br> posY: ${objects[selectedObject].posy}`;
        document.getElementById("description").innerHTML += `<br> velX: ${objects[selectedObject].velx}`;
        document.getElementById("description").innerHTML += `<br> velY: ${objects[selectedObject].vely}`;
        document.getElementById("description").innerHTML += `<br> rota: ${objects[selectedObject].rota}`;
        document.getElementById("description").innerHTML += `<br> rotaVel: ${objects[selectedObject].rotaVel}`;
        document.getElementById("description").innerHTML += `<br> coeff: ${objects[selectedObject].coeff}`;
        document.getElementById("description").innerHTML += `<br> coeffRota: ${objects[selectedObject].coeffRota}`;
        document.getElementById("description").innerHTML += `<br> shape: ${objects[selectedObject].shape}`;
        document.getElementById("description").innerHTML += `<br> scaleX: ${objects[selectedObject].scaleX}`;
        document.getElementById("description").innerHTML += `<br> scaleY: ${objects[selectedObject].scaleY}`;
    }
    for (var i = 0; i < objects.length; i++) {
        drawRect(objects[i].posx, objects[i].posy, defaultScale * objects[i].scaleX, defaultScale * objects[i].scaleY, 255, 255, 255);
        var friction = objects[i].coeff;

        // objects[i].velx = friction * objects[i].velx;
        // objects[i].vely = friction * objects[i].vely;
        // objects[i].rotaVel = friction * objects[i].rotaVel;

        objects[i].posx += objects[i].velx;
        objects[i].posy -= objects[i].vely;
    }

    drawRect(frame % width, 50 + objects[selectedObject].velx * 10, 1, 1, 255, 0, 0);
    drawRect(frame % width, 50 + objects[selectedObject].vely * 10, 1, 1, 0, 0, 255);

    frame++;
}

function addobj() {
    objects[objects.length] = new object(centerX, centerY, 0, 0, 0, 0, 0.1, 0, "Square", 1, 1);
}

function destroyall() {
    objects = new Array();
    painter.clearRect(0, 0, width, height);
    selectedObject = 0;
}

function screenshot() {
    let canvasUrl = c.toDataURL();
    const createEl = document.createElement("a");
    createEl.href = canvasUrl;
    var todayDate = new Date().toISOString().slice(0, 10);
    createEl.download = `Screenshot_${todayDate}`;
    createEl.click();
    createEl.remove();
}

function fillImageArray(array, number) {
    for (var i = 0; i < number; i++) {
        array[i] = new Image();
    }
}

function mouseClick() {}

function input(key) {
    switch (key) {
        case ".":
            if (selectedObject + 1 < objects.length) {
                selectedObject++;
            }
            break;
        case ",":
            if (selectedObject - 1 >= 0) {
                selectedObject--;
            }
        case "w":
            objects[selectedObject].vely += 1;
            break;
        case "s":
            objects[selectedObject].vely -= 1;
            break;
        case "a":
            objects[selectedObject].velx -= 1;
            break;
        case "d":
            objects[selectedObject].velx += 1;
            break;
    }
}

function saveVariableToFile(variable, saveName) {
    var thingToSave = JSON.stringify(variable);
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:attachment/text," + encodeURI(thingToSave);
    hiddenElement.target = "_blank";
    hiddenElement.download = `${saveName}.json`;
    hiddenElement.click();
}

function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function paintImage(image, x, y, angle) {
    painter.save();
    painter.translate(x, y);
    painter.rotate(toRadian(180 + angle));
    painter.drawImage(image, -1 * (defaultScale / 2), -1 * (defaultScale / 2));
    painter.restore();
}

function toRadian(angle) {
    return (180 + angle) * (Math.PI / 180);
}

function clearScreen() {
    painter.clearRect(0, 0, width, height);
}

function findSlope(y2, y1, x2, x1) {
    return ((y2 - y1) / (x2 - x1)) * -1;
}

function drawRect(x1, y1, x2, y2, r, g, b) {
    painter.beginPath();
    painter.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.fillRect(x1, y1, x2, y2);
    painter.closePath();
}

function roundedRect(x, y, width, height, radius, r, g, b) {
    painter.beginPath();
    painter.moveTo(x, y + radius);
    painter.arcTo(x, y + height, x + radius, y + height, radius);
    painter.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    painter.arcTo(x + width, y, x + width - radius, y, radius);
    painter.arcTo(x, y, x, y + radius, radius);
    painter.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.stroke();
    painter.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.fill();
    painter.closePath();
}

function drawText(text, x, y, r, g, b) {
    painter.beginPath();
    painter.font = "15px Arial";
    painter.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.fillText(text, x, y + 1);
    painter.closePath();
}

function drawCircle(sX, sY, hStretch, vStretch, rotation, r, g, b) {
    painter.beginPath();
    painter.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.ellipse(sX, sY, hStretch, vStretch, rotation, 0, 360);
    painter.stroke();
    painter.fill();
    painter.closePath();
}

function drawLine(sX, sY, eX, eY, r, g, b) {
    painter.beginPath();
    painter.strokeStyle = `rgb(${r},${g},${b})`;
    painter.moveTo(sX, sY);
    painter.lineTo(eX, eY);
    painter.closePath();
    painter.stroke();
}

document.addEventListener(
    "keydown",
    (event) => {
        var name = event.key;
        input(name);
    },
    false
);

document.onmousemove = function (event) {
    const target = event.target;
    const rect = target.getBoundingClientRect();
    var wRatio = (rect.right - rect.left) / width;
    var hRatio = (rect.bottom - rect.top) / height;
    pointerX = (event.pageX - window.scrollX - rect.left) / wRatio;
    pointerY = (event.pageY - window.scrollY - rect.top) / hRatio;
};

setup();
setInterval(update, 1 / fps);
