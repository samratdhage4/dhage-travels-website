/**
 * Supabase Configuration for Dhage Travels
 * 
 * Instructions:
 * 1. Create a free project at https://supabase.com
 * 2. Go to Project Settings -> API
 * 3. Copy "Project URL" and "anon public" key into the variables below.
 * 4. Run the sql script in `supabase_schema.sql` in the Supabase SQL Editor.
 * 
 * NOTE: If left empty, Dhage Travels will automatically run in "Demo Mode" with simulated
 * real-time sync across tabs using Web BroadcastChannel, so you can test all features immediately!
 */

window.SUPABASE_CONFIG = {
    // Paste your Supabase Project URL here (e.g. 'https://your-project.supabase.co')
    url: '',

    // Paste your Supabase anon/public key here (e.g. 'eyJhbGciOiJIUzI1NiIsInR5cCI6...')
    anonKey: '',

    // Realtime channel name
    realtimeChannel: 'dhage-bookings-realtime',

    isConfigured() {
        return !!(
            this.url &&
            this.anonKey &&
            this.url.startsWith('https://') &&
            this.anonKey.length > 20 &&
            !this.url.includes('your-project')
        );
    }
};

// Initialize Supabase Client if credentials are provided
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
        console.log('%c[Dhage Travels]%c Running in Simulated Realtime Mode (Add credentials in js/supabase-config.js to go live on Supabase)', 'color:#f9d71c;font-weight:bold;', 'color:#f59e0b;');
    }

    window.supabaseClient = client;
})();
