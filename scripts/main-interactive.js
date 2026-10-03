// main-interactive.js
// Vanilla JS functionality to replace React hydration on client-side

function initInteractiveApp() {
    const API_BASE_URL = window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://api.eggycaronline.io';
    const API_BASE_CMT = 'https://backendreact.eggycaronline.io'
    // const ORIGIN = window.location.origin;
    const ORIGIN = 'eggycaronline.io';

    // 1. Auth & Header UI (Check Login State in Vanilla JS)
    function initAuth() {
        const token = localStorage.getItem('fe_token') || localStorage.getItem('token');
        const signInBtn = document.getElementById('btn-sign-in-header') || document.getElementById('header-login-btn');
        const userAvatar = document.getElementById('header-user-avatar');

        if (!token) return;

        let user = null;
        try {
            user = JSON.parse(localStorage.getItem('fe_user') || 'null');
        } catch (e) {}

        const updateBtn = (userData) => {
            if (!signInBtn) return;
            signInBtn.setAttribute('href', '/profile');
            const name = (userData && (userData.displayName || userData.email)) 
                ? (userData.displayName || userData.email.split('@')[0]) 
                : 'Profile';
            const avatarHtml = (userData && userData.avatar)
                ? `<img src="${userData.avatar}" alt="${name}" class="w-4 h-4 rounded-full object-cover inline" />`
                : `<span class="material-symbols-outlined text-[14px]" aria-hidden="true">account_circle</span>`;
            signInBtn.innerHTML = `${avatarHtml}<span>${name}</span>`;
            signInBtn.title = 'My Profile & Proxy Subdomains';
        };

        if (signInBtn) {
            updateBtn(user);
        }

        if (userAvatar && signInBtn && userAvatar !== signInBtn) {
            signInBtn.style.display = 'none';
            userAvatar.style.display = 'block';
        }

        // If user info is not yet in localStorage, fetch from API in background
        if (!user && token) {
            const AUTH_API = window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : 'https://api.eggycaronline.io/api';
            fetch(`${AUTH_API}/frontend-auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && (data.user || data.email)) {
                    const u = data.user || data;
                    localStorage.setItem('fe_user', JSON.stringify(u));
                    updateBtn(u);
                }
            })
            .catch(() => {});
        }
    }
    initAuth();

    // 2. Load More Button
    const loadMoreBtn = document.getElementById('btn-load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            const page = parseInt(loadMoreBtn.getAttribute('data-page') || '2');
            const originalText = loadMoreBtn.innerHTML;
            loadMoreBtn.innerHTML = 'Loading...';
            loadMoreBtn.disabled = true;

            try {
                const res = await fetch(`${API_BASE_URL}/v1/games?page=${page}&limit=16&origin=${ORIGIN}`);
                if (!res.ok) throw new Error('API Error');
                const data = await res.json();

                if (data.games && data.games.length > 0) {
                    const grid = document.getElementById('game-grid');
                    if (grid) {
                        data.games.forEach(game => {
                            const category = game.category || '';
                            const safeTag = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                            const href = `/${safeTag}/${game.slug}`;
                            const cardHtml = `
                                <a href="${href}" class="group relative bg-surface-container rounded-xl overflow-hidden border border-white/5 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(255,179,178,0.15)] transition-all duration-300 no-underline block h-full flex flex-col">
                                    <div class="aspect-[16/9] w-full overflow-hidden relative">
                                        <div class="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style="background-image: url('${game.imageUrl}')"></div>
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                    </div>
                                    <div class="p-3 flex-1 flex flex-col justify-end bg-gradient-to-t from-surface-container-high to-transparent">
                                        <h3 class="font-headline-lg font-bold text-on-surface text-[15px] leading-tight group-hover:text-primary transition-colors line-clamp-1">${game.title}</h3>
                                        <div class="flex items-center gap-2 mt-1.5 opacity-80">
                                            <span class="font-label-sm text-[10px] uppercase tracking-wider text-primary truncate">${game.category}</span>
                                        </div>
                                    </div>
                                </a>
                            `;
                            grid.insertAdjacentHTML('beforeend', cardHtml);
                        });
                    }
                    loadMoreBtn.setAttribute('data-page', (page + 1).toString());
                    loadMoreBtn.innerHTML = originalText;
                    loadMoreBtn.disabled = false;
                } else {
                    loadMoreBtn.style.display = 'none'; // No more games
                }
            } catch (err) {
                console.error('Load more failed', err);
                loadMoreBtn.innerHTML = 'Retry';
                loadMoreBtn.disabled = false;
            }
        });
    }

    // 2b. Load More Button for Tag Pages
    const loadMoreTagBtn = document.getElementById('btn-load-more-tag');
    if (loadMoreTagBtn) {
        loadMoreTagBtn.addEventListener('click', async () => {
            const page = parseInt(loadMoreTagBtn.getAttribute('data-page') || '2');
            const tag = loadMoreTagBtn.getAttribute('data-tag');
            const originalText = loadMoreTagBtn.innerHTML;
            loadMoreTagBtn.innerHTML = 'Loading...';
            loadMoreTagBtn.disabled = true;

            try {
                const res = await fetch(`${API_BASE_URL}/v1/tags/${tag}?page=${page}&limit=20&origin=${ORIGIN}`);
                if (!res.ok) throw new Error('API Error');
                const data = await res.json();

                if (data.games && data.games.length > 0) {
                    const grid = document.getElementById('game-grid-tag');
                    if (grid) {
                        data.games.forEach(game => {
                            const category = game.category || '';
                            const safeTag = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                            const href = `/${safeTag}/${game.slug}`;
                            const cardHtml = `
                                <a href="${href}" class="group relative bg-surface-container rounded-xl overflow-hidden border border-white/5 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(255,179,178,0.15)] transition-all duration-300 no-underline block h-full flex flex-col">
                                    <div class="aspect-[16/9] w-full overflow-hidden relative">
                                        <div class="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style="background-image: url('${game.imageUrl}')"></div>
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                    </div>
                                    <div class="p-3 flex-1 flex flex-col justify-end bg-gradient-to-t from-surface-container-high to-transparent">
                                        <h3 class="font-headline-lg font-bold text-on-surface text-[15px] leading-tight group-hover:text-primary transition-colors line-clamp-1">${game.title}</h3>
                                        <div class="flex items-center gap-2 mt-1.5 opacity-80">
                                            <span class="font-label-sm text-[10px] uppercase tracking-wider text-primary truncate">${game.category}</span>
                                        </div>
                                    </div>
                                </a>
                            `;
                            grid.insertAdjacentHTML('beforeend', cardHtml);
                        });
                    }
                    loadMoreTagBtn.setAttribute('data-page', (page + 1).toString());
                    loadMoreTagBtn.innerHTML = originalText;
                    loadMoreTagBtn.disabled = false;
                    
                    if (data.games.length < 20) {
                        loadMoreTagBtn.style.display = 'none'; // No more games
                    }
                } else {
                    loadMoreTagBtn.style.display = 'none'; // No more games
                }
            } catch (err) {
                console.error('Load more failed', err);
                loadMoreTagBtn.innerHTML = 'Retry';
                loadMoreTagBtn.disabled = false;
            }
        });
    }

    // 3. Reactions (Like / Dislike) — with active-state UI + localStorage
    const btnLike = document.getElementById('btn-like');
    const btnDislike = document.getElementById('btn-dislike');
    if (btnLike && btnDislike) {
        const slug = btnLike.getAttribute('data-slug');
        const likeCountEl = document.getElementById('like-count');
        const dislikeCountEl = document.getElementById('dislike-count');
        const storageKey = `reaction_${slug}`;

        // Active CSS classes matching React component styles
        const ACTIVE_LIKE = 'bg-primary/20 text-primary border border-primary/30';
        const ACTIVE_DISLIKE = 'bg-error/20 text-error border border-error/30';
        const INACTIVE = 'text-on-surface-variant hover:bg-surface-container-high';

        function setButtonState(btn, isActive, activeClasses) {
            // Remove all state classes first
            [ACTIVE_LIKE, ACTIVE_DISLIKE, INACTIVE].forEach(cls =>
                cls.split(' ').forEach(c => btn.classList.remove(c))
            );
            // Add the correct state classes
            const classes = isActive ? activeClasses : INACTIVE;
            classes.split(' ').forEach(c => btn.classList.add(c));

            // Toggle FILL icon
            const icon = btn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.style.fontVariationSettings = isActive ? "'FILL' 1" : "'FILL' 0";
            }
        }

        // Restore saved reaction state on load
        const savedReaction = localStorage.getItem(storageKey);
        if (savedReaction === 'like') {
            setButtonState(btnLike, true, ACTIVE_LIKE);
            setButtonState(btnDislike, false, '');
        } else if (savedReaction === 'dislike') {
            setButtonState(btnDislike, true, ACTIVE_DISLIKE);
            setButtonState(btnLike, false, '');
        }

        // Load reaction counts from API
        async function loadReactions() {
            if (!slug) return;
            try {
                const res = await fetch(`${API_BASE_CMT}/v1/games/${slug}/reaction`);
                if (!res.ok) return;
                const data = await res.json();
                if (likeCountEl) likeCountEl.textContent = data.likes ?? 0;
                if (dislikeCountEl) dislikeCountEl.textContent = data.dislikes ?? 0;
            } catch (e) {
                console.error('Failed to load reactions', e);
            }
        }
        loadReactions();

        async function handleReaction(type) {
            if (!slug) return;
            const currentReaction = localStorage.getItem(storageKey);
            const newReaction = currentReaction === type ? null : type;
            try {
                const res = await fetch(`${API_BASE_CMT}/v1/games/${slug}/reaction`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        previousReaction: currentReaction || 'none',  // ← thêm dòng này
                        newReaction: newReaction || 'none'
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    if (likeCountEl) likeCountEl.textContent = data.likes ?? 0;
                    if (dislikeCountEl) dislikeCountEl.textContent = data.dislikes ?? 0;
                }
            } catch (err) {
                console.error('Reaction failed', err);
            }

            // Update UI state
            if (newReaction === 'like') {
                setButtonState(btnLike, true, ACTIVE_LIKE);
                setButtonState(btnDislike, false, '');
                localStorage.setItem(storageKey, 'like');
            } else if (newReaction === 'dislike') {
                setButtonState(btnDislike, true, ACTIVE_DISLIKE);
                setButtonState(btnLike, false, '');
                localStorage.setItem(storageKey, 'dislike');
            } else {
                setButtonState(btnLike, false, '');
                setButtonState(btnDislike, false, '');
                localStorage.removeItem(storageKey);
            }
        }

        btnLike.addEventListener('click', () => handleReaction('like'));
        btnDislike.addEventListener('click', () => handleReaction('dislike'));
    }

    // 4. Report Button — show simple report modal
    const btnReport = document.getElementById('btn-report');
    if (btnReport) {
        btnReport.addEventListener('click', () => {
            const slug = btnReport.getAttribute('data-slug') || '';

            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';

            overlay.innerHTML = `
                <div style="background:var(--color-surface-container,#1e1e2e);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;width:90%;max-width:420px;color:var(--color-on-surface,#e4e2e9)">
                    <h3 style="margin:0 0 16px;font-size:18px;font-weight:700">Report Game</h3>
                    <select id="report-reason" style="width:100%;padding:10px 12px;border-radius:8px;background:var(--color-background,#131318);border:1px solid rgba(255,255,255,0.1);color:inherit;margin-bottom:12px;font-size:14px">
                        <option value="">Select a reason...</option>
                        <option value="broken">Game is broken / not loading</option>
                        <option value="inappropriate">Inappropriate content</option>
                        <option value="copyright">Copyright violation</option>
                        <option value="malware">Suspicious / malware</option>
                        <option value="other">Other</option>
                    </select>
                    <textarea id="report-details" placeholder="Additional details (optional)..." rows="3"
                        style="width:100%;padding:10px 12px;border-radius:8px;background:var(--color-background,#131318);border:1px solid rgba(255,255,255,0.1);color:inherit;resize:none;font-size:14px;margin-bottom:16px;box-sizing:border-box"></textarea>
                    <div style="display:flex;gap:8px;justify-content:flex-end">
                        <button id="report-cancel" style="padding:8px 20px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,0.15);color:inherit;cursor:pointer;font-size:13px">Cancel</button>
                        <button id="report-submit" style="padding:8px 20px;border-radius:8px;background:var(--color-error,#f2b8b5);color:var(--color-on-error,#601410);border:none;cursor:pointer;font-weight:600;font-size:13px">Submit Report</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            // Close on backdrop click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.remove();
            });

            document.getElementById('report-cancel').addEventListener('click', () => overlay.remove());

            document.getElementById('report-submit').addEventListener('click', async () => {
                const reason = document.getElementById('report-reason').value;
                const details = document.getElementById('report-details').value;
                if (!reason) { alert('Please select a reason'); return; }

                try {
                    await fetch(`${API_BASE_CMT}/v1/games/${slug}/report`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ reason, details })
                    });
                } catch (e) { /* silent */ }

                overlay.innerHTML = `
                    <div style="background:var(--color-surface-container,#1e1e2e);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px;text-align:center;color:var(--color-on-surface,#e4e2e9)">
                        <span class="material-symbols-outlined" style="font-size:48px;color:var(--color-primary,#ffb3b2);margin-bottom:12px;display:block">check_circle</span>
                        <p style="font-size:16px;font-weight:600;margin:0 0 8px">Report Submitted</p>
                        <p style="font-size:13px;opacity:0.7;margin:0">Thank you for helping us improve.</p>
                    </div>
                `;
                setTimeout(() => overlay.remove(), 2000);
            });
        });
    }

    // 5. Category Filter
    const catSearch = document.getElementById('category-search');
    if (catSearch) {
        catSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const items = document.querySelectorAll('.category-item');
            items.forEach(item => {
                const name = item.getAttribute('data-name') || '';
                if (name.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // 6. Iframe Play Button
    const gameIframe = document.getElementById('game-iframe') || document.querySelector('.game-iframe');
    const playButtons = document.querySelectorAll('#btn-iframe-play, .btn-iframe-play');
    const overlays = document.querySelectorAll('#iframe-overlay, .iframe-overlay');

    if (playButtons.length > 0 && gameIframe) {
        playButtons.forEach(btnPlay => {
            btnPlay.addEventListener('click', () => {
                // Hide overlay
                overlays.forEach(ov => ov.style.display = 'none');

                // Show & load iframe
                gameIframe.style.display = 'block';
                const src = gameIframe.getAttribute('data-src');
                if (src && !gameIframe.getAttribute('src')) {
                    gameIframe.setAttribute('src', src);
                }

                gameIframe.addEventListener('load', () => {
                    const spinner = document.getElementById('iframe-loading-spinner');
                    if (spinner) spinner.style.display = 'none';

                    // Enable fullscreen button after game loads
                    const btnFs = document.getElementById('btn-fullscreen');
                    if (btnFs) {
                        btnFs.disabled = false;
                        btnFs.title = 'Fullscreen';
                    }
                }, { once: true });
            });
        });
    }

    // 7. Fullscreen Button
    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen && gameIframe) {
        btnFullscreen.addEventListener('click', () => {
            if (gameIframe.requestFullscreen) {
                gameIframe.requestFullscreen();
            } else if (gameIframe.webkitRequestFullscreen) {
                gameIframe.webkitRequestFullscreen();
            } else if (gameIframe.msRequestFullscreen) {
                gameIframe.msRequestFullscreen();
            }
        });
    }

    // 8. Comments System
    const commentSection = document.getElementById('comments-section');
    const btnCommentSubmit = document.getElementById('btn-comment-submit');
    const commentNameInput = document.getElementById('comment-name-input');
    const commentTextInput = document.getElementById('comment-text-input');
    const commentList = document.getElementById('comment-list');
    const commentCountEl = document.getElementById('comment-count');
    const commentAvatar = document.getElementById('comment-avatar');

    if (commentSection && btnCommentSubmit) {
        const commentSlug = btnCommentSubmit.getAttribute('data-slug')
            || window.location.pathname.split('/').filter(Boolean).pop();

        // Random avatar colors
        const AVATAR_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
        function randomColor() { return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]; }

        // Update avatar letter when name changes
        if (commentNameInput && commentAvatar) {
            commentNameInput.addEventListener('input', () => {
                const name = commentNameInput.value.trim();
                commentAvatar.textContent = (name || 'G')[0].toUpperCase();
            });
        }

        // Render a single comment HTML
        function renderComment(c) {
            const username = c.username || c.user || 'Anonymous';
            const initial = username[0].toUpperCase();
            const color = c.avatarColor || randomColor();
            const time = c.timestamp ? new Date(c.timestamp).toLocaleString() : (c.time || '');
            const content = (c.content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            let repliesHtml = '';
            if (c.replies && c.replies.length > 0) {
                const repliesInner = c.replies.map(r => {
                    const rUser = r.username || 'Admin';
                    const rInit = rUser[0].toUpperCase();
                    const rColor = r.avatarColor || '#0ea5e9';
                    const rTime = r.timestamp ? new Date(r.timestamp).toLocaleString() : '';
                    const rContent = (r.content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    const domainBadge = r.domain
                        ? `<span class="font-label-sm text-[8px] text-accent/70 border border-accent/20 px-1 rounded bg-accent/5">${r.domain.replace(/^https?:\/\/(www\.)?/, '')}</span>`
                        : '';
                    return `
                        <div class="flex gap-3 p-3 bg-surface-container-low border-l border-secondary-fixed rounded-r">
                            <div class="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-white text-[10px] uppercase" style="background-color:${rColor}">${rInit}</div>
                            <div class="flex-1">
                                <div class="flex flex-wrap items-baseline gap-2 mb-0.5">
                                    <span class="font-label-sm text-[12px] text-secondary-fixed">${rUser}</span>
                                    <span class="font-label-sm text-[9px] text-outline">${rTime}</span>
                                    ${domainBadge}
                                </div>
                                <p class="font-body-md text-[13px] text-on-surface-variant leading-relaxed">${rContent}</p>
                            </div>
                        </div>`;
                }).join('');
                repliesHtml = `<div class="pl-6 flex flex-col gap-2 border-l border-outline-variant/30 ml-4">${repliesInner}</div>`;
            }

            return `
                <div class="flex flex-col gap-2">
                    <div class="flex gap-4 p-4 border-l-2 border-outline-variant hover:border-primary-fixed bg-surface-container-lowest transition-colors rounded-r">
                        <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-white text-xs uppercase" style="background-color:${color}">${initial}</div>
                        <div class="flex-1">
                            <div class="flex flex-wrap items-baseline gap-2 mb-1">
                                <span class="font-label-sm text-label-sm text-primary-fixed">${username}</span>
                                <span class="font-label-sm text-[10px] text-outline">${time}</span>
                            </div>
                            <p class="font-body-md text-[14px] text-on-surface-variant leading-relaxed">${content}</p>
                        </div>
                    </div>
                    ${repliesHtml}
                </div>`;
        }

        // Load comments from API
        async function loadComments() {
            try {
                const res = await fetch(`${API_BASE_CMT}/v1/games/${commentSlug}/comments`);
                if (!res.ok) return;
                const data = await res.json();
                const comments = data.comments || data || [];

                if (commentList) {
                    commentList.innerHTML = comments.map(renderComment).join('');
                }
                if (commentCountEl) {
                    commentCountEl.textContent = `${comments.length} MESSAGES`;
                }
            } catch (e) {
                console.error('Failed to load comments', e);
            }
        }

        // Load comments on page load
        loadComments();

        // Submit comment
        btnCommentSubmit.addEventListener('click', async () => {
            const name = (commentNameInput ? commentNameInput.value.trim() : '') || 'Anonymous';
            const text = commentTextInput ? commentTextInput.value.trim() : '';
            if (!text) return;

            // Disable button while submitting
            btnCommentSubmit.disabled = true;
            const originalText = btnCommentSubmit.textContent;
            btnCommentSubmit.textContent = 'Sending...';

            try {
                const token = (localStorage.getItem('fe_token') || localStorage.getItem('token'));
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch(`${API_BASE_CMT}/v1/games/${commentSlug}/comments`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        name: name,
                        text: text,
                    })
                });

                if (res.ok) {
                    // Clear input
                    if (commentTextInput) commentTextInput.value = '';

                    // Reload comments
                    await loadComments();
                }
            } catch (e) {
                console.error('Comment submit failed', e);
            }

            btnCommentSubmit.disabled = false;
            btnCommentSubmit.textContent = originalText;
        });
    }

    // 9. XP Tracking (postMessage listener)
    if (gameIframe) {
        const MIN_PLAY_SECONDS = 10;
        let interactionCount = 0;
        let lastInteractionTime = Date.now();
        let sessionStartTime = Date.now();
        let xpAwarded = false;

        // Listen for postMessage from the game iframe
        window.addEventListener('message', () => {
            interactionCount++;
            lastInteractionTime = Date.now();
        });

        // Periodically check if XP should be claimed
        setInterval(() => {
            const token = (localStorage.getItem('fe_token') || localStorage.getItem('token'));
            if (!token || xpAwarded) return;

            // Get slug from the Like button (or from URL path)
            const slug = (document.getElementById('btn-like') && document.getElementById('btn-like').getAttribute('data-slug'))
                || window.location.pathname.split('/').filter(Boolean).pop();
            if (!slug) return;

            const sessionDuration = (Date.now() - sessionStartTime) / 1000;
            const timeSinceInteraction = (Date.now() - lastInteractionTime) / 1000;

            if (sessionDuration > MIN_PLAY_SECONDS && interactionCount >= 2 && timeSinceInteraction < 30) {
                fetch(`${API_BASE_URL}/v1/xp/claim`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ gameId: slug, duration: Math.floor(sessionDuration) })
                }).then(() => {
                    xpAwarded = true;
                }).catch(() => { });

                interactionCount = 0;
                sessionStartTime = Date.now();
            }
        }, 30000);
    }

    // 10. Initialize Google Ads for manual slots
    const adSlots = document.querySelectorAll('.adsbygoogle');
    if (adSlots.length > 0) {
        adSlots.forEach(() => {
            try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { }
        });
    }

    // 11. Search Functionality
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        let searchTimeout = null;

        // Hide dropdown when clicking outside
        document.addEventListener('mousedown', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });

        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length > 0) {
                searchResults.style.display = 'block';
            }
        });

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length === 0) {
                searchResults.style.display = 'none';
                return;
            }

            searchResults.style.display = 'block';
            searchResults.innerHTML = `
                <div class="p-4 text-center text-on-surface-variant font-label-sm flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Searching...
                </div>
            `;

            if (searchTimeout) clearTimeout(searchTimeout);

            searchTimeout = setTimeout(async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/v1/games?search=${encodeURIComponent(query)}&limit=5&origin=${ORIGIN}`);
                    if (!res.ok) throw new Error('API Error');
                    const data = await res.json();

                    if (data.games && data.games.length > 0) {
                        let html = '<ul class="flex flex-col">';
                        data.games.forEach(game => {
                            const category = game.category || '';
                            const safeTag = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                            let href = `/${safeTag}/${game.slug}`;
                            if (game.slug === 'eggy-car-unblocked') {
                                href = `/${game.slug}`;
                            }
                            
                            const imgUrl = game.imageUrl && game.imageUrl.includes('img.gamedistribution.com') && !game.imageUrl.includes('512x512')
                                ? game.imageUrl.replace('img.gamedistribution.com', 'img.gamedistribution.com/512x512')
                                : game.imageUrl;

                            html += `
                                <li>
                                    <a href="${href}" class="flex items-center gap-3 p-3 hover:bg-surface-container-highest transition-colors border-b border-outline-variant/50 last:border-0">
                                        <img src="${imgUrl}" alt="${game.title}" class="w-12 h-12 rounded object-cover" loading="lazy" />
                                        <div>
                                            <div class="font-title-sm text-on-surface group-hover:text-primary transition-colors">${game.title}</div>
                                            <div class="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">${category.replace(/-/g, ' ')}</div>
                                        </div>
                                    </a>
                                </li>
                            `;
                        });
                        html += '</ul>';
                        searchResults.innerHTML = html;
                    } else {
                        searchResults.innerHTML = '<div class="p-4 text-center text-on-surface-variant font-label-sm">No games found</div>';
                    }
                } catch (err) {
                    console.error('Search failed', err);
                    searchResults.innerHTML = '<div class="p-4 text-center text-on-surface-variant font-label-sm">Search error</div>';
                }
            }, 300);
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractiveApp);
} else {
    initInteractiveApp();
}