// Creating the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 520;
document.body.appendChild(canvas);

// Adding the background/object images
var bgReady = false
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
}
bgImage.src = "images/background.png"

var heroReady = false
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
}
heroImage.src = "images/hero.png"

var monsterReady = false
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
}
monsterImage.src = "images/monster.png"

var scarecrowReady = false
var scarecrowImage = new Image();
scarecrowImage.onload = function () {
    scarecrowReady = true;
}
scarecrowImage.src = "images/scarecrow.png"

// Game objects
var hero = {
    speed: 256,
    x: 256,
    y: 240
};
var monster = {};
var scarecrow = {
	x: 40,
	y: 40
};
var dead = 0;
var monstersCaught = 0;

// Keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Spawn new monster when old monster is caught
var reset = function () {

    monster.x = 32 + (Math.random() * (canvas.width - 96));
    monster.y = 32 + (Math.random() * (canvas.height - 96));
	scarecrow.x = 32 + (Math.random() * (canvas.width - 96));
	scarecrow.y = 32 + (Math.random() * (canvas.height - 96));
};

var gameover = function () {
    hero.x = -200;
    hero.y = -200;
    monster.x = -100;
    monster.y = -100;
};


// Update game objects
var update = function (modifier) {
    if (38 in keysDown) { // up
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown) { // down
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) { // left
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown) { // right
        hero.x += hero.speed * modifier;
    }
    if (hero.x > 512) {
        hero.x = 512;
    }
    if (hero.y > 512) {
        hero.y = 512;
    }

    // Did the hero catch a monster?
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
        reset();
    }

	// Did the hero touch a scarecrow?
    if (
        hero.x <= (scarecrow.x + 32)
        && scarecrow.x <= (hero.x + 32)
        && hero.y <= (scarecrow.y + 32)
        && scarecrow.y <= (hero.y + 32)
    ) {
		dead = 1;
        gameover();
    }
};

// Drawing everything
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }
	if (scarecrowReady) {
        ctx.drawImage(scarecrowImage, scarecrow.x, scarecrow.y);
    }
	if (dead == 1) {
		ctx.fillStyle = "rgb(250, 250, 250)";
	    ctx.font = "bold 70px arial";
	    ctx.textAlign = "center";
	    ctx.textBaseline = "center";
	    ctx.fillText("GAME OVER", 256, 200);
	}

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "bold 50px arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(monstersCaught, 256, 32);

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.font = "small-caps 20px arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("Defeat all the monsters!", 256, 500);
    ctx.fillText("Beware of the scarecrows...", 256, 520);
};

var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
