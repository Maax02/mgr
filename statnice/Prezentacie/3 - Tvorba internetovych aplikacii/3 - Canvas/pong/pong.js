"use strict";
var ctxFg;
var ctxBg;
var width;
var height;
var mousePos = {x: undefined, y: undefined};
var requestID;
var lastUpdate;
var border = 25;
var pongIdx = 0;
var pongs = [];
 
var ball = {x: undefined, y: undefined, r: 10, color: "black", vx: undefined, vy: undefined,
    init: function () {
        this.x = width / 3;
        this.y = height / 3;
 
        var angle = Math.random() * 2 * Math.PI;
        var speed = Math.random() * 200 + 400;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    },
    draw: function () {
        ctxFg.beginPath();
        ctxFg.fillStyle = this.color;
        ctxFg.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctxFg.fill();
    }
};
 
var walls = {
    x: undefined, y: undefined, r: undefined, minR: undefined, thickness: 10, color: "blue",
    init: function () {
        this.r = Math.max(width, height) / 4;
        this.minR = this.r * 0.1;
    },
    reduce: function () {
        var newR = this.r * 0.9;
        if (newR >= this.minR)
            this.r = newR;
    },
    draw: function () {
        ctxFg.beginPath();
        ctxFg.fillStyle = this.color;
        ctxFg.rect(this.x - this.r, border - this.thickness, 2 * this.r, this.thickness);
        ctxFg.rect(this.x - this.r, height - border, 2 * this.r, this.thickness);
        ctxFg.rect(border - this.thickness, this.y - this.r, this.thickness, 2 * this.r);
        ctxFg.rect(width - border, this.y - this.r, this.thickness, 2 * this.r);
        ctxFg.fill();
    }
};
 
window.requestAF = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;
 
function setSizeAndDrawBackground() {
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
 
    var kX = newWidth / width;
    var kY = newHeight / height;
 
    mousePos.x *= kX;
    mousePos.y *= kY;
 
    ball.x *= kX;
    ball.y *= kY;
 
    walls.x *= kX;
    walls.y *= kY;
 
    fg.width = newWidth;
    fg.height = newHeight;
 
    bg.width = newWidth;
    bg.height = newHeight;
 
    width = newWidth;
    height = newHeight;
 
    drawBg();
}
 
function drawBg() {
    var radius = Math.sqrt(width * width + height * height) / 2;
    var radGrad = ctxBg.createRadialGradient(width / 3, height / 3, 20, width / 2, height / 2, radius);
    radGrad.addColorStop(0.0, "lightyellow");
    radGrad.addColorStop(0.5, "lightblue");
    radGrad.addColorStop(1.0, "lightgray");
 
    ctxBg.beginPath();
    ctxBg.lineWidth = 2 * border;
    ctxBg.strokeStyle = "red";
    ctxBg.fillStyle = radGrad;
    ctxBg.rect(0, 0, width, height);
    ctxBg.fill();
    ctxBg.stroke();
}
 
function detectCollision(wX1, wY1, wX2, wY2, oldX, oldY, newX, newY) {
    var det = (newY - oldY) * (wX1 - wX2) - (newX - oldX) * (wY1 - wY2);
    if (det == 0) return false;
    var t = newX * (oldY - wY1) - newY * (oldX - wX1) + oldX * wY1 - oldY * wX1;
    t /= det;
    return 0 <= t && t <= 1;
}
 
function processCollisions(newPos) {
    var b = border + ball.r;
    var was;
 
    do {
        was = false;
        if (newPos.x <= b)
            if (detectCollision(b, walls.y - walls.r, b, walls.y + walls.r, ball.x, ball.y, newPos.x, newPos.y)) {
                playSoundPong();
                newPos.x = 2 * b - newPos.x;
                ball.vx *= -1;
                walls.reduce();
                was = true;
            }
            else return true;
 
        if (newPos.y >= height - b)
            if (detectCollision(walls.x - walls.r, height - b, walls.x + walls.r, height - b, ball.x, ball.y, newPos.x, newPos.y)) {
                playSoundPong();
                newPos.y = 2 * (height - b) - newPos.y;
                ball.vy *= -1;
                walls.reduce();
                was = true;
            }
            else return true;
 
        if (newPos.x >= width - b)
            if (detectCollision(width - b, walls.y - walls.r, width - b, walls.y + walls.r, ball.x, ball.y, newPos.x, newPos.y)) {
                playSoundPong();
                newPos.x = 2 * (width - b) - newPos.x;
                ball.vx *= -1;
                walls.reduce();
                was = true;
            }
            else return true;
 
        if (newPos.y <= b)
            if (detectCollision(walls.x - walls.r, b, walls.x + walls.r, b, ball.x, ball.y, newPos.x, newPos.y)) {
                playSoundPong();
                newPos.y = 2 * b - newPos.y;
                ball.vy *= -1;
                walls.reduce();
                was = true;
            }
            else return true;
    } while (was);
 
    return false;
}
 
var delta;
function update() {
    var now = new Date();
    delta = (now - lastUpdate) / 1000;
    lastUpdate = now;
 
    walls.x = mousePos.x;
    walls.y = mousePos.y;
 
    var newPos = {x: ball.x + ball.vx * delta, y: ball.y + ball.vy * delta};
 
    var miss = processCollisions(newPos);
 
    ctxFg.clearRect(ball.x - ball.r - 3, ball.y - ball.r - 3, 2 * ball.r + 6, 2 * ball.r + 6);
    ball.x = newPos.x;
    ball.y = newPos.y;
 
    return miss;
}
 
function drawFg() {
    ctxFg.clearRect(0, border - walls.thickness, width, walls.thickness);
    ctxFg.clearRect(0, height - border, width, walls.thickness);
    ctxFg.clearRect(border - walls.thickness, 0, walls.thickness, height);
    ctxFg.clearRect(width - border, 0, walls.thickness, height);
    walls.draw();
    ball.draw();
}
 
function frame() {
    var miss = update();
    drawFg();
    if (miss) {
        playSoundSplash();
        return;
    }
    requestID = window.requestAF(frame);
}
 
function playSoundSplash() {
    splash.currentTime = 0;
    splash.play();
}
 
function playSoundPong() {
    pongs[pongIdx].currentTime = 0;
    pongs[pongIdx].play();
    pongIdx++;
    if (pongIdx == pongs.length) pongIdx = 0;
}
 
function start() {
    for (pongIdx = 0; pongIdx < 6; pongIdx++) {
        pongs[pongIdx] = document.getElementById("pong" + pongIdx);
        pongs[pongIdx].load();
    }
    pongIdx = 0;
 
    splash.load();
 
    ctxFg = fg.getContext("2d");
    ctxBg = bg.getContext("2d");
 
    setSizeAndDrawBackground();
 
    mousePos.x = width / 2;
    mousePos.y = height / 2;
    walls.init();
    ball.init();
 
    fg.addEventListener("mousemove", function (ev) {
        mousePos.x = ev.pageX;
        mousePos.y = ev.pageY;
    }, true);
 
    window.addEventListener("resize", setSizeAndDrawBackground, false);
    window.addEventListener("orientationchange", setSizeAndDrawBackground, false);
 
    lastUpdate = new Date();
    requestID = window.requestAF(frame);
}