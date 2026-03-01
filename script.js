const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let stars = [];
let particles = [];
let shootingStars = [];
let nameParticles = [];
let formingName = false;
let time = 0;
let scenePulse = 0;

// -------- ESTRELLAS BASE --------
for (let i = 0; i < 250; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        depth: Math.random() * 0.6 + 0.4
    });
}

function createParticle(x, y, intensity = 25) {
    for (let i = 0; i < intensity; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 60
        });
    }
}

function triggerSceneReaction() {
    scenePulse = 1;
    createParticle(canvas.width / 2, canvas.height / 2, 30);
}

canvas.addEventListener("click", (e) => {
    createParticle(e.clientX, e.clientY, 15);
});

function createShootingStar() {
    shootingStars.push({
        x: Math.random() * canvas.width,
        y: 0,
        vx: -6,
        vy: 6,
        life: 80
    });
}

setInterval(() => {
    if (Math.random() > 0.6) {
        createShootingStar();
    }
}, 4000);


// -------- NOMBRE COMO CONSTELACIÓN REAL --------
function createNameParticles(text) {

    nameParticles = [];
    formingName = true;
    // Vibración suave si el dispositivo lo permite
    if (navigator.vibrate) {
        navigator.vibrate(40);
    }

    const offCanvas = document.createElement("canvas");
    const offCtx = offCanvas.getContext("2d");

    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;

    offCtx.fillStyle = "white";
    offCtx.font = "bold 60px -apple-system, sans-serif";
    offCtx.textAlign = "center";
    offCtx.fillText(text, offCanvas.width / 2, offCanvas.height / 2);

    const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);

    for (let y = 0; y < imageData.height; y += 6) {
        for (let x = 0; x < imageData.width; x += 6) {
            const index = (y * imageData.width + x) * 4;
            if (imageData.data[index + 3] > 150) {
                nameParticles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    targetX: x,
                    targetY: y,
                    vx: 0,
                    vy: 0
                });
            }
        }
    }

    setTimeout(() => {
        formingName = false;

        // Dispersión
        nameParticles.forEach(p => {
            p.vx = (Math.random() - 0.5) * 4;
            p.vy = (Math.random() - 0.5) * 4;
        });

        setTimeout(() => {
            nameParticles = [];
        }, 2000);

    }, 2500);
}


// -------- ANIMACIÓN PRINCIPAL --------
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#020309";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estrellas
    stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(
            s.x + Math.sin(time * 0.0005 * s.depth) * 15,
            s.y + Math.cos(time * 0.0005 * s.depth) * 15,
            s.size,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fill();
    });

    // Pulso escena
    if (scenePulse > 0) {
        scenePulse -= 0.02;
        if (scenePulse < 0) scenePulse = 0;

        let pulseRadius = canvas.width * scenePulse;
        if (pulseRadius > 0) {
            let gradient = ctx.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
                pulseRadius
            );
            gradient.addColorStop(0, "rgba(120,80,255,0.15)");
            gradient.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Polvo estelar
    particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + (p.life / 60) + ")";
        ctx.fill();

        if (p.life <= 0) {
            particles.splice(index, 1);
        }
    });

    // Estrellas fugaces
    shootingStars.forEach((s, index) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life--;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - 25, s.y - 25);
        ctx.strokeStyle = "rgba(255,255,255," + (s.life / 80) + ")";
        ctx.stroke();

        if (s.life <= 0) {
            shootingStars.splice(index, 1);
        }
    });

    // Animación nombre
    nameParticles.forEach(p => {
        if (formingName) {
            p.x += (p.targetX - p.x) * 0.08;
            p.y += (p.targetY - p.y) * 0.08;
        } else {
            p.x += p.vx;
            p.y += p.vy;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    });

    time++;
    requestAnimationFrame(animate);
}

animate();


// -------- EXPERIENCIA TEXTO --------

let step = 0;
let nombre = "";
const content = document.getElementById("content");

function fade(html) {
    content.style.opacity = 0;
    content.style.transform = "translateY(15px)";
    setTimeout(() => {
        content.innerHTML = html;
        content.style.opacity = 1;
        content.style.transform = "translateY(0)";
    }, 500);

    triggerSceneReaction();
}

function next() {
    step++;

    if (step === 1) {
        fade(`
      <h1>No suelo hacer esto.</h1>
      <p>Pero tampoco suelo ignorar lo que me mueve un poco.</p>
      <button onclick="next()">Continúa</button>
    `);
    }

    else if (step === 2) {
        fade(`
      <h1>Antes de seguir…</h1>
      <input id="nameInput" placeholder="Tu nombre">
      <button onclick="next()">Seguir</button>
    `);
    }

    else if (step === 3) {
        nombre = document.getElementById("nameInput").value || "";
        createNameParticles(nombre);

        fade(`
      <h1>${nombre}…</h1>
      <p>Creo que me quedé pensando más de lo normal.</p>
      <button onclick="next()">Continuar</button>
    `);
    }

    else if (step === 4) {
        fade(`
      <h1>No fue solo lo que vi.</h1>
      <p>Fue la sensación de que hay algo más.</p>
      <button onclick="next()">Sigue</button>
    `);
    }

    else if (step === 5) {
        fade(`
      <h1>Y si soy honesto…</h1>
      <p>Dudé un poco antes de hacer esto.</p>
      <button onclick="next()">Continúa</button>
    `);
    }

    else if (step === 6) {
        fade(`
      <h1>No sé exactamente qué va a salir de esto.</h1>
      <p>Pero me gustaría descubrirlo contigo.</p>
      <button class="whatsapp" onclick="openWhatsApp()">Continuar la historia</button>
    `);
    }
}

function openWhatsApp() {
    createParticle(canvas.width / 2, canvas.height / 2, 60);
    content.style.transition = "opacity 0.8s ease";
    content.style.opacity = "0";

    setTimeout(() => {
        const numero = "526564295894";
        const mensaje = `Hola… creo que hice bien en confiar en mi intuición 🙂`;
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank");
    }, 900);
}

next();
