/* ==========================================
   Main Application Engine
   Dedicated to Vũ Thị Minh Khuê (Bé Bún)
   ========================================== */

// Load YouTube IFrame API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let ytPlayer = null;
let ytPlayerReady = false;
let pendingPlay = false;

window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('yt-player-hidden', {
        height: '1',
        width: '1',
        videoId: 'chgnrnWmfT4',
        playerVars: {
            autoplay: 0,
            loop: 1,
            playlist: 'chgnrnWmfT4',
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0
        },
        events: {
            onReady: function(e) {
                ytPlayerReady = true;
                e.target.setVolume(70);
                if (pendingPlay) {
                    e.target.playVideo();
                    pendingPlay = false;
                }
            },
            onStateChange: function(e) {
                const playerWidget = document.getElementById('music-player-widget');
                const toggleBtn = document.getElementById('btn-music-toggle');
                if (e.data === YT.PlayerState.PLAYING) {
                    if (playerWidget) playerWidget.classList.add('playing');
                    if (toggleBtn) toggleBtn.textContent = '❚❚';
                } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
                    if (playerWidget) playerWidget.classList.remove('playing');
                    if (toggleBtn) toggleBtn.textContent = '▶';
                }
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initEntrance();
    initCountdown();
    renderGallery();
    renderReasons();
    initMusicPlayer();
    initCursorTrail();
});

/* ==========================================
   1. Entrance & Unlock Surprise
   ========================================== */
function initEntrance() {
    const entranceOverlay = document.getElementById('entrance-overlay');
    const btnOpen = document.getElementById('btn-open-gift');

    if (btnOpen && entranceOverlay) {
        btnOpen.addEventListener('click', () => {
            entranceOverlay.classList.add('hidden');
            startTypewriterLetter();
            playRomanticMusic();
        });
    }
}

/* ==========================================
   2. Birthday Countdown Timer
   ========================================== */
function initCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    function updateTimer() {
        const now = new Date();
        const currentYear = now.getFullYear();
        let targetDate = new Date(`${currentYear}-09-04T00:00:00`);

        // If September 4th has passed this year, count down to next year's birthday
        if (now > targetDate && now.getDate() !== 4) {
            targetDate = new Date(`${currentYear + 1}-09-04T00:00:00`);
        }

        const diff = targetDate - now;

        if (diff <= 0 || (now.getMonth() === 8 && now.getDate() === 4)) {
            // It's Birthday Today!
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minsEl) minsEl.textContent = '00';
            if (secsEl) secsEl.textContent = '00';
            const heroSubtitle = document.querySelector('.hero-subtitle');
            if (heroSubtitle) heroSubtitle.textContent = '🎉 Hôm nay là sinh nhật của Em Bé! Chúc em luôn hạnh phúc và rực rỡ nhất! 🎉';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / 1000 / 60) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* ==========================================
   3. Render Polaroid Photo Gallery
   ========================================== */
function renderGallery() {
    const container = document.getElementById('gallery-grid');
    if (!container || !CONFIG.photos) return;

    container.innerHTML = '';
    CONFIG.photos.forEach((photo, idx) => {
        const card = document.createElement('div');
        card.className = 'polaroid-card';
        card.style.setProperty('--rand', Math.random().toFixed(2));
        
        card.innerHTML = `
            <div class="polaroid-img-wrapper">
                <img src="${photo.url}" alt="${photo.title}" loading="lazy">
            </div>
            <div class="polaroid-caption">
                <div class="polaroid-title">${photo.title}</div>
                <div class="polaroid-desc">${photo.desc}</div>
            </div>
        `;

        card.addEventListener('click', () => openLightbox(photo));
        container.appendChild(card);
    });
}

function openLightbox(photo) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
    modal.style.backdropFilter = 'blur(10px)';
    modal.style.zIndex = '10000';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.cursor = 'pointer';
    modal.style.padding = '20px';

    modal.innerHTML = `
        <div style="max-width: 600px; width: 100%; text-align: center; color: white;">
            <img src="${photo.url}" style="max-width: 100%; max-height: 75vh; border-radius: 12px; box-shadow: 0 10px 30px rgba(255,78,114,0.4);" alt="${photo.title}">
            <h2 style="font-family: 'Dancing Script', cursive; font-size: 2.5rem; margin-top: 15px; color: #ff8fa3;">${photo.title}</h2>
            <p style="font-size: 1.1rem; color: #e2c0db; margin-top: 5px;">${photo.desc}</p>
        </div>
    `;

    modal.addEventListener('click', () => modal.remove());
    document.body.appendChild(modal);
}

/* ==========================================
   4. Typewriter Love Letter Effect
   ========================================== */
function startTypewriterLetter() {
    const letterEl = document.getElementById('letter-content');
    if (!letterEl || !CONFIG.loveLetter) return;

    letterEl.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'letter-cursor';

    let index = 0;
    const text = CONFIG.loveLetter;

    function type() {
        if (index < text.length) {
            const char = text.charAt(index);
            if (char === '\n') {
                letterEl.appendChild(document.createElement('br'));
            } else {
                letterEl.appendChild(document.createTextNode(char));
            }
            letterEl.appendChild(cursor);
            index++;
            setTimeout(type, 35);
        } else {
            cursor.remove();
        }
    }

    type();
}

/* ==========================================
   5. Render Reasons Grid
   ========================================== */
function renderReasons() {
    const container = document.getElementById('reasons-grid');
    if (!container || !CONFIG.reasons) return;

    container.innerHTML = '';
    CONFIG.reasons.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'reason-card';
        card.innerHTML = `
            <div class="reason-icon">💖</div>
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
        `;
        container.appendChild(card);
    });
}

/* ==========================================
   6. Music Player Engine (YouTube IFrame API)
   Song: "Mơ" - Vũ Cát Tường | ID: chgnrnWmfT4
   ========================================== */

function initMusicPlayer() {
    const toggleBtn = document.getElementById('btn-music-toggle');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (ytPlayer && ytPlayerReady) {
                const state = ytPlayer.getPlayerState();
                if (state === YT.PlayerState.PLAYING) {
                    ytPlayer.pauseVideo();
                } else {
                    ytPlayer.playVideo();
                }
            }
        });
    }
}

function playRomanticMusic() {
    if (ytPlayer && ytPlayerReady) {
        ytPlayer.playVideo();
    } else {
        // API not ready yet, mark as pending
        pendingPlay = true;
    }
}

function stopRomanticMusic() {
    if (ytPlayer && ytPlayerReady) {
        ytPlayer.pauseVideo();
    }
}

/* ==========================================
   7. Mouse Cursor Floating Heart Trail
   ========================================== */
function initCursorTrail() {
    let lastTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTime < 100) return; // limit heart rate
        lastTime = now;

        const heart = document.createElement('div');
        heart.textContent = '💖';
        heart.style.position = 'fixed';
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        heart.style.fontSize = `${Math.random() * 12 + 10}px`;
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.transition = 'all 1s ease-out';
        heart.style.opacity = '1';

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.style.transform = `translate(${(Math.random() - 0.5) * 40}px, -40px) scale(0)`;
            heart.style.opacity = '0';
        }, 50);

        setTimeout(() => heart.remove(), 1050);
    });
}
