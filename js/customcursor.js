(function () {
    // Only instantiate custom cursor on desktop resolutions
    if (window.innerWidth < 992) return;

    var dot = document.getElementById('customCursorDot');
    var ring = document.getElementById('customCursorRing');
    if (!dot || !ring) return;

    var mouseX = -100, mouseY = -100;
    var ringX = -100, ringY = -100;
    var isVisible = false;

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            dot.style.opacity = '1';
            ring.style.opacity = '1';
            isVisible = true;
        }

        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    document.addEventListener('mouseleave', function () {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
        isVisible = false;
    });

    // Animate outer ring with a fluid lag (lerp)
    function animateRing() {
        var distX = mouseX - ringX;
        var distY = mouseY - ringY;

        // Fluid physics lerp factor
        ringX += distX * 0.15;
        ringY += distY * 0.15;

        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover selector elements
    var hoverSelector = 'a, h1, p, .btn, h3, .services-1, .sr-only-fallback, h2, button, [role="button"], .proj-card, .proj-dot, .skill-pill, .hero-social-link, .proj-arrow';

    function bindHoverEvents() {
        var items = document.querySelectorAll(hoverSelector);
        items.forEach(function (el) {
            // Prevent duplicate binding
            if (el.getAttribute('data-cursor-bound')) return;
            el.setAttribute('data-cursor-bound', 'true');

            el.addEventListener('mouseenter', function () {
                dot.classList.add('hovered');
                ring.classList.add('hovered');
            });
            el.addEventListener('mouseleave', function () {
                dot.classList.remove('hovered');
                ring.classList.remove('hovered');
            });
        });
    }

    bindHoverEvents();

    // Handle dynamic content (like slider changes or page actions)
    var observer = new MutationObserver(bindHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });
})();