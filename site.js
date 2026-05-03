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
  ctx.fillStyle = "#211824";
  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  const horizon = ctx.createLinearGradient(0, canvas.offsetHeight, canvas.offsetWidth, 0);
  horizon.addColorStop(0, "rgba(217, 168, 160, 0.22)");
  horizon.addColorStop(0.45, "rgba(54, 93, 99, 0.2)");
  horizon.addColorStop(1, "rgba(210, 173, 105, 0.12)");
  ctx.fillStyle = horizon;
  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

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
