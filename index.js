function createImg(imgSrc) {
  let image = new Image();
  image.src = imgSrc;
  return image;
}

let platform = createImg("./img/platform.png");
let hills = createImg("./img/hills.png");

let background = createImg("./img/background.png");
let stepPlatform = createImg("./img/platformSmallTall.png");

let canvas = document.querySelector("canvas");
canvas.width = 1200;
canvas.height = 576;

let c = canvas.getContext("2d");
let gravity = 0.6;
let horizontalMotion = {
  left: { pressed: false },
  right: { pressed: false },
};
let scrollOffset = 0;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.height = 70;
    this.width = 60;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.playerImage = new Image();
    this.playerImage.src = "./img/sher.svg";
  }

  draw() {
    c.drawImage(
      this.playerImage,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      reset();
    } else {
      this.velocity.y += gravity;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.height = image.height;
    this.width = image.width;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

// A class for non game essential assets

class GenericELement {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.height = image.height;
    this.width = image.width;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

function reset() {
  platform = platform;
  player = new Player();
  platforms = [
    new Platform({ x: 0, y: 450, image: platform }),
    new Platform({ x: platform.width - 2, y: 450, image: platform }),
    new Platform({ x: platform.width * 2 + 100, y: 450, image: platform }),
    new Platform({ x: platform.width * 3 + 200, y: 450, image: platform }),
    new Platform({ x: platform.width * 4 + 700, y: 450, image: platform }),
    new Platform({ x: platform.width * 4 + 350, y: 300, image: stepPlatform }),
  ];
  genericElements = [
    new GenericELement({ x: -1, y: -1, image: background }),
    new GenericELement({ x: -1, y: -1, image: hills }),
  ];
}

// declarations for use utilizing the constructor
let player = new Player();
let platforms = [];
let genericElements = [];
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericElements.forEach((genericElement) => {
    genericElement.draw();
  });
  platforms.forEach((platform) => {
    platform.draw();
  });

  if (horizontalMotion.right.pressed && player.position.x < 600) {
    player.velocity.x = 5;
  } else if (
    scrollOffset > 0 &&
    horizontalMotion.left.pressed &&
    player.position.x > 100
  ) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    genericElements.forEach((genericEl) => {
      if (horizontalMotion.right.pressed) {
        genericEl.position.x -= 2;
      } else if (
        scrollOffset > 0 &&
        horizontalMotion.left.pressed &&
        player.position.x > 100
      ) {
        genericEl.position.x += 2;
      }
    });

    platforms.forEach((platform) => {
      if (horizontalMotion.right.pressed) {
        scrollOffset += 5;
        platform.position.x -= 5;
      } else if (player.position.x > 100 && horizontalMotion.left.pressed) {
        scrollOffset -= 5;
        platform.position.x += 5;
      }
    });

    if (scrollOffset > player.width + platform.width * 4 + 350) {
      console.log("you have won the game");
    }
  }

  //code for platform collision
  platforms.forEach((platform) => {
    if (
      player.height + player.position.y <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.width + player.position.x >= platform.position.x &&
      player.position.x <= platform.width + platform.position.x
    ) {
      player.velocity.y = 0;
    }
  });

  player.update();
}
reset();
animate();

window.addEventListener("keydown", (event) => {
  console.log(event.key);
  switch (event.key) {
    case "d":
      horizontalMotion.right.pressed = true;
      break;
    case "a":
      horizontalMotion.left.pressed = true;
      break;
    case "w":
      player.velocity.y -= 15;
      break;
    case " ":
      player.velocity.y -= 20;
    default:
      console.log("bullshit");
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      horizontalMotion.right.pressed = false;
      break;

    case "a":
      horizontalMotion.left.pressed = false;
      break;

    default:
      console.log("bullshit");
  }
});
