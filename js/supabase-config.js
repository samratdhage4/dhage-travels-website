/**
 * Supabase Configuration for Dhage Travels
 * Project: https://supabase.com/dashboard/project/aoxyaxoxfsgothmjjias
 */

window.SUPABASE_CONFIG = {
    url: 'https://aoxyaxoxfsgothmjjias.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFveHlheG94ZnNnb3RobWpqaWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NDU1MjYsImV4cCI6MjEwNTIyMTUyNn0.uwJnYSaJ4cOB83oTI6iz8oU-UXqdzGjzXIAtI6QljLY',

    isConfigured() {
        return !!(
            this.url &&
            this.anonKey &&
            this.url.startsWith('https://') &&
            this.anonKey.length > 20
        );
    }
};

// Initialize Supabase Client
(function () {
    let client = null;

    if (window.SUPABASE_CONFIG.isConfigured() && window.supabase) {
        try {
            client = window.supabase.createClient(
                window.SUPABASE_CONFIG.url,
                window.SUPABASE_CONFIG.anonKey,
                {
                    realtime: {
                        params: {
                            eventsPerSecond: 10
                        }
                    }
                }
            );
            console.log('%c[Dhage Travels]%c Supabase client connected successfully! 🚀', 'color:#f9d71c;font-weight:bold;', 'color:#10b981;');
        } catch (err) {
            console.error('[Dhage Travels] Failed to initialize Supabase client:', err);
            client = null;
        }
    } else {
        console.warn('[Dhage Travels] Supabase JS library not loaded or credentials incomplete.');
    }

    window.supabaseClient = client;
    window.db = client; // shorthand
})();
