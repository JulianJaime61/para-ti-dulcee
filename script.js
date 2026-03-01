const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let time = 0;
let pulseActive = false;
let pulseStrength = 0;

function activatePulse() {
    pulseActive = true;
    pulseStrength = 0;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    // Base oscuro
    ctx.fillStyle = "#020309";
    ctx.fillRect(0, 0, w, h);

    // Nebulosa dinámica
    for (let i = 0; i < 3; i++) {
        let gradient = ctx.createRadialGradient(
            w / 2 + Math.sin(time * 0.0003 + i) * 200,
            h / 2 + Math.cos(time * 0.0004 + i) * 200,
            50,
            w / 2,
            h / 2,
            w
        );

        gradient.addColorStop(0, `rgba(${120 + i * 30}, 80, 255, 0.15)`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    }

    // Ondas suaves
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
        let y = h / 2 + Math.sin(x * 0.002 + time * 0.002) * 40;
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.stroke();

    // Pulso emocional
    if (pulseActive) {
        pulseStrength += 0.02;

        let pulse = Math.sin(pulseStrength) * 40;

        let pulseGradient = ctx.createRadialGradient(
            w / 2,
            h / 2,
            100,
            w / 2,
            h / 2,
            400 + pulse
        );

        pulseGradient.addColorStop(0, "rgba(255,255,255,0.05)");
        pulseGradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = pulseGradient;
        ctx.fillRect(0, 0, w, h);

        if (pulseStrength > Math.PI * 2) {
            pulseActive = false;
        }
    }

    time++;
    requestAnimationFrame(animate);
}

animate();

let blurLevel = 0;
let blurActive = false;

function activateBlurTransition() {
    blurActive = true;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    ctx.filter = `blur(${blurLevel}px)`;

    ctx.fillStyle = "#020309";
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 3; i++) {
        let gradient = ctx.createRadialGradient(
            w / 2 + Math.sin(time * 0.0003 + i) * 200,
            h / 2 + Math.cos(time * 0.0004 + i) * 200,
            50,
            w / 2,
            h / 2,
            w
        );

        gradient.addColorStop(0, `rgba(${120 + i * 30}, 80, 255, 0.15)`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    }

    if (pulseActive) {
        pulseStrength += 0.02;
        let pulse = Math.sin(pulseStrength) * 40;

        let pulseGradient = ctx.createRadialGradient(
            w / 2,
            h / 2,
            100,
            w / 2,
            h / 2,
            400 + pulse
        );

        pulseGradient.addColorStop(0, "rgba(255,255,255,0.05)");
        pulseGradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = pulseGradient;
        ctx.fillRect(0, 0, w, h);

        if (pulseStrength > Math.PI * 2) {
            pulseActive = false;
        }
    }

    if (blurActive) {
        blurLevel += 0.15;
        if (blurLevel > 8) {
            blurLevel = 8;
        }
    }

    ctx.filter = "none";

    time++;
    requestAnimationFrame(animate);
}

function openWhatsApp() {
    activateBlurTransition();

    content.style.transform = "scale(1.05)";
    content.style.opacity = "0";

    setTimeout(() => {
        const numero = "526564295894";
        const mensaje = `Hola… creo que hice bien en confiar en mi intuición 🙂`;
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank");
    }, 900);
}
