let text1 = "";
let text2 = "1, 2キーでモード切り替え";
let text3 = "";
let text4 = "初期状態に戻すなら再読み込みして下さい...";
let mode = 1;// 衝突がしっかりしてるモード

class Game {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.numWhiteCircles = 30;
        this.circleRadius = 17;
        this.baseCircleRadius = this.circleRadius;
        this.rotationRadius = 30;
        this.baseRotationRadius = this.rotationRadius;
        this.border = 2;
        this.rotationSpeed = 0.02;
        this.rotation = 0;
        this.expandSpeed = 3;
        this.gridSize = 30;
        this.gridColor = '#000000';
        this.groundSpeedX = 0;
        this.groundSpeedY = 0;
        this.vX = 0;
        this.vY = 0;
        this.groundSpeedBoost = 1;
        this.groundSize = 1000;
        this.groundX = 0;
        this.groundY = 0;
        this.enemyX = -100;
        this.enemyY = -100;
        this.enemySpeed = 1;
        this.enemyRadius = 30;
        this.enemyDamage = 6;
        this.playerMaxHP = 150;
        this.enemyMaxHP = 1000;
        this.playerHP = this.playerMaxHP;
        this.enemyHP = this.enemyMaxHP;
        this.playerDamage = 4;
        this.lightDamage = 12;
        this.isPlayerDamaged = false;
        this.isEnemyDamaged = false;
        this.keys = {};
        this.isLeftClick = false;
        this.isRightClick = false;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.backgroundColor = '#1B9657';
        this.resize = function () {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
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

        // Update player position based on key inputs
        if (this.keys['a']) {
            this.groundSpeedX += 0.05;
            this.vX += 0.05;
        }
        if (this.keys['d']) {
            this.groundSpeedX -= 0.05;
            this.vX -= 0.05;
        }
        if (this.keys['s']) {
            this.groundSpeedY -= 0.05;
            this.vY -= 0.05;
        }
        if (this.keys['w']) {
            this.groundSpeedY += 0.05;
            this.vY += 0.05;
        }




        this.angle = Math.atan2(this.vY, this.vX);

        if (this.keys['1']) {
            mode = 1;
        }
        if (this.keys['2']) {
            mode = 2;
        }

        if (mode == 1) {
            this.groundX += this.groundSpeedX;
            this.groundY += this.groundSpeedY;
            if (this.groundX > 500 - 15) this.groundX -= this.groundSpeedX;
            if (this.groundX < -500 + 15) this.groundX -= this.groundSpeedX;
            if (this.groundY > 500 - 15) this.groundY -= this.groundSpeedY;
            if (this.groundY < -500 + 15) this.groundY -= this.groundSpeedY;

            text3 = "現在のモード:1 衝突はしっかりしているが、斜め移動が速い(√2倍)"
        } else {
            this.groundX += this.groundSpeedX * (Math.abs(Math.cos(this.angle)));// 斜め移動のとき速さが√2倍になってしまうのを調整
            this.groundY += this.groundSpeedY * (Math.abs(Math.sin(this.angle)));
            if (this.groundX > 500 - 15) this.groundX -= this.groundSpeedX * Math.abs(Math.cos(this.angle));
            if (this.groundX < -500 + 15) this.groundX -= this.groundSpeedX * Math.abs(Math.cos(this.angle));
            if (this.groundY > 500 - 15) this.groundY -= this.groundSpeedY * Math.abs(Math.sin(this.angle));
            if (this.groundY < -500 + 15) this.groundY -= this.groundSpeedY * Math.abs(Math.sin(this.angle));

            text3 = "現在のモード:2 斜め移動しても速度が一定だが、衝突した時おかしい";
        }


        // text1 = this.groundSpeedX;
        // text2 = this.groundSpeedX*Math.abs(Math.cos(this.angle));


        // 摩擦
        this.groundSpeedX *= 0.955;
        this.groundSpeedY *= 0.955;
        this.vX *= 0.955;
        this.vY *= 0.955;

        // Check for game over condition
        if (this.playerHP <= 0 || this.enemyHP <= 0) {
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
                this.context.lineWidth = 0.015;
                this.context.strokeRect(x, y, this.gridSize, this.gridSize);
            }
        }

        // プレイヤーを描画
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
        this.context.ellipse(this.centerX - this.circleRadius * 0.25, this.centerY - this.circleRadius * 0.17, this.circleRadius * 0.12, this.circleRadius * 0.23, 0, 0, Math.PI * 2);
        this.context.ellipse(this.centerX + this.circleRadius * 0.25, this.centerY - this.circleRadius * 0.17, this.circleRadius * 0.12, this.circleRadius * 0.23, 0, 0, Math.PI * 2);
        this.context.closePath();
        this.context.fill();

        // 白目
        this.context.fillStyle = '#EFEFEF';
        this.context.beginPath();
        this.context.arc(this.centerX - this.circleRadius * 0.25 - Math.cos(this.angle), this.centerY - this.circleRadius * 0.17 - Math.sin(this.angle), this.circleRadius * 0.09, 0, Math.PI * 2);
        this.context.arc(this.centerX + this.circleRadius * 0.25 - Math.cos(this.angle), this.centerY - this.circleRadius * 0.17 - Math.sin(this.angle), this.circleRadius * 0.09, 0, Math.PI * 2);
        this.context.closePath();
        this.context.fill();

