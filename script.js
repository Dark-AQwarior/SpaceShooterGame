let gameBackground = new Image();
gameBackground.src = "images/space.jpg";
let spaceShip = new Image();
spaceShip.src = "images/spaceship.png";
let missile = new Image();
missile.src = "images/missile.png";
let alienShip = new Image();
alienShip.src = "images/enemy.png";

let boom = new Image();
boom.src = "images/boom.png";

let shipDestroyed = new Audio('audio/shipDestroyed.mp3');
let shootSound = new Audio('audio/shoot.mp3');
let gameBGM = new Audio('audio/gameBGM.mp3');
let livesOver = new Audio('audio/livesOver.wav');

gameBGM.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

function canvasStart() {
    let canvasElement = document.getElementById("canvas").getContext('2d');
    let cW = canvasElement.canvas.width;
    let cH = canvasElement.canvas.height;

    document.getElementById("canvas").focus();
    let gameOver = false;
    let shootingTarget = 0;
    let spaceHit = false;
    let level = 1;
    let lives = 3;
    let highScore = 0;
    let counter = 0;

    function Background() {
        this.x = 0;
        this.y = 0;
        this.w = gameBackground.width;
        this.h = gameBackground.height;
        this.render = function() {
            canvasElement.drawImage(gameBackground, this.x -= 2, 0);
            if (this.x <= -499) {
                this.x = 0;
            }
        }
    }

    function spaceShipAnimation() {
        this.x = 20;
        this.y = cH / 2 - 50;
        this.w = 100;
        this.h = 100;
        this.missiles = [];
        this.render = function() {
            canvasElement.drawImage(spaceShip, this.x, this.y, this.w, this.h);
        }

        this.hitDetect = function(missItem, missIndex) {
            enemyList.forEach((item, index, alienShipArray) => {
                if (missItem.x + missItem.w >= item.x && missItem.x <= item.x + item.w && missItem.y >= item.y && missItem.y <= item.y + item.h) {
                    alienShipArray.splice(index, 1);
                    this.missiles.splice(missIndex, 1);
                    counter++;
                    shipDestroyed.play();
                    canvasElement.drawImage(boom, item.x - 30, item.y, 100, 100);
                }
            });
        }
    }

    function Missile(sX, sY) {
        this.x = sX - 30;
        this.y = sY - 7;
        this.w = 40;
        this.h = 15;
        this.render = function() {
            canvasElement.drawImage(missile, this.x += 10, this.y, this.w, this.h);
        }

    }

    function Enemy() {
        this.x = cW;
        this.y = Math.floor(Math.random() * (cH - 80));
        this.w = 80;
        this.h = 80;

        this.render = function() {
            canvasElement.drawImage(alienShip, this.x -= (level + 5), this.y, this.w, this.h);
        }
    }

    function shoot() {
        if (spaceHit && (shootingTarget == 1)) {
            setTimeout(() => {
                shootSound.play();
                player.missiles.push(new Missile(player.x + player.w, player.y + (player.h / 2)));
                shootingTarget = 0;
            }, 300);
        }

    }

    let background = new Background();
    let player = new spaceShipAnimation();
    let playerRate = level + 4;

    let enemyList = [];
    let moveUp = false;
    let moveDown = false;

    function animate() {
        if (gameOver) {
            canvasElement.font = "bold 72px Arial, sans-serif";
            canvasElement.fillStyle = "#c0392b";
            canvasElement.fillText("GAME OVER !!!", cW / 2 - (78 * 3), cH / 2);
            canvasElement.font = "25px cursive";
            canvasElement.fillStyle = "#F8F8FF";
            canvasElement.fillText("Press Space to Play Again", cW / 2 - (27 * 5), cH / 2 + 90);

            document.addEventListener('keydown', function spaceKeyPress(event) {
                let key = event.keyCode;
                if (key == 32) {
                    canvasElement.clearRect(0, 0, cW, cH);
                    counter = 0;
                    lives = 3;
                    player.missiles = [];
                    enemyList = [];
                    gameOver = false;
                    document.removeEventListener('keydown', spaceKeyPress);
                    gameBGM.play();
                }
            });

            return;
        }

        canvasElement.save();
        canvasElement.clearRect(0, 0, cW, cH);
        background.render();

        player.render();

        enemyList.forEach(function(item, index, alienShipArray) {
            item.render();
            if (item.x <= -item.w) {
                alienShipArray.splice(index, 1)
            }

            if (item.x + item.w >= player.x && item.x <= player.x + player.w && item.y >= player.y && item.y <= player.y + player.h) {
                if (lives == 1) {
                    shipDestroyed.play();
                    canvasElement.drawImage(boom, item.x - 30, item.y, 100, 100);
                    if (counter > highScore) {
                        highScore = counter;
                    }
                    gameOver = true;
                } else {
                    livesOver.play();
                    alienShipArray.splice(index, 1);
                }
                lives--;
            }

        });

        player.missiles.forEach(function(item, index, allMissilesArray) {
            item.render();
            if (item.x >= cW) {
                allMissilesArray.splice(index, 1)
            }
            player.hitDetect(item, index);
        });

        canvasElement.font = "15px Arial, sans-serif";
        canvasElement.fillStyle = "#fff";
        canvasElement.fillText("Score: " + counter, 100, 30);

        canvasElement.font = "15px Arial, sans-serif";
        canvasElement.fillStyle = "#fff";
        canvasElement.fillText("Highscore: " + highScore, 890, 30);

        canvasElement.font = "15px Arial, sans-serif";
        canvasElement.fillStyle = "#fff";
        canvasElement.fillText("Lives: " + lives, 20, 30);

        level = Math.floor(counter / 5) + 1;
        canvasElement.font = "15px Arial, sans-serif";
        canvasElement.fillStyle = "#fff";
        canvasElement.fillText("Level: " + level, 20, 55);

        playerRate = level + 4;
        if (moveUp) {
            player.y -= playerRate;
            console.log(playerRate);
        }

        if (moveDown) {
            player.y += playerRate;
        }

        canvasElement.restore();
    };

    let rate = 2000 - level * 100;
    let timOut = setTimeout(function mvenm() {
        rate = 2000 - level * 100;
        enemyList.push(new Enemy());
        timeOut = setTimeout(mvenm, rate);
    }, 100);




    if (!gameOver) {
        let animateInterval = setInterval(animate, 50);
    }

    document.addEventListener('keydown', function(event) {
        let key = event.keyCode;
        if (key == 38) {
            if (player.y >= 0) {
                moveUp = true;
            } else {
                moveUp = false;
            }
        }
        if (key == 40) {
            if (player.y >= (cH - player.h)) {
                moveDown = false;
            } else {
                moveDown = true;
            }
        }
        if (key == 32) {
            spaceHit = true;
            shootingTarget += 1;
            shoot();
        }
    });

    document.addEventListener('keyup', function(event) {
        let key = event.keyCode;
        if (key == 38) {
            moveUp = false;
        }
        if (key == 40) {
            moveDown = false;
        }
        if (key == 32) {
            spaceHit = false;
            shoot();
        }
    });

}

function mainLoadingPage() {
    let canvasElement = document.getElementById("canvas").getContext('2d');
    let cW = canvasElement.canvas.width;
    let cH = canvasElement.canvas.height;

    canvasElement.drawImage(gameBackground, 0, 0);
    canvasElement.font = "bold 35px cursive";
    canvasElement.fillStyle = "#FFF5EE";
    canvasElement.fillText("Press Space to Start", cW / 3, cH / 2);

    document.addEventListener('keydown', function spaceKeyPress(event) {
        let key = event.keyCode;
        if (key == 32) {
            canvasElement.clearRect(0, 0, cW, cH);
            document.removeEventListener('keydown', spaceKeyPress);
            canvasStart();
            gameBGM.play();
        }
    });
}

window.addEventListener('load', function(event) {
    mainLoadingPage();

});