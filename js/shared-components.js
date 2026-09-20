
/**
 * Dhage Travels - Shared Header & Footer Components
 * Renders the unified Header/Navbar and Footer components used across
 * Home, About Us, Contact Us, and Booking Engine.
 */

(function () {
    const SharedComponents = {
        /**
         * Generates the shared Navigation HTML markup
         */
        getNavbarHTML(activePage = 'book') {
            const isHome = activePage === 'home';
            const isBook = activePage === 'book';
            const isAbout = activePage === 'about';
            const isContact = activePage === 'contact';

            return `
    <nav class="shared-site-nav" id="sharedNavbar">
        <a href="home.html" class="logo-group" aria-label="Dhage Travels Home">
            <div class="logo-top">DHAGE</div>
            <div class="logo-bottom">TRAVELS</div>
        </a>
        <button class="shared-nav-toggle" id="sharedNavToggle" type="button" aria-label="Toggle navigation menu">
            <i class="bi bi-list"></i>
        </button>
        <ul class="nav-links" id="sharedNavLinks">
            <li><a href="home.html" class="${isHome ? 'active' : ''}">Home</a></li>
            <li><a href="book.html" class="${isBook ? 'active' : ''}">Book Now</a></li>
            <li><a href="about.html" class="${isAbout ? 'active' : ''}">About</a></li>
            <li><a href="contact.html" class="${isContact ? 'active' : ''}">Contact</a></li>
            <li>
                <a href="book.html?pnr=open" id="sharedPnrBtn" style="color:var(--brand-yellow); font-weight:700;">
                    <i class="bi bi-search"></i> Check PNR
                </a>
            </li>
        </ul>
    </nav>
            `.trim();
        },

        /**
         * Generates the shared Footer HTML markup
         */
        getFooterHTML() {
            return `
    <footer class="site-footer">
        <div class="footer-grid">
            <div class="footer-col">
                <div class="footer-logo">DHAGE<span style="display:block;font-size:12px;letter-spacing:3px;">TRAVELS</span></div>
                <p>Reliable, safe and premium bus travels since 1985.</p>
            </div>
            <div class="footer-col">
                <h5>Quick links</h5>
                <ul>
                    <li><a href="about.html">About</a></li>
                    <li><a href="book.html">Book Now</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h5>Support</h5>
                <ul>
                    <li><a href="contact.html">Contact</a></li>
                    <li><a href="#">Policy</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h5>Download app</h5>
                <ul>
                    <li><a href="#"><i class="bi bi-google-play"></i> Play</a></li>
                    <li><a href="#"><i class="bi bi-apple"></i> Store</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <span>© 2026 Dhage Travels</span>
            <span><a href="#">Privacy</a> | <a href="#">Terms</a></span>
        </div>
    </footer>
            `.trim();
        },

        /**
         * Mounts the navbar into a target container element
         */
        mountNavbar(target, activePage = 'book') {
            const el = typeof target === 'string' ? document.querySelector(target) : target;
            if (!el) return;
            el.innerHTML = this.getNavbarHTML(activePage);

            // Wire mobile hamburger toggle
            const toggleBtn = document.getElementById('sharedNavToggle');
            const navLinks = document.getElementById('sharedNavLinks');
            if (toggleBtn && navLinks) {
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    navLinks.classList.toggle('open');
                    toggleBtn.innerHTML = navLinks.classList.contains('open') ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
                });

                document.addEventListener('click', (e) => {
                    if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
                        navLinks.classList.remove('open');
                        toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
                    }
                });
            }

            // Wire PNR modal trigger on booking page if modal exists
            const pnrLink = document.getElementById('sharedPnrBtn');
            if (pnrLink && typeof window.openPnrModal === 'function') {
                pnrLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.openPnrModal();
                });
            }
        },

        /**
         * Mounts the footer into a target container element
         */
        mountFooter(target) {
            const el = typeof target === 'string' ? document.querySelector(target) : target;
            if (!el) return;
            el.innerHTML = this.getFooterHTML();
        },

        /**
         * Convenience initialization method
         */
        init(activePage = 'book', headerSelector = '#siteHeader', footerSelector = '#siteFooter') {
            document.addEventListener('DOMContentLoaded', () => {
                this.mountNavbar(headerSelector, activePage);
                this.mountFooter(footerSelector);
            });
            // If DOM is already loaded
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                this.mountNavbar(headerSelector, activePage);
                this.mountFooter(footerSelector);
            }
        }
    };

    window.SharedComponents = SharedComponents;
})();
