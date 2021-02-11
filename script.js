const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
const enemiesData = [];
const spawnEnemies = () => {
  setInterval(() => {
    const radius = Math.random() * (30 - 10) + 10;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;

      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = `hsl(${Math.random() * 360},50%,50%)`;
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemiesData.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
};

const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 10, "white");

const projectilesData = [];
addEventListener("click", (e) => {
  const angle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angle) * 4,
    y: Math.sin(angle) * 4,
  };
  projectilesData.push(new Projectile(x, y, 5, "white", velocity));
});
let animationId;
const animate = () => {
  animationId = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  //remove from edges of screen
  projectilesData.forEach((projectil, index) => {
    projectil.update();
    if (
      projectil.x + projectil.radius < 0 ||
      projectil.x - projectil.radius > canvas.width ||
      projectil + projectil.radius < 0 ||
      projectil.y - projectil.radius > canvas.height
    ) {
      setTimeout(() => {
        projectilesData.splice(index, 1);
      }, 0);
    }
  });

  enemiesData.forEach((enemies, index) => {
    enemies.update();
    let dist = Math.hypot(player.x - enemies.x, player.y - enemies.y);
    //end game
    if (dist - enemies.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
    }
    projectilesData.forEach((projectile, projectileIndex) => {
      let c1 = projectile.x - enemies.x;
      let c2 = projectile.y - enemies.y;
      let dist = Math.hypot(c1, c2);
      //   objects Touch
      if (dist - enemies.radius - projectile.radius < 1) {
        {
          setTimeout(() => {
            ///fix the pop up
            enemiesData.splice(index, 1);
            projectilesData.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
};
animate();
spawnEnemies();