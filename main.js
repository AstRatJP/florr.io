let text0 = "";
let text1 = "";
let text2 = "To Do: Fix collisions, Allow Basic to take damages.";
let text3 = "made by AstRatJP";
let text4 = "ver1.1.2";
let mode = 2;

let rotateAngle = 0;
let bounceArg = 0;
let slower = 0;
let nowRadius = 100;

function updateRadius(target, goal) {
    target += bounceArg;
    const newBounce = (goal - target) * 0.09 + (bounceArg * 0.69);
    return {
        radius: target,
        bounce: newBounce
    };
}

class Game {
    constructor(circleCount, radius) {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.numWhiteCircles = 30;
        this.circleRadius = 33;
        this.basicRadius = 13;

        this.circleCount = circleCount;
        this.radius = radius;

        this.border = 4;
        this.rotationSpeed = 0.02;
        this.rotation = 0;
        this.expandSpeed = 3;
        this.gridSize = 60;
        this.gridColor = '#000000';
        this.groundSpeedX = 0;
        this.groundSpeedY = 0;
        this.vX = 0;
        this.vY = 0;
        this.groundSpeedBoost = 1;
        this.groundSize = 2000;
        this.groundX = 0;
        this.groundY = 0;
        this.enemyX = -600;
        this.enemyY = -400;
        this.enemySpeed = 6;
        this.enemyRadius = 60;
        this.enemyDamage = 24;
        this.playerMaxHP = 100;
        this.enemyMaxHP = 5000;
        this.playerHP = this.playerMaxHP;
        this.enemyHP = this.enemyMaxHP;
        this.playerDamage = 4;
        this.basicDamage = 12;
        this.isPlayerDamaged = false;
        this.isEnemyDamaged = false;
        this.keys = {};
        this.isLeftClick = false;
        this.isRightClick = false;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.backgroundColor = '#1B9657';
        this.resize = function () {
            this.canvas.width = window.innerWidth * window.devicePixelRatio;
            this.canvas.height = window.innerHeight * window.devicePixelRatio;

            this.canvas.style.width = window.innerWidth + "px";
            this.canvas.style.height = window.innerHeight + "px";

            this.centerX = this.canvas.width / 2;
            this.centerY = this.canvas.height / 2;
        }

        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });

        this.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        this.canvas.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                this.isLeftClick = true;
            } else if (event.button === 2) {
                this.isRightClick = true;
            }
        });

        this.canvas.addEventListener('mouseup', (event) => {
            if (event.button === 0) {
                this.isLeftClick = false;
            } else if (event.button === 2) {
                this.isRightClick = false;
            }
        });

        this.draw = this.draw.bind(this);
        requestAnimationFrame(this.draw);
    }

    update() {
        if (this.playerHP > 0) {
            // Update player position based on key inputs
            if (this.keys['a'] || this.keys['ArrowLeft']) {
                this.groundSpeedX += 0.6;
                this.vX += 0.1;
            }
            if (this.keys['d'] || this.keys['ArrowRight']) {
                this.groundSpeedX -= 0.6;
                this.vX -= 0.1;
            }
            if (this.keys['s'] || this.keys['ArrowDown']) {
                this.groundSpeedY -= 0.6;
                this.vY -= 0.1;
            }
            if (this.keys['w'] || this.keys['ArrowUp']) {
                this.groundSpeedY += 0.6;
                this.vY += 0.1;
            }
        }


        this.angle = Math.atan2(this.vY, this.vX);

        this.groundX += this.groundSpeedX * (Math.abs(Math.cos(this.angle)));// 斜め移動のとき速さが√2倍になってしまうのを調整
        this.groundY += this.groundSpeedY * (Math.abs(Math.sin(this.angle)));
        if (this.groundX > 1000 - 30) this.groundX -= this.groundSpeedX * Math.abs(Math.cos(this.angle));
        if (this.groundX < -1000 + 30) this.groundX -= this.groundSpeedX * Math.abs(Math.cos(this.angle));
        if (this.groundY > 1000 - 30) this.groundY -= this.groundSpeedY * Math.abs(Math.sin(this.angle));
        if (this.groundY < -1000 + 30) this.groundY -= this.groundSpeedY * Math.abs(Math.sin(this.angle));



        // 摩擦
        this.groundSpeedX *= 0.9;
        this.groundSpeedY *= 0.9;
        this.vX *= 0.9;
        this.vY *= 0.9;

        // Check for game over condition
        if (this.playerHP <= 0) {
            this.gameOver();
        }
        this.resize();
    }

    draw() {
        this.update();

        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // groundSize += 0.1;
        this.numGridX = Math.floor(this.groundSize / 30);
        this.numGridY = Math.floor(this.groundSize / 30);

        // 地面を描画
        this.context.fillStyle = '#1EA761';
        this.context.fillRect(this.groundX + (this.canvas.width - this.groundSize) / 2, this.groundY + (this.canvas.height - this.groundSize) / 2, this.groundSize, this.groundSize);

        // グリッドを描画
        for (let i = 0; i < this.numGridX * 2 + 35; i++) {
            for (let j = 0; j < this.numGridY * 2 + 20; j++) {
                const x = i * this.gridSize + this.groundX + this.canvas.width / 2 - this.numGridX * 30 - 525;
                const y = j * this.gridSize + this.groundY + this.canvas.height / 2 - this.numGridY * 30 - 315;
                this.context.strokeStyle = this.gridColor;
                this.context.lineWidth = 0.03;
                this.context.strokeRect(x, y, this.gridSize, this.gridSize);
            }
        }


        if (this.playerHP > 0) {
        // flower hpバー
        this.context.strokeStyle = '#222222';
        this.context.lineWidth = 10;
        this.context.lineCap = "round";
        this.context.beginPath();
        this.context.moveTo(this.centerX - 40, this.centerY + 56);
        this.context.lineTo(this.centerX + 40, this.centerY + 56);
        this.context.stroke();

        this.context.strokeStyle = '#75DD34';
        this.context.lineWidth = 7;
        this.context.lineCap = "round";
        this.context.beginPath();
        this.context.moveTo(this.centerX - 40, this.centerY + 56);
        this.context.lineTo(this.centerX - 40 + this.playerHP * 80 / this.playerMaxHP, this.centerY + 56);
        if (this.playerHP > 0) this.context.stroke();

        if (this.playerHP < 100) {
            this.playerHP += 0.005;
        }

        // basic
        for (var i = 0; i < this.circleCount; i++) {
            var rotateAngle2 = (Math.PI * 2 * i) / this.circleCount + rotateAngle;
            this.x = this.centerX + Math.cos(rotateAngle2) * this.radius;
            this.y = this.centerY + Math.sin(rotateAngle2) * this.radius;

            this.context.beginPath();
            this.context.arc(this.x, this.y, this.basicRadius, 0, Math.PI * 2);
            this.context.fillStyle = "#CFCFCF";
            this.context.fill();
            this.context.closePath();

            this.context.beginPath();
            this.context.arc(this.x, this.y, this.basicRadius - this.border, 0, Math.PI * 2);
            this.context.fillStyle = "#FFFFFF";
            this.context.fill();
            this.context.closePath();
            if (this.checkCollision(this.centerX + this.groundX + this.enemyX, this.centerY + this.groundY + this.enemyY, this.enemyRadius - 3, this.x, this.y, this.basicRadius)) {
                this.isEnemyDamaged = true;
                this.context.fillStyle = "rgba(255, 0, 0, 0.4)";
                this.context.beginPath();
                this.context.arc(this.x, this.y, this.basicRadius, 0, Math.PI * 2);
                this.context.closePath();
                this.context.fill();
                this.enemyHP -= this.basicDamage;
                console.log("敵と白い球が衝突しました");
            }


        }

        rotateAngle += 0.03;

        slower++;

        if (this.isLeftClick) {
            nowRadius = 155;
        } else {
            if (this.isRightClick) {
                nowRadius = 50;
            } else {
                nowRadius = 80;
            }
        }


        if (slower % 2 == 0) {
            const updatedValues = updateRadius(this.radius, nowRadius);
            this.radius = updatedValues.radius;
            bounceArg = updatedValues.bounce;
        }

            // flowerを描画
            this.context.fillStyle = '#CFBB50';
            this.context.beginPath();
            this.context.arc(this.canvas.width / 2, this.centerY, this.circleRadius, 0, Math.PI * 2);
            this.context.closePath();
            this.context.fill();

            this.context.fillStyle = '#FFE763';
            this.context.beginPath();
            this.context.arc(this.centerX, this.centerY, this.circleRadius - this.border, 0, Math.PI * 2);
            this.context.closePath();
            this.context.fill();

            // 黒目
            this.context.fillStyle = '#222222';
            this.context.beginPath();
            this.context.ellipse(this.centerX - this.circleRadius * 0.25, this.centerY - this.circleRadius * 0.17, this.circleRadius * 0.13, this.circleRadius * 0.24, 0, 0, Math.PI * 2);
            this.context.ellipse(this.centerX + this.circleRadius * 0.25, this.centerY - this.circleRadius * 0.17, this.circleRadius * 0.13, this.circleRadius * 0.24, 0, 0, Math.PI * 2);
            this.context.closePath();
            this.context.fill();

            // 白目
            this.context.fillStyle = '#EFEFEF';
            this.context.beginPath();
            this.context.arc(this.centerX - this.circleRadius * 0.25 - Math.cos(this.angle), this.centerY - this.circleRadius * 0.17 - 3.5 * Math.sin(this.angle), this.circleRadius * 0.09, 0, Math.PI * 2);
            this.context.arc(this.centerX + this.circleRadius * 0.25 - Math.cos(this.angle), this.centerY - this.circleRadius * 0.17 - 3.5 * Math.sin(this.angle), this.circleRadius * 0.09, 0, Math.PI * 2);
            this.context.closePath();
            this.context.fill();

            // まぶた
            if (this.isLeftClick) {
                this.context.strokeStyle = '#FFE763';
                this.context.lineWidth = 4;
                this.context.beginPath();
                this.context.moveTo(this.centerX - this.circleRadius * 0.45, this.centerY - this.circleRadius * 0.5);
                this.context.lineTo(this.centerX, this.centerY - this.circleRadius * 0.23)
                this.context.lineTo(this.centerX + this.circleRadius * 0.45, this.centerY - this.circleRadius * 0.5);
                this.context.closePath();
                this.context.stroke();
            }

            // 口
            this.context.strokeStyle = '#222222';
            this.context.lineWidth = 1.5;
            this.context.lineCap = "round";
            this.context.beginPath();
            if (this.isLeftClick) {
                this.context.ellipse(this.centerX, this.centerY + this.circleRadius * 0.58, this.circleRadius * 0.3, this.circleRadius * 0.3, Math.PI, Math.PI * 0.2, Math.PI * 0.8);
            } else {
                if (this.isRightClick) {
                    this.context.ellipse(this.centerX, this.centerY + this.circleRadius * 0.46, this.circleRadius * 0.3, this.circleRadius * 0.12, Math.PI, Math.PI * 0.2, Math.PI * 0.8);
                } else {
                    this.context.ellipse(this.centerX, this.centerY + this.circleRadius * 0.21, this.circleRadius * 0.3, this.circleRadius * 0.25, 0, Math.PI * 0.2, Math.PI * 0.8);
                }
            }
            this.context.stroke();

            if (this.isPlayerDamaged) {
                this.playerHP -= this.enemyDamage;
                this.groundSpeedX -= (7 * (this.dx / this.distance));
                this.groundSpeedY -= (7 * (this.dy / this.distance));
                this.context.fillStyle = "rgba(255, 0, 0, 0.4)";
                this.context.beginPath();
                this.context.arc(this.centerX, this.centerY, this.circleRadius, 0, Math.PI * 2);
                this.context.closePath();
                this.context.fill();
            }


        }

        // 白い球を描画
        // const whiteCircleRadius = 5;
        // const angleIncrement = (Math.PI * 2) / this.numWhiteCircles;

        // for (let i = 0; i < this.numWhiteCircles; i++) {
        //   const angle = this.rotation + i * angleIncrement;
        //   const x = this.centerX + Math.cos(angle) * (this.circleRadius + this.rotationRadius);
        //   const y = this.centerY + Math.sin(angle) * (this.circleRadius + this.rotationRadius);

        //     if (checkCollision(this.groundX + this.enemyX, this.groundY + this.enemyY, 30, x, y, whiteCircleRadius)) {
        //         this.isEnemyDamaged = true;
        //         this.context.fillStyle = "rgba(255, 255, 255, 0.4)";
        //         this.context.beginPath();
        //         this.context.arc(x, y, whiteCircleRadius, 0, Math.PI * 2);
        //         this.context.closePath();
        //         this.context.fill();
        //         this.enemyHP -= this.lightDamage;
        //         this.console.log("敵と白い球が衝突しました");
        //         continue;
        //     }

        //     this.context.fillStyle = '#CFCFCF';
        //     this.context.beginPath();
        //     this.context.arc(x, y, whiteCircleRadius, 0, Math.PI * 2);
        //     this.context.closePath();
        //     this.context.fill();

        //     this.context.fillStyle = 'white';
        //     this.context.beginPath();
        //     this.context.arc(x, y, whiteCircleRadius - this.border, 0, Math.PI * 2);
        //     this.context.closePath();
        //     this.context.fill();
        // }

        if (this.enemyHP > 0) {
            // 敵を描画
            this.context.fillStyle = '#FF0000';
            this.context.beginPath();
            this.context.arc(this.centerX + this.groundX + this.enemyX, this.centerY + this.groundY + this.enemyY, this.enemyRadius, 0, Math.PI * 2);
            this.context.closePath();
            this.context.fill();

            this.context.fillStyle = '#FF6347';
            this.context.beginPath();
            this.context.arc(this.centerX + this.groundX + this.enemyX, this.centerY + this.groundY + this.enemyY, this.enemyRadius - this.border, 0, Math.PI * 2);
            this.context.closePath();
            this.context.fill();

            this.context.strokeStyle = '#222222';
            this.context.lineWidth = 10;
            this.context.lineCap = "round";
            this.context.beginPath();
            this.context.moveTo(this.centerX + this.groundX + this.enemyX - 60, this.centerY + this.groundY + this.enemyY + 84);
            this.context.lineTo(this.centerX + this.groundX + this.enemyX + 60, this.centerY + this.groundY + this.enemyY + 84);
            this.context.stroke();

            this.context.strokeStyle = '#75DD34';
            this.context.lineWidth = 7;
            this.context.lineCap = "round";
            this.context.beginPath();
            this.context.moveTo(this.centerX + this.groundX + this.enemyX - 60, this.centerY + this.groundY + this.enemyY + 84);
            this.context.lineTo(this.centerX + this.groundX + this.enemyX - 60 + this.enemyHP * 120 / this.enemyMaxHP, this.centerY + this.groundY + this.enemyY + 84);
            this.context.stroke();

            if (this.isEnemyDamaged) {
                this.context.fillStyle = "rgba(255, 255, 255, 0.4)";
                this.context.beginPath();
                this.context.arc(this.centerX + this.groundX + this.enemyX, this.centerY + this.groundY + this.enemyY, this.enemyRadius, 0, Math.PI * 2);
                this.context.closePath();
                this.context.fill();
            }
            if (this.playerHP > 0) {
                // 自分と敵の位置の差を計算
                this.dx = this.centerX - (this.centerX + this.groundX + this.enemyX);
                this.dy = this.centerY - (this.centerY + this.groundY + this.enemyY);

                // 差を正規化して移動量を計算
                this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
                this.ax = (this.dx / this.distance) * this.enemySpeed;
                this.ay = (this.dy / this.distance) * this.enemySpeed;
                this.vx = 0;
                this.vy = 0;
                this.vx += this.ax;
                this.vy += this.ay;
                this.vx *= 0.9;
                this.vy *= 0.9;
                this.enemyX += this.vx;
                this.enemyY += this.vy;

                const collision = this.checkCollision(
                    this.centerX + this.groundX + this.enemyX, this.centerY + this.groundY + this.enemyY, this.enemyRadius - 3,// 3は「許容範囲」
                    this.centerX, this.centerY, this.circleRadius,
                );
                if (collision) {
                    this.isPlayerDamaged = true;
                    this.isEnemyDamaged = true;
                    this.enemyHP -= this.playerDamage;
                    this.enemyX -= 1 * this.vx;
                    this.enemyY -= 1 * this.vy;
                } else {
                    this.isPlayerDamaged = false;
                    this.isEnemyDamaged = false;
                }

            }

        } else {
            this.enemyX = undefined;
            this.enemyY = undefined;
        }

        if (text0 == "You were destroyed by:") {
            this.context.fillStyle = "rgba(0, 0, 0, 0.3)";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // 数値を描画
        this.context.fillStyle = '#000000';
        this.context.font = '22px Roboto medium';
        this.context.textAlign = "left";
        this.context.textBaseline = 'top';
        this.context.fillText(`${text2}`, 30, 30);
        this.context.fillText(`${text3}`, 30, 60);
        this.context.fillText(`${text4}`, 30, 90);

        this.context.fillStyle = '#EEEEEE';
        this.context.font = 'bold 25px Roboto medium';
        this.context.textAlign = "center";
        this.context.textBaseline = 'middle';
        this.context.fillText(`${text0}`, this.centerX, this.centerY-120);
        this.context.strokeStyle = '#222222';
        this.context.lineWidth = 0.6;
        this.context.font = 'bold 25px Roboto medium';
        this.context.strokeText(`${text0}`, this.centerX, this.centerY-120);

        this.context.fillStyle = '#EEEEEE';
        this.context.font = 'bold 40px Roboto medium';
        this.context.textAlign = "center";
        this.context.textBaseline = 'middle';
        this.context.fillText(`${text1}`, this.centerX, this.centerY-80);
        this.context.strokeStyle = '#222222';
        this.context.lineWidth = 1;
        this.context.font = 'bold 40px Roboto medium';
        this.context.strokeText(`${text1}`, this.centerX, this.centerY-80);

        // const collision = this.checkCollision(
        //     this.centerX + this.groundX + this.enemyX, this.centerY + this.groundY + this.enemyY, this.enemyRadius - 3,// 3は「許容範囲」
        //     this.centerX, this.centerY, this.circleRadius,
        // );
        // if (collision) {
        //     this.isPlayerDamaged = true;
        //     this.isEnemyDamaged = true;
        //     this.enemyHP -= this.playerDamage;
        //     this.enemyX -= 1 * this.vx;
        //     this.enemyY -= 1 * this.vy;
        // } else {
        //     this.isPlayerDamaged = false;
        //     this.isEnemyDamaged = false;
        // }

        requestAnimationFrame(() => this.draw());
    }

    checkCollision(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= r1 + r2;
    }

    gameOver() {
        text0 = "You were destroyed by:";
        text1 = "Enemy"
    }
}


const game = new Game(5, 0);
// game.start();
