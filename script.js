const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("scoreEl");
const startGameBtn = document.getElementById("startBtn");
const modalEl = document.getElementById("main-ui");
canvas.width = innerWidth;
canvas.height = innerHeight;

/*
..######..##..........###.....######...######..########..######.
.##....##.##.........##.##...##....##.##....##.##.......##....##
.##.......##........##...##..##.......##.......##.......##......
.##.......##.......##.....##..######...######..######....######.
.##.......##.......#########.......##.......##.##.............##
.##....##.##.......##.....##.##....##.##....##.##.......##....##
..######..########.##.....##..######...######..########..######.
*/

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
const friction = 0.99;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01; ///calculate alpha (opacity)
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 10, "white");
/*
.########.....###....########....###....########.....###....##....##.##....##
.##.....##...##.##......##......##.##...##.....##...##.##...###...##.##...##.
.##.....##..##...##.....##.....##...##..##.....##..##...##..####..##.##..##..
.##.....##.##.....##....##....##.....##.########..##.....##.##.##.##.#####...
.##.....##.#########....##....#########.##.....##.#########.##..####.##..##..
.##.....##.##.....##....##....##.....##.##.....##.##.....##.##...###.##...##.
.########..##.....##....##....##.....##.########..##.....##.##....##.##....##
*/
const enemiesData = [];
const projectilesData = [];
const particlesData = [];
/*
..######..########.....###....##......##.##....##.########.##....##.########.##.....##.####.########..######.
.##....##.##.....##...##.##...##..##..##.###...##.##.......###...##.##.......###...###..##..##.......##....##
.##.......##.....##..##...##..##..##..##.####..##.##.......####..##.##.......####.####..##..##.......##......
..######..########..##.....##.##..##..##.##.##.##.######...##.##.##.######...##.###.##..##..######....######.
.......##.##........#########.##..##..##.##..####.##.......##..####.##.......##.....##..##..##.............##
.##....##.##........##.....##.##..##..##.##...###.##.......##...###.##.......##.....##..##..##.......##....##
..######..##........##.....##..###..###..##....##.########.##....##.########.##.....##.####.########..######.
*/

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
/*
..######..##.......####..######..##....##.########.##.....##.########.##....##.########
.##....##.##........##..##....##.##...##..##.......##.....##.##.......###...##....##...
.##.......##........##..##.......##..##...##.......##.....##.##.......####..##....##...
.##.......##........##..##.......#####....######...##.....##.######...##.##.##....##...
.##.......##........##..##.......##..##...##........##...##..##.......##..####....##...
.##....##.##........##..##....##.##...##..##.........##.##...##.......##...###....##...
..######..########.####..######..##....##.########....###....########.##....##....##...
*/
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
let score = 0;
/*
....###....##....##.####.##.....##....###....########.########...##........#######...#######..########.
...##.##...###...##..##..###...###...##.##......##....##.........##.......##.....##.##.....##.##.....##
..##...##..####..##..##..####.####..##...##.....##....##.........##.......##.....##.##.....##.##.....##
.##.....##.##.##.##..##..##.###.##.##.....##....##....######.....##.......##.....##.##.....##.########.
.#########.##..####..##..##.....##.#########....##....##.........##.......##.....##.##.....##.##.......
.##.....##.##...###..##..##.....##.##.....##....##....##.........##.......##.....##.##.....##.##.......
.##.....##.##....##.####.##.....##.##.....##....##....########...########..#######...#######..##.......
*/
const animate = () => {
  animationId = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  ///particlesData

  particlesData.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      //delete particles if they are not visible >> particle.alpha <= 0 alpha\
      particlesData.splice(index, 1);
    } else {
      particle.update();
    }
  });

  //remove projectiles  from edges of screen

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
  ///enemiesData
  enemiesData.forEach((enemies, index) => {
    enemies.update();
    let dist = Math.hypot(player.x - enemies.x, player.y - enemies.y);
    //end game
    if (dist - enemies.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
    }
    //projectilesData
    //   projectile Touch enemy
    projectilesData.forEach((projectile, projectileIndex) => {
      let c1 = projectile.x - enemies.x;
      let c2 = projectile.y - enemies.y;
      let dist = Math.hypot(c1, c2);

      // Enemies Hit
      if (dist - enemies.radius - projectile.radius < 1) {
        {
          // create and push the particles in particlesData array
          //create explosion
          for (let i = 0; i < enemies.radius / 2; i++) {
            particlesData.push(
              new Particle(
                projectile.x,
                projectile.y,
                Math.random() * 2,
                enemies.color,
                {
                  x: (Math.random() - 0.5) * (Math.random() * 5), //random x and y
                  y: (Math.random() - 0.5) * (Math.random() * 5),
                }
              )
            );
          }

          if (enemies.radius - 10 > 5) {
            // incress our score
            score += 100;
            scoreEl.innerHTML = score;
            gsap.to(enemies, {
              radius: enemies.radius - 10,
            });
            setTimeout(() => {
              projectilesData.splice(projectileIndex, 1);
            }, 0);
          } else {
            //remove from the game score
            score += 250;
            scoreEl.innerHTML = score;
            setTimeout(() => {
              ///fix the pop up
              enemiesData.splice(index, 1);
              projectilesData.splice(projectileIndex, 1);
            }, 0);
          }
        }
      }
    });
  });
};
startGameBtn.addEventListener("click", (e) => {
  animate();
  spawnEnemies();
  modalEl.style.display = "none";
});