        // 口
        this.context.strokeStyle = '#222222';
        this.context.lineWidth = 1;
        this.context.lineCap = "round";
        this.context.beginPath();
        if (this.isRightClick) {
            if (this.isLeftClick) {
                this.context.ellipse(this.centerX, this.centerY + this.circleRadius * 0.58, this.circleRadius * 0.3, this.circleRadius * 0.28, Math.PI, Math.PI * 0.2, Math.PI * 0.8);
            } else {
                this.context.ellipse(this.centerX, this.centerY + this.circleRadius * 0.46, this.circleRadius * 0.3, this.circleRadius * 0.08, Math.PI, Math.PI * 0.2, Math.PI * 0.8);
            }
        } else {
            if (this.isLeftClick) {
                this.context.ellipse(this.centerX, this.centerY + this.circleRadius * 0.58, this.circleRadius * 0.3, this.circleRadius * 0.28, Math.PI, Math.PI * 0.2, Math.PI * 0.8);
            } else {
                this.context.ellipse(this.centerX, this.centerY + this.circleRadius * 0.21, this.circleRadius * 0.3, this.circleRadius * 0.25, 0, Math.PI * 0.2, Math.PI * 0.8);
            }
        }
        this.context.stroke();

        //hpバー
        this.context.strokeStyle = '#222222';
        this.context.lineWidth = 5.5;
        this.context.lineCap = "round";
        this.context.beginPath();
        this.context.moveTo(this.centerX - 20, this.centerY + 28);
        this.context.lineTo(this.centerX + 20, this.centerY + 28);
        this.context.stroke();

        this.context.strokeStyle = '#75DD34';
        this.context.lineWidth = 4;
        this.context.lineCap = "round";
        this.context.beginPath();
        this.context.moveTo(this.centerX - 20, this.centerY + 28);
        this.context.lineTo(this.centerX - 20 + this.playerHP * 40 / this.playerMaxHP, this.centerY + 28);
        if (this.playerHP > 0) this.context.stroke();

        if (this.isPlayerDamaged) {
            this.playerHP -= this.enemyDamage;
            this.groundSpeedX -= (1 * (this.dx / this.distance));
            this.groundSpeedY -= (1 * (this.dy / this.distance));
            this.context.fillStyle = "rgba(255, 255, 255, 0.6)";
            this.context.beginPath();
            this.context.arc(this.centerX, this.centerY, this.circleRadius, 0, Math.PI * 2);
            this.context.closePath();
            this.context.fill();
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

            // this.context.fillStyle = '#222222';
            // this.context.font = '20px Roboto medium';
            // this.context.textAlign = "center";
            // this.context.textBaseline = 'middle';
            // this.context.fillText('敵', this.centerX + this.groundX + this.enemyX, this.centerY + this.groundY + this.enemyY);

            this.context.strokeStyle = '#222222';
            this.context.lineWidth = 5.5;
            this.context.lineCap = "round";
            this.context.beginPath();
            this.context.moveTo(this.centerX + this.groundX + this.enemyX - 30, this.centerY + this.groundY + this.enemyY + 42);
            this.context.lineTo(this.centerX + this.groundX + this.enemyX + 30, this.centerY + this.groundY + this.enemyY + 42);
            this.context.stroke();

            this.context.strokeStyle = '#75DD34';
            this.context.lineWidth = 4;
            this.context.lineCap = "round";
            this.context.beginPath();
            this.context.moveTo(this.centerX + this.groundX + this.enemyX - 30, this.centerY + this.groundY + this.enemyY + 42);
            this.context.lineTo(this.centerX + this.groundX + this.enemyX - 30 + this.enemyHP * 60 / this.enemyMaxHP, this.centerY + this.groundY + this.enemyY + 42);
            if (this.enemyHP > 0) this.context.stroke();

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

            if (this.isEnemyDamaged) {
                this.enemyHP -= this.playerDamage;
                this.enemyX -= 2 * this.vx;
                this.enemyY -= 2 * this.vy;
                this.context.fillStyle = "rgba(255, 255, 255, 0.6)";
                this.context.beginPath();
                this.context.arc(this.centerX + this.groundX + this.enemyX, this.centerY + this.groundY + this.enemyY, this.enemyRadius, 0, Math.PI * 2);
                this.context.closePath();
                this.context.fill();
            }
        } else {
            this.enemyX = undefined;
            this.enemyY = undefined;
        }

        // 数値を描画
        this.context.fillStyle = '#000000';
        this.context.font = '15px Roboto medium';
        this.context.textAlign = "left";
        this.context.textBaseline = 'middle';
        this.context.fillText(`${text1}`, 20, 30);
        this.context.fillText(`${text2}`, 20, 60);
        this.context.fillText(`${text3}`, 20, 90);
        this.context.fillText(`${text4}`, 20, 120);

        const collision = this.checkCollision(
            this.centerX + this.groundX + this.enemyX, this.centerY + this.groundY + this.enemyY, this.enemyRadius - 3,// 3は「許容範囲」
            this.centerX, this.centerY, this.circleRadius,
        );
        if (collision) {
            this.isPlayerDamaged = true;
            this.isEnemyDamaged = true;
        } else {
            this.isPlayerDamaged = false;
            this.isEnemyDamaged = false;
        }

        requestAnimationFrame(() => this.draw());
    }

    checkCollision(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= r1 + r2;
    }

    gameOver() {
        text1 = "died";
    }
}


const game = new Game();
game.start();
