(() => {
  // === 1. Canvas Setup ===
  const canvas = document.getElementById('canvas-fireworks');
  const context = canvas.getContext('2d');

  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  // === 2. State and Constants ===
  const positions = {
    mouseX: 0,
    mouseY: 0,
    anchorX: 0,
    anchorY: 0,
  };

  let mouseClicked = false;
  const fireworks = [];

  // Flecks
  const flecks = [];
  const flecks2 = [];
  const flecks3 = [];
  const numberOfFlecks = 25;

  // === 3. Utilities ===
  const random = (min, max) => Math.random() * (max - min) + min;

  const getDistance = (x1, y1, x2, y2) => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // === 4. Draw Anchor Point ===
  const drawAnchor = () => {
    positions.anchorX = width / 2;
    positions.anchorY = height * 0.9;

    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(positions.anchorX, positions.anchorY);
    context.restore();
  };

  // === 5. Mouse Tracking ===
  const attachEventListeners = () => {
    canvas.addEventListener('mousemove', (e) => {
      positions.mouseX = e.pageX;
      positions.mouseY = e.pageY;
    });

    canvas.addEventListener('mousedown', () => (mouseClicked = true));
    canvas.addEventListener('mouseup', () => (mouseClicked = false));
  };

  // === 6. Firework Class ===
  class Firework {
    constructor() {
      this.x = positions.anchorX;
      this.y = positions.anchorY;

      this.target_x = positions.mouseX;
      this.target_y = positions.mouseY;

      this.distanceToTarget = getDistance(this.x, this.y, this.target_x, this.target_y);
      this.distanceTraveled = 0;

      this.coordinates = [];
      let trailLength = 8;
      while (trailLength--) {
        this.coordinates.push([this.x, this.y]);
      }

      this.angle = Math.atan2(this.target_y - this.y, this.target_x - this.x);
      this.speed = 15;
      this.friction = 0.99;
      this.hue = random(0, 360);
    }

    animate(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      this.speed *= this.friction;
      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;

      this.distanceTraveled = getDistance(
        positions.anchorX,
        positions.anchorY,
        this.x + vx,
        this.y + vy
      );

      if (this.distanceTraveled >= this.distanceToTarget) {
        let i = numberOfFlecks;

        while (i--) {
          flecks.push(new Fleck(this.target_x, this.target_y));
          flecks2.push(new Fleck(this.target_x + 50, this.target_y - 50));
          flecks3.push(new Fleck(this.target_x - 100, this.target_y - 100));
        }

        fireworks.splice(index, 1);
      } else {
        this.x += vx;
        this.y += vy;
      }
    }

    draw(index) {
      context.beginPath();
      context.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1]
      );
      context.lineTo(this.x, this.y);
      context.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
      context.stroke();

      this.animate(index);
    }
  }

  // === 7. Fleck Class ===
  class Fleck {
    constructor(x, y) {
      this.x = x;
      this.y = y;

      this.coordinates = [];
      let trailLength = 7;
      while (trailLength--) {
        this.coordinates.push([this.x, this.y]);
      }

      this.angle = random(0, Math.PI * 2);
      this.speed = random(1, 10);
      this.friction = 0.95;
      this.gravity = 2;

      this.hue = random(0, 360);
      this.alpha = 1;
      this.decay = random(0.015, 0.03);
    }

    animate(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;

      this.alpha -= this.decay;

      if (this.alpha <= this.decay) {
        flecks.splice(index, 1);
        flecks2.splice(index, 1);
        flecks3.splice(index, 1);
      }
    }

    draw(index) {
      context.beginPath();
      context.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1]
      );
      context.lineTo(this.x, this.y);
      context.strokeStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
      context.stroke();

      this.animate(index);
    }
  }

  // === 8. Main Animation Loop ===
  const loop = () => {
    requestAnimationFrame(loop);
    drawAnchor();

    if (mouseClicked) {
      fireworks.push(new Firework());
    }

    // Fireworks
    let i = fireworks.length;
    while (i--) {
      fireworks[i].draw(i);
    }

    // Flecks - spark explosions
    let f1 = flecks.length;
    while (f1--) {
      flecks[f1].draw(f1);
    }

    let f2 = flecks2.length;
    while (f2--) {
      flecks2[f2].draw(f2);
    }

    let f3 = flecks3.length;
    while (f3--) {
      flecks3[f3].draw(f3);
    }
  };

  // === 9. Launch! ===
  window.addEventListener('load', () => {
    attachEventListeners();
    loop();
  });
})();
