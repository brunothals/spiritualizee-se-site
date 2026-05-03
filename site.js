const canvas = document.getElementById("constellationCanvas");
const ctx = canvas.getContext("2d");
let stars = [];
let pointer = { x: 0, y: 0, active: false };

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(canvas.offsetWidth * ratio);
  canvas.height = Math.floor(canvas.offsetHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: Math.min(120, Math.floor(canvas.offsetWidth / 10)) }, () => ({
    x: Math.random() * canvas.offsetWidth,
    y: Math.random() * canvas.offsetHeight,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    glow: Math.random() * 0.7 + 0.25
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  ctx.fillStyle = "#070b0d";
  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  const horizon = ctx.createLinearGradient(0, canvas.offsetHeight, canvas.offsetWidth, 0);
  horizon.addColorStop(0, "rgba(36, 26, 45, 0.42)");
  horizon.addColorStop(0.45, "rgba(23, 42, 47, 0.28)");
  horizon.addColorStop(1, "rgba(216, 184, 120, 0.16)");
  ctx.fillStyle = horizon;
  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  const centerX = canvas.offsetWidth * 0.76;
  const centerY = canvas.offsetHeight * 0.45;
  const radius = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.22;
  const pulse = Math.sin(Date.now() / 1400) * 0.08 + 0.18;
  ctx.strokeStyle = `rgba(216, 184, 120, ${pulse})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(240, 217, 163, 0.08)";
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radius * 1.36, radius * 0.36, -0.28, 0, Math.PI * 2);
  ctx.stroke();

  stars.forEach((star, index) => {
    star.x += star.vx;
    star.y += star.vy;
    if (star.x < 0 || star.x > canvas.offsetWidth) star.vx *= -1;
    if (star.y < 0 || star.y > canvas.offsetHeight) star.vy *= -1;

    for (let i = index + 1; i < stars.length; i += 1) {
      const other = stars[i];
      const dx = star.x - other.x;
      const dy = star.y - other.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 118) {
        ctx.strokeStyle = `rgba(210, 173, 105, ${0.14 * (1 - distance / 118)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }

    if (pointer.active) {
      const distance = Math.hypot(star.x - pointer.x, star.y - pointer.y);
      if (distance < 150) {
        ctx.strokeStyle = `rgba(255, 248, 237, ${0.24 * (1 - distance / 150)})`;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.stroke();
      }
    }

    ctx.fillStyle = `rgba(255, 248, 237, ${star.glow})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resizeCanvas);
canvas.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    active: true
  };
});
canvas.addEventListener("pointerleave", () => {
  pointer.active = false;
});

resizeCanvas();
draw();
