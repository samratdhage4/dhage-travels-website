/**
 * Toast Notification System for Dhage Travels
 * Provides sleek, non-blocking toast alerts (success, error, warning, info)
 */
(function () {
    const Toast = {
        container: null,

        init() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'dhage-toast-container';
                this.container.style.cssText = `
                    position: fixed;
                    top: 105px;
                    right: 24px;
                    z-index: 999999;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-width: 380px;
                    pointer-events: none;
                `;
                document.body.appendChild(this.container);
            }
        },

        show(message, type = 'info', duration = 4000) {
            this.init();

            const toast = document.createElement('div');
            toast.className = `dhage-toast dhage-toast-${type}`;
            toast.style.cssText = `
                background: #1e2430;
                color: #ffffff;
                border-radius: 12px;
                padding: 14px 18px;
                box-shadow: 0 12px 30px rgba(0,0,0,0.25);
                display: flex;
                align-items: center;
                gap: 12px;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                font-weight: 500;
                pointer-events: auto;
                animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                border-left: 5px solid ${this.getTypeColor(type)};
                position: relative;
                overflow: hidden;
            `;

            const iconMap = {
                success: 'bi-check-circle-fill',
                error: 'bi-exclamation-octagon-fill',
                warning: 'bi-exclamation-triangle-fill',
                info: 'bi-info-circle-fill'
            };

            const iconClass = iconMap[type] || iconMap.info;
            const iconColor = this.getTypeColor(type);

            toast.innerHTML = `
                <i class="bi ${iconClass}" style="font-size: 20px; color: ${iconColor}; flex-shrink: 0;"></i>
                <div style="flex: 1; line-height: 1.4;">${message}</div>
                <button type="button" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:16px; padding:0; display:flex; align-items:center;">
                    <i class="bi bi-x-lg"></i>
                </button>
            `;

            const closeBtn = toast.querySelector('button');
            closeBtn.addEventListener('click', () => this.dismiss(toast));

            this.container.appendChild(toast);

            if (duration > 0) {
                setTimeout(() => {
                    this.dismiss(toast);
                }, duration);
            }
        },

        dismiss(toast) {
            if (!toast || toast.dataset.dismissing) return;
            toast.dataset.dismissing = 'true';
            toast.style.animation = 'toastSlideOut 0.25s ease forwards';
            setTimeout(() => {
                if (toast.parentElement) toast.parentElement.removeChild(toast);
            }, 250);
        },

        getTypeColor(type) {
            switch (type) {
                case 'success': return '#10b981';
                case 'error': return '#ef4444';
                case 'warning': return '#f59e0b';
                case 'info':
                default: return '#f9d71c';
            }
        }
    };

    // Inject CSS keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastSlideIn {
            from { opacity: 0; transform: translateX(50px) scale(0.95); }
            to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastSlideOut {
            from { opacity: 1; transform: translateX(0) scale(1); }
            to { opacity: 0; transform: translateX(40px) scale(0.95); }
        }
    `;
    document.head.appendChild(style);

    window.DhageToast = Toast;
    window.showToast = (msg, type, duration) => Toast.show(msg, type, duration);
})();
