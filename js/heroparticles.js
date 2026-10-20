(function () {

    /* ---- 1. CANVAS INTERACTIVE LINES (Line-by-line low-opacity white) ---- */
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var lines = [];
    var allPoints = [];
    var W, H;
    var mouse = { x: -1000, y: -1000, active: false };

    var LINE_SPACING = 36;       // Vertical distance between lines
    var POINT_SPACING = 32;      // Horizontal distance between points along each line
    var MOUSE_RADIUS = 130;      // Interaction radius
    var MOUSE_FORCE = 38;        // Deflection strength

    function resize() {
        W = canvas.width = canvas.offsetWidth || window.innerWidth;
        H = canvas.height = canvas.offsetHeight || window.innerHeight;
    }

    function Point(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.phase = Math.random() * Math.PI * 2;
        this.alpha = Math.random() * 0.12 + 0.12; // Low opacity white
    }

    Point.prototype.update = function (time) {
        var targetX = this.baseX;
        // Subtle ambient horizontal breathing wave
        var targetY = this.baseY + Math.sin(time * 0.0018 + this.baseX * 0.004 + this.phase) * 2;

        if (mouse.active) {
            var dx = this.baseX - mouse.x;
            var dy = this.baseY - mouse.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
                var force = (1 - dist / MOUSE_RADIUS);
                targetX += (dx / dist) * force * (MOUSE_FORCE * 0.4);
                targetY += (dy / dist) * force * MOUSE_FORCE;
            }
        }

        // Smooth easing towards target
        this.x += (targetX - this.x) * 0.12;
        this.y += (targetY - this.y) * 0.12;
    };

    function initLines() {
        lines = [];
        allPoints = [];

        var numLines = Math.ceil(H / LINE_SPACING) + 2;
        var numPoints = Math.ceil((W + 80) / POINT_SPACING) + 2;
        var startY = (H - (numLines - 1) * LINE_SPACING) / 2;

        for (var i = 0; i < numLines; i++) {
            var lineY = startY + i * LINE_SPACING;
            var currentLine = [];

            for (var j = 0; j < numPoints; j++) {
                var lineX = -40 + j * POINT_SPACING;
                var pt = new Point(lineX, lineY);
                currentLine.push(pt);
                allPoints.push(pt);
            }
            lines.push(currentLine);
        }
    }

    function drawLines() {
        ctx.clearRect(0, 0, W, H);
        var time = Date.now();

        // 1. Update all points
        for (var p = 0; p < allPoints.length; p++) {
            allPoints[p].update(time);
        }

        // 2. Draw line by line with smooth curves in low-opacity white
        for (var l = 0; l < lines.length; l++) {
            var line = lines[l];
            if (line.length < 2) continue;

            // Draw connecting line
            ctx.beginPath();
            ctx.moveTo(line[0].x, line[0].y);

            for (var i = 1; i < line.length - 1; i++) {
                var xc = (line[i].x + line[i + 1].x) / 2;
                var yc = (line[i].y + line[i + 1].y) / 2;
                ctx.quadraticCurveTo(line[i].x, line[i].y, xc, yc);
            }
            ctx.lineTo(line[line.length - 1].x, line[line.length - 1].y);

            // Clean low-opacity white stroke
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.085)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw subtle micro-dots along the line
            for (var j = 0; j < line.length; j++) {
                var pt = line[j];
                var dotAlpha = pt.alpha;

                // Slightly brighten dots near the cursor
                if (mouse.active) {
                    var mdx = pt.x - mouse.x;
                    var mdy = pt.y - mouse.y;
                    var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mdist < MOUSE_RADIUS) {
                        dotAlpha += (1 - mdist / MOUSE_RADIUS) * 0.28;
                    }
                }

                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 1.25, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.min(dotAlpha, 0.45) + ')';
                ctx.fill();
            }
        }

        requestAnimationFrame(drawLines);
    }

    window.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });

    window.addEventListener('mouseout', function () {
        mouse.active = false;
    });

    window.addEventListener('resize', function () {
        resize();
        initLines();
    });

    resize();
    initLines();
    drawLines();

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
