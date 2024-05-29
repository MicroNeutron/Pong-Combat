let startButton;
let ballX, ballY; // 球坐标
let ballSize = 20; // 球大小
let ballSpeedX, ballSpeedY; // 球速度
let playerX, playerY; // 玩家坐标
let paddle = 40; // 玩家大小
let mobX, mobY; // 敌人坐标
let mobSize = 80; // 敌人大小
let mobSpeed; // 敌人速度
let isCharging = false; // 是否蓄力
let chargeAmount = 0; // 蓄力程度
let friction = 0.998; // 减速系数
let hp = 100; // 玩家血量
let mobhp = 100; // 敌人血量
let chargeDisplay;
let dmg;
let gameStarted = false; //游戏状态：未开始
let killed;
let mobhpDisplay;
let diff;

function setup() {
  createCanvas(windowWidth - 40, windowHeight - 40);

  ballX = width / 4;
  ballY = height / 4;
  ballSpeedX = 5; // 初始速度
  ballSpeedY = 5;
  playerX = width / 2;
  playerY = height / 2 - paddle / 2; // 初始玩家位置
  mobX = width;
  mobY = height / 2; // 初始敌人位置
  mobSpeed = 1
  killed = 0
}

function mouseClicked() {
  if (!gameStarted && mouseButton === LEFT) { // 检测：未开始
    gameStarted = true; // 开始
    console.log("开始");
  } else if (gameStarted && hp <= 0) { // 死亡
    //resetGame(); // 重启游戏
    text("GameOver", 20, 200);
  }
}

function draw() {
  if (!gameStarted) { // 没开始直接退
    textSize(72);
    text("PONG COMBAT", 100, 100);
    text("Click Anywhere to Start", 100, 200);
    return;
  }

    // 这里放背景填充的代码
    background(0); // 背景

    // 绘制玩家
    fill(255, 0, 0);
    circle(playerX, playerY, paddle);

    // 绘制乒乓球
    fill(255);
    ellipse(ballX, ballY, ballSize);

    // 绘制敌人
    fill(0, 0, 255);
    circle(mobX, mobY, mobSize);

    // 更新球的位置
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // 敌人动作：横向
    if (mobX < playerX) {
      mobX += mobSpeed;
    } else {
      mobX -= mobSpeed;
    }

    // 敌人动作：竖向
    if (mobY < playerY) {
      mobY += mobSpeed;
    } else {
      mobY -= mobSpeed;
    }

    // 减速
    ballSpeedX *= friction;
    ballSpeedY *= friction;

    // 边墙碰撞检测
    if (ballY <= 0 || ballY >= height) {
      ballSpeedY *= -1; // 反弹
    }
    if (ballX <= 0 || ballX >= width) {
      ballSpeedX *= -1; // 反弹
    }

    // 防撞
    if (playerX <= 0) {
      playerX = 0;
    }

    if (playerX >= width) {
      playerX = width;
    }

    if (playerY <= 0) {
      playerY = 0;
    }

    if (playerY >= height) {
      playerY = height;
    }

    if (ballX <= 0) {
      ballX = 0;
    }

    if (ballX >= width) {
      ballX = width;
    }

    if (ballY <= 0) {
      ballY = 0;
    }

    if (ballY >= height) {
      ballY = height;
    }

    // 控制
    if (keyIsDown(87)) {
      // W 键向上移动
      playerY -= 10;
    }
    if (keyIsDown(83)) {
      // S 键向下移动
      playerY += 10;
    }
    if (keyIsDown(65)) {
      // A 键向左移动
      playerX -= 10;
    }
    if (keyIsDown(68)) {
      // D 键向下移动
      playerX += 10;
    }

    // 蓄力系统
    if (keyIsDown(32)) {
      isCharging = true; // 空格 蓄力
      chargeAmount += 0.1; // 增加蓄力值
      if (chargeAmount > 9) {
        chargeAmount = 9; // 上限
      }
    }

    if (playerX + 40 > ballX && playerX - 40 < ballX && playerY + 40 > ballY && playerY - 40 < ballY) {
      if (ballX < playerX - 40 || ballX > playerX + 40) {
        ballSpeedX *= -1; // 反弹
      } else {
        ballSpeedY *= -1;
      }
      ballSpeedX += chargeAmount;
      ballSpeedY += chargeAmount; // 增加蓄力
      chargeAmount = 0;
    }

    // 玩家受伤
    if (playerX + 80 > mobX && playerX - 80 < mobX && playerY + 80 > mobY && playerY - 80 < mobY) {
      hp -= 1;
    }

    // 敌人受伤
    if (ballX + 80 > mobX && ballX - 80 < mobX && ballY + 80 > mobY && ballY - 80 < mobY) {
      mobhp -= dmg *5;
    }

    // 伤害计算
    dmg = (ballSpeedY + ballSpeedX) / 2 * 0.2;
    if (dmg < 0) {
      dmg *= -1;
    }

    // 难度增加
    mobSpeed += 0.001;


    // 显示
    chargeDisplay = round(chargeAmount * 10) / 10 + 1;
    mobhpDisplay = round(mobhp);
    diff = round(mobSpeed * 100) / 100;

    // 死亡
    if (hp <= 0) {
      textSize(72);
      fill(0);
      background(255, 0, 0);
      text("GameOver", 20, 300);
      text("Killed" + " " + killed, 20, 380);
      textSize(32);
      text("Refresh to Start a New Game", 20, 450)
    }

    // 击杀
    if (mobhp <= 0) {
      mobhp = 100;
      killed += 1;
      mobX = width;
      mobY = height / 2; 
      mobSpeed = 1;
      hp += 20;
      if (hp >= 100) {
        hp = 100;
      }
    }

    // 文字
    fill(255);
    textSize(32)
    if (hp <= 0) {
      fill(255, 0, 0);    
    }
    
    text("CHARGE" + " " + chargeDisplay, 20, 40);
    text("HP" + " " + hp, 20, 80);
    text("MOB" + " " + mobhpDisplay, 20, 120);
    text("K" + " " + killed, 20, 160);
    text("Difficulty" + " " + diff, 20, 200);
}
