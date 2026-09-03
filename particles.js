/* ==========================================
   Background Particle Engine (Floating Hearts & Star Dust)
   ========================================== */
class RomanticParticles {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.floor((window.innerWidth * window.innerHeight) / 12000);
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 12 + 6,
                speedY: Math.random() * 0.8 + 0.3,
                speedX: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.6 + 0.2,
                type: Math.random() > 0.4 ? 'heart' : 'star',
                pulse: Math.random() * 0.05 + 0.01
            });
        }
    }

    drawHeart(x, y, size, opacity) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = '#ff758c';
        this.ctx.beginPath();
        const topCurveHeight = size * 0.3;
        this.ctx.moveTo(x, y + topCurveHeight);
        this.ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        this.ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
        this.ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight, x + size / 2, y + topCurveHeight);
        this.ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    drawStar(x, y, size, opacity) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = '#ffd166';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            p.y -= p.speedY;
            p.x += p.speedX;
            p.opacity += Math.sin(Date.now() * p.pulse) * 0.005;

            if (p.y < -20) {
                p.y = this.canvas.height + 20;
                p.x = Math.random() * this.canvas.width;
            }

            if (p.type === 'heart') {
                this.drawHeart(p.x, p.y, p.size, Math.max(0.1, Math.min(0.8, p.opacity)));
            } else {
                this.drawStar(p.x, p.y, p.size, Math.max(0.2, Math.min(0.9, p.opacity)));
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const particleEngine = new RomanticParticles();
    particleEngine.animate();
});
