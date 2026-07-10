(function () {

    /* ---- 1. CANVAS PARTICLE NETWORK (Antigravity Static Magnet Style) ---- */
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];

    // Configured parameters matching the React Antigravity props
    var PARTICLE_COUNT = 2000;
    var particleSize = 2;
    var color = 'rgba(54, 139, 159, '; // #368b9f
    var lerpSpeed = 0.14;
    var magnetRadius = 80;
    var fieldStrength = 18;
    var depthFactor = 1.5;
    var pulseSpeed = 0.007;

    // Ring parameters
    var ringRadius = 7;
    var minRadius, maxRadius, cX, cY;
    var W, H;

    var mouse = { x: -1000, y: -1000, active: false };

    function resize() {
        W = canvas.width = canvas.offsetWidth || window.innerWidth;
        H = canvas.height = canvas.offsetHeight || window.innerHeight;
        cX = W / 2;
        cY = H / 2;
        minRadius = ringRadius * 12; // Base inner circle void
        maxRadius = Math.max(minRadius + 200, Math.sqrt(cX * cX + cY * cY)); // Max screen distance
    }

    function Particle(angle, r, variance) {
        this.angle = angle;
        this.baseR = r;
        this.baseX = cX + Math.cos(angle) * r;
        this.baseY = cY + Math.sin(angle) * r;
        this.x = this.baseX;
        this.y = this.baseY;
        this.variance = variance;
        this.z = Math.random() * depthFactor + 0.5;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.alpha = Math.random() * 0.5 + 0.3;
    }

    Particle.prototype.update = function () {
        var targetX = this.baseX;
        var targetY = this.baseY;

        // Magnet attraction logic (no auto-animate, entirely mouse-controlled)
        if (mouse.active) {
            var dx = mouse.x - this.baseX;
            var dy = mouse.y - this.baseY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var activeMagnetRadius = magnetRadius * 3.5;
            if (dist < activeMagnetRadius) {
                var force = (activeMagnetRadius - dist) / activeMagnetRadius;
                // Pull towards cursor based on field strength and individual variance
                targetX = this.baseX + (dx / dist) * force * fieldStrength * 7 * this.variance;
                targetY = this.baseY + (dy / dist) * force * fieldStrength * 7 * this.variance;
            }
        }

        // Smooth lerp back and forth
        this.x += (targetX - this.x) * lerpSpeed;
        this.y += (targetY - this.y) * lerpSpeed;
    };

    function initParticles() {
        particles = [];
        var ringsCount = 17;
        var particlesPerRing = Math.floor(PARTICLE_COUNT / ringsCount);

        for (var rIndex = 0; rIndex < ringsCount; rIndex++) {
            // Distribute ring radii between minRadius and maxRadius
            var ringR = minRadius + (rIndex / (ringsCount - 1)) * (maxRadius - minRadius);

            for (var pIndex = 0; pIndex < particlesPerRing; pIndex++) {
                var angle = (pIndex / particlesPerRing) * Math.PI * 2;
                // Add small random variations for organic alignment
                var finalAngle = angle + (Math.random() - 0.5) * 0.04;
                var finalR = ringR + (Math.random() - 0.5) * 12;
                var variance = Math.random() * 2.4 + 0.5;

                particles.push(new Particle(finalAngle, finalR, variance));
            }
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, W, H);

        var pulse = Math.sin(Date.now() * pulseSpeed) * 0.2 + 0.8;

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.update();

            var finalSize = particleSize * p.z * pulse;
            var currentAlpha = p.alpha * (Math.sin(Date.now() * 0.002 + p.pulseOffset) * 0.15 + 0.85);

            // Draw circular dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, finalSize, 0, Math.PI * 2);
            ctx.fillStyle = color + currentAlpha + ')';
            ctx.fill();
        }
        requestAnimationFrame(drawParticles);
    }

    window.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        // Use client position relative to canvas rect
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });

    window.addEventListener('mouseout', function () {
        mouse.active = false;
    });

    window.addEventListener('resize', function () { resize(); initParticles(); });
    resize();
    initParticles();
    drawParticles();

    /* ---- 2. TYPED TEXT EFFECT ---- */
    var typedEl = document.getElementById('hero-typed');
    if (!typedEl) return;

    var phrases = [
        'Web Apps',
        'REST APIs',
        'Beautiful UIs',
        'Django Projects',
        'React Interfaces',
        'Full Stack Solutions'
    ];
    var pi = 0, ci = 0, deleting = false, pauseTimer = 0;

    function typeLoop() {
        var current = phrases[pi];
        if (pauseTimer > 0) { pauseTimer--; setTimeout(typeLoop, 60); return; }

        if (!deleting) {
            typedEl.textContent = current.slice(0, ci + 1);
            ci++;
            if (ci === current.length) { deleting = true; pauseTimer = 28; }
            setTimeout(typeLoop, 90);
        } else {
            typedEl.textContent = current.slice(0, ci - 1);
            ci--;
            if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; pauseTimer = 10; }
            setTimeout(typeLoop, 48);
        }
    }
    setTimeout(typeLoop, 800);

})();
