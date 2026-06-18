let deletedCardId = null;
        let undoTimeout = null;

        // Delete Card Logic
        window.deleteCard = function(id) {
            const cardEl = document.getElementById('card-' + id);
            if(!cardEl) return;
            
            // Add deleting animation class
            cardEl.classList.add('deleting');
            
            // Wait for animation, then hide
            setTimeout(() => {
                // Jangan sembunyikan jika card sudah di-undo (deletedCardId sudah null atau berubah)
                if (deletedCardId === id) {
                    cardEl.style.display = 'none';
                }
            }, 250); // Matches CSS transition time

            // Permanently delete previously queued item
            if (deletedCardId !== null && deletedCardId !== id) {
                const prevDeleted = document.getElementById('card-' + deletedCardId);
                if(prevDeleted) prevDeleted.style.display = 'none';
            }

            deletedCardId = id;
            showSnackbar();
        };

        // Snackbar Logic
        function showSnackbar() {
            const snackbar = document.getElementById('undo-snackbar');
            snackbar.classList.add('show');
            
            if(undoTimeout) clearTimeout(undoTimeout);
            
            // Auto hide and permanently delete after 4s
            undoTimeout = setTimeout(() => {
                snackbar.classList.remove('show');
                if(deletedCardId) {
                    const cardEl = document.getElementById('card-' + deletedCardId);
                    if(cardEl) cardEl.style.display = 'none';
                    deletedCardId = null;
                }
            }, 4000); 
        }

        // Undo Button Logic
        window.undoDelete = function() {
            if(deletedCardId) {
                const cardEl = document.getElementById('card-' + deletedCardId);
                if(cardEl) {
                    cardEl.style.display = 'flex';
                    // Force reflow for animation restart
                    void cardEl.offsetWidth;
                    cardEl.classList.remove('deleting');
                }
                deletedCardId = null;
            }
            
            const snackbar = document.getElementById('undo-snackbar');
            snackbar.classList.remove('show');
            if(undoTimeout) clearTimeout(undoTimeout);
        };

        // Top Apps Submenu
        const topAppsBtn = document.getElementById('top-apps-btn');
        const topSubmenu = document.getElementById('top-submenu');

        topAppsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = topAppsBtn.getAttribute('aria-expanded') === 'true';
            topAppsBtn.setAttribute('aria-expanded', !isExpanded);
            topSubmenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!topSubmenu.contains(e.target) && e.target !== topAppsBtn) {
                topSubmenu.classList.remove('active');
                topAppsBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Drawer Logic
        const burgerBtn = document.getElementById('burger-btn');
        const drawer = document.getElementById('drawer');
        const drawerOverlay = document.getElementById('drawer-overlay');

        function openDrawer() {
            drawer.classList.add('active');
            drawerOverlay.classList.add('active');
            burgerBtn.setAttribute('aria-expanded', 'true');
            drawer.setAttribute('aria-hidden', 'false');
        }

        function closeDrawer() {
            drawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
            burgerBtn.setAttribute('aria-expanded', 'false');
            drawer.setAttribute('aria-hidden', 'true');
        }

        burgerBtn.addEventListener('click', openDrawer);
        drawerOverlay.addEventListener('click', closeDrawer);

        // Tabs Logic
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            });
        });

        // Bottom Navigation Logic (Visual Only)
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navItems.forEach(nav => {
                    nav.classList.remove('active');
                    // Reset icon to outline
                    const icon = nav.querySelector('i');
                    if(icon) {
                        icon.className = icon.className.replace('ph-fill', 'ph');
                    }
                });
                item.classList.add('active');
                // Set active icon to fill
                const icon = item.querySelector('i');
                if(icon) {
                    icon.className = icon.className.replace('ph', 'ph-fill');
                    // Add base ph class back
                    icon.classList.add('ph');
                }
            });
        });

        // Refresh Logic
        const refreshBtn = document.getElementById('refresh-btn');
        const refreshIcon = refreshBtn.querySelector('i');

        window.refreshData = function() {
            if(refreshIcon.classList.contains('is-spinning')) return;
            
            refreshIcon.classList.add('is-spinning');
            
            // Simulate Data Fetch
            setTimeout(() => {
                refreshIcon.classList.remove('is-spinning');
                
                // Reset State
                deletedCardId = null;
                if(undoTimeout) clearTimeout(undoTimeout);
                document.getElementById('undo-snackbar').classList.remove('show');
                
                // Re-render
                document.querySelectorAll('.card').forEach(c => { c.classList.remove('deleting'); c.style.display = 'flex'; });
            }, 800);
        };

        refreshBtn.addEventListener('click', refreshData);

        // Animasi Moveover Logic (Programmatic)
        window.triggerMoveoverAnimation = function(element) {
            if(element) {
                // Menambahkan style inline untuk mensimulasikan hover/moveover
                element.style.transition = 'var(--transition)';
                element.style.transform = 'translateY(-4px) scale(1.02)';
                element.style.boxShadow = 'var(--shadow-md)';
                
                // Mengembalikan ke semula setelah 300ms
                setTimeout(() => {
                    element.style.transform = '';
                    element.style.boxShadow = '';
                }, 300);
            }
        };

        // Initialize App
        renderCards();