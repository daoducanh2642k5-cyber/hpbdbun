/* ==========================================
   Interactive Birthday Cake & Confetti Fireworks Engine
   ========================================== */

function initBirthdayCake() {
    const cakeWrapper = document.getElementById('cake-wrapper');
    const candles = document.querySelectorAll('.candle');
    const cakeStatusText = document.getElementById('cake-status');
    let blownOut = false;

    if (!cakeWrapper) return;

    cakeWrapper.addEventListener('click', () => {
        if (blownOut) return;
        
        candles.forEach(candle => candle.classList.add('blown'));
        blownOut = true;
        
        if (cakeStatusText) {
            cakeStatusText.textContent = "✨ Ước nguyện đã gửi tới các vì sao! Chúc mừng sinh nhật Minh Khuê! 💖🎉";
            cakeStatusText.style.color = "#ffd166";
        }

        // Trigger Confetti & Fireworks Explosion
        launchConfetti();
        playCheerSound();
    });
}

// Confetti Fireworks Engine
function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff4e72', '#ff8fa3', '#ffd166', '#ffffff', '#b388ff', '#4facfe'];

    for (let i = 0; i < 180; i++) {
        pieces.push({
            x: canvas.width / 2,
            y: canvas.height / 2 + 50,
            vx: (Math.random() - 0.5) * 18,
            vy: (Math.random() - 0.8) * 16 - 4,
            size: Math.random() * 8 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10
        });
    }

    let startTime = Date.now();
    function render() {
        const elapsed = Date.now() - startTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.25; // gravity
            p.rotation += p.rotSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        if (elapsed < 4000) {
            requestAnimationFrame(render);
        } else {
            canvas.remove();
        }
    }
    render();
}

// Synthesize celebration sound effect using Web Audio API
function playCheerSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.12);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime + index * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.12 + 0.5);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime + index * 0.12);
            osc.stop(audioCtx.currentTime + index * 0.12 + 0.6);
        });
    } catch (e) {
        console.log('Audio Context error', e);
    }
}

document.addEventListener('DOMContentLoaded', initBirthdayCake);
