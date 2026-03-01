const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 150; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 2
    });
}

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let gradient = ctx.createRadialGradient(mouseX, mouseY, 100, mouseX, mouseY, 600);
    gradient.addColorStop(0, "rgba(255,255,255,0.08)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

animate();

let step = 0;
let nombre = "";

const content = document.getElementById("content");

function fade(html) {
    content.style.opacity = 0;
    content.style.transform = "translateY(20px)";
    setTimeout(() => {
        content.innerHTML = html;
        content.style.opacity = 1;
        content.style.transform = "translateY(0)";
    }, 600);
}

function next() {
    step++;

    if (step === 1) {
        fade(`
      <h1>No todo es casual.</h1>
      <p>Algunas cosas son intención.</p>
      <button onclick="next()">Continúa</button>
    `);
    }

    else if (step === 2) {
        fade(`
      <h1>Dime tu nombre.</h1>
      <input id="nameInput">
      <button onclick="next()">Seguir</button>
    `);
    }

    else if (step === 3) {
        nombre = document.getElementById("nameInput").value || "";
        fade(`
      <h1>${nombre}…</h1>
      <p>Hay algo interesante en tu energía.</p>
      <button onclick="next()">Continuar</button>
    `);
    }

    else if (step === 4) {
        fade(`
    <h1>Hay algo más que podría decir…</h1>
    <p>Pero eso arruinaría el misterio.</p>
    <button onclick="next()">Continúa</button>
  `);
    }

    else if (step === 5) {
        fade(`
    <h1>Y si soy honesto…</h1>
    <p>No suelo abrir este tipo de puertas tan fácil.</p>
    <button onclick="next()">Sigue</button>
  `);
    }

    else if (step === 6) {
        fade(`
    <h1>Pero tampoco suelo ignorar lo que me intriga.</h1>
    <p>Y tú definitivamente entras en esa categoría.</p>
    <button class="whatsapp" onclick="openWhatsApp()">Demuestra que no fue casual.</button>
  `);
    }
}

function openWhatsApp() {
    const numero = "526564295894";
    const mensaje = `Hola ${nombre}. Creo que hay algo interesante que vale la pena descubrir.`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

next();