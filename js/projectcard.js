(function () {
	var track = document.getElementById('projTrack');
	var prevBtn = document.getElementById('projPrev');
	var nextBtn = document.getElementById('projNext');
	var dotsWrap = document.getElementById('projDots');
	var cards = track.querySelectorAll('.proj-card');
	var total = cards.length;
	var current = 0;
	function getVisible() {
		var w = track.parentElement.offsetWidth;
		if (w <= 600) return 1;
		if (w <= 991) return 2;
		return 3;
	}
	function maxIndex() { return Math.max(0, total - getVisible()); }
	function buildDots() {
		dotsWrap.innerHTML = '';
		var steps = maxIndex() + 1;
		for (var i = 0; i < steps; i++) {
			var btn = document.createElement('button');
			btn.className = 'proj-dot' + (i === current ? ' active' : '');
			btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
			btn.setAttribute('role', 'tab');
			(function (idx) { btn.addEventListener('click', function () { goTo(idx); }); })(i);
			dotsWrap.appendChild(btn);
		}
	}
	function updateDots() {
		dotsWrap.querySelectorAll('.proj-dot').forEach(function (d, i) {
			d.classList.toggle('active', i === current);
		});
	}
	function getCardWidth() { return cards.length ? cards[0].offsetWidth + 24 : 0; }
	function wrap(idx) {
		var max = maxIndex();
		if (max === 0) return 0;
		return ((idx % (max + 1)) + (max + 1)) % (max + 1);
	}
	function goTo(idx) {
		current = wrap(idx);
		track.style.transform = 'translateX(-' + (current * getCardWidth()) + 'px)';
		updateDots();
	}
	prevBtn.addEventListener('click', function () { goTo(current - 1); });
	nextBtn.addEventListener('click', function () { goTo(current + 1); });
	document.addEventListener('keydown', function (e) {
		if (e.key === 'ArrowLeft') { goTo(current - 1); startAuto(); }
		if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
	});
	var startX = 0;
	track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
	track.addEventListener('touchend', function (e) {
		var diff = startX - e.changedTouches[0].clientX;
		if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
	}, { passive: true });
	var resizeTimer;
	window.addEventListener('resize', function () {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function () {
			if (current > maxIndex()) current = maxIndex();
			buildDots(); goTo(current);
		}, 120);
	});
	buildDots(); goTo(0);

	// Auto-scroll every 3 seconds
	var autoTimer;
	function startAuto() {
		clearInterval(autoTimer);
		autoTimer = setInterval(function () {
			goTo(current < maxIndex() ? current + 1 : 0);
		}, 3000);
	}
	function stopAuto() { clearInterval(autoTimer); }

	// Pause on hover / touch
	var carousel = track.closest('.proj-carousel') || track.parentElement;
	carousel.addEventListener('mouseenter', stopAuto);
	carousel.addEventListener('mouseleave', startAuto);
	carousel.addEventListener('touchstart', stopAuto, { passive: true });
	carousel.addEventListener('touchend', startAuto, { passive: true });

	// Also reset timer on manual nav so next slide waits a full 3s
	prevBtn.addEventListener('click', startAuto);
	nextBtn.addEventListener('click', startAuto);

	startAuto();
})();
