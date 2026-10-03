// Simple winter effect: falling snow + snowy caps on game cards
(function () {
    function initWinterTheme() {
        try {
            document.body.classList.add('winter-theme');

            // Add snowy style to all game cards (if any exist on the page)
            var cards = document.querySelectorAll('.game-card');
            cards.forEach(function (card) {
                card.classList.add('winter-card');
            });

            createSnow();
        } catch (e) {
            // Fail silently – this is just a visual enhancement
            console.error('winter-effect error:', e);
        }
    }

    function createSnow() {
        var SNOWFLAKE_COUNT = 80;

        var container = document.createElement('div');
        container.id = 'snow-container';
        document.body.appendChild(container);

        for (var i = 0; i < SNOWFLAKE_COUNT; i++) {
            var flake = document.createElement('span');
            flake.className = 'snowflake';
            flake.textContent = '•';

            var size = 6 + Math.random() * 10;
            var duration = 6 + Math.random() * 6;
            var delay = -Math.random() * 10;
            var horizontalDrift = (Math.random() * 60 - 30) + 'px';

            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.fontSize = size + 'px';
            flake.style.animationDuration = duration + 's';
            flake.style.animationDelay = delay + 's';
            flake.style.setProperty('--snow-drift', horizontalDrift);
            flake.style.opacity = (0.4 + Math.random() * 0.6).toString();

            container.appendChild(flake);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWinterTheme);
    } else {
        initWinterTheme();
    }
})();


