/**
 * Supabase Service Layer for Dhage Travels
 * Handles database queries, real-time WebSocket subscriptions,
 * seat gender tracking, and graceful fallback to Simulated Real-time.
 */

window.DhageService = (function () {
    const STORAGE_KEY = 'dhage_travels_bookings_v2';
    const FEEDBACK_KEY = 'dhage_travels_feedback_v2';
    const broadcastChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('dhage_realtime_sync') : null;

    // Default seeded bookings if testing in demo mode
    const DEFAULT_DEMO_BOOKINGS = [
        {
            pnr: 'DT-2026-84910',
            bus_name: 'Royal Cruiser',
            from_city: 'Mumbai',
            to_city: 'Majalgaon',
            travel_date: new Date().toLocaleDateString('en-CA'),
            selected_seats: ['L2B'],
            primary_passenger_name: 'Pooja Patil',
            primary_passenger_phone: '9822334455',
            primary_passenger_email: 'pooja.patil@example.com',
            primary_passenger_gender: 'Female',
            primary_passenger_age: 26,
            passengers: [{ seat: 'L2B', name: 'Pooja Patil', gender: 'Female', age: 26 }],
            pickup_point: 'Borivali',
            drop_point: 'Majalgaon Bus Stand',
            total_amount: 950,
            payment_method: 'Pay on Boarding',
            booking_status: 'CONFIRMED',
            created_at: new Date().toISOString()
        },
        {
            pnr: 'DT-2026-61245',
            bus_name: 'Royal Cruiser',
            from_city: 'Mumbai',
            to_city: 'Majalgaon',
            travel_date: new Date().toLocaleDateString('en-CA'),
            selected_seats: ['L5A', 'U3A'],
            primary_passenger_name: 'Amit Deshmukh',
            primary_passenger_phone: '9855112233',
            primary_passenger_email: 'amit.d@example.com',
            primary_passenger_gender: 'Male',
            primary_passenger_age: 32,
            passengers: [
                { seat: 'L5A', name: 'Amit Deshmukh', gender: 'Male', age: 32 },
                { seat: 'U3A', name: 'Vikas Kadam', gender: 'Male', age: 30 }
            ],
            pickup_point: 'Andheri',
            drop_point: 'Gandhi Chowk',
            total_amount: 1900,
            payment_method: 'UPI Demo',
            booking_status: 'CONFIRMED',
            created_at: new Date().toISOString()
        }
    ];

    function getLocalBookings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_BOOKINGS));
                return DEFAULT_DEMO_BOOKINGS;
            }
            return JSON.parse(raw);
        } catch (e) {
            return DEFAULT_DEMO_BOOKINGS;
        }
    }

    function saveLocalBooking(booking) {
        const list = getLocalBookings();
        list.push(booking);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        if (broadcastChannel) {
            broadcastChannel.postMessage({ type: 'NEW_BOOKING', booking });
        }
    }

    function generatePNR() {
        const year = new Date().getFullYear();
        const rand = Math.floor(10000 + Math.random() * 90000);
        return `DT-${year}-${rand}`;
    }

    return {
        /**
         * Check if Supabase client is live and ready
         */
        isLive() {
            return !!(window.supabaseClient && window.SUPABASE_CONFIG.isConfigured());
        },

        /**
         * Fetch all booked seats for a specific bus and travel date
         * Returns a map of seat numbers to passenger metadata (especially gender)
         * e.g. { "L2B": { gender: "Female", name: "Pooja P.", pnr: "DT-..." } }
         */
        async fetchBookedSeats(busName, travelDate) {
            const bookedMap = {};

            if (this.isLive()) {
                try {
                    const { data, error } = await window.supabaseClient
                        .from('bookings')
                        .select('pnr, selected_seats, primary_passenger_name, primary_passenger_gender, passengers, booking_status')
                        .eq('bus_name', busName)
                        .eq('travel_date', travelDate)
                        .neq('booking_status', 'CANCELLED');

                    if (error) throw error;

                    if (data && data.length > 0) {
                        data.forEach(booking => {
                            const passengersList = Array.isArray(booking.passengers) ? booking.passengers : [];
                            (booking.selected_seats || []).forEach(seat => {
                                // Match specific passenger assigned to this seat if available
                                const pass = passengersList.find(p => p.seat === seat);
                                bookedMap[seat] = {
                                    gender: pass ? pass.gender : (booking.primary_passenger_gender || 'Male'),
                                    name: pass ? pass.name : booking.primary_passenger_name,
                                    pnr: booking.pnr
                                };
                            });
                        });
                    }
                    return bookedMap;
                } catch (err) {
                    console.warn('[Dhage Travels] Supabase fetchBookedSeats error, falling back to local cache:', err);
                }
            }

            // Fallback to local storage (demo mode)
            const local = getLocalBookings();
            local.forEach(b => {
                if (b.bus_name === busName && b.travel_date === travelDate && b.booking_status !== 'CANCELLED') {
                    const passengersList = Array.isArray(b.passengers) ? b.passengers : [];
                    (b.selected_seats || []).forEach(seat => {
                        const pass = passengersList.find(p => p.seat === seat);
                        bookedMap[seat] = {
                            gender: pass ? pass.gender : (b.primary_passenger_gender || 'Male'),
                            name: pass ? pass.name : b.primary_passenger_name,
                            pnr: b.pnr
                        };
                    });
                }
            });

            return bookedMap;
        },

        /**
         * Subscribe to Realtime seat booking updates
         */
        subscribeToBusRealtime(busName, travelDate, onSeatBookedCallback) {
            let channel = null;

            if (this.isLive()) {
                try {
                    const channelName = `realtime-${busName.replace(/\s+/g, '-').toLowerCase()}-${travelDate}`;
                    channel = window.supabaseClient
                        .channel(channelName)
                        .on(
                            'postgres_changes',
                            {
                                event: '*',
                                schema: 'public',
                                table: 'bookings',
                                filter: `bus_name=eq.${busName}`
                            },
                            (payload) => {
                                console.log('[Dhage Travels] Realtime event received:', payload);
                                if (payload.new && payload.new.travel_date === travelDate) {
                                    if (typeof onSeatBookedCallback === 'function') {
                                        onSeatBookedCallback(payload.new);
                                    }
                                }
                            }
                        )
                        .subscribe((status) => {
                            console.log(`[Dhage Travels] Realtime subscription status [${channelName}]:`, status);
                        });
                } catch (err) {
                    console.error('[Dhage Travels] Supabase subscription failed:', err);
                }
            }

            // Also attach BroadcastChannel listener for simulated cross-tab real-time
            const broadcastHandler = (e) => {
                if (e.data && e.data.type === 'NEW_BOOKING') {
                    const b = e.data.booking;
                    if (b.bus_name === busName && b.travel_date === travelDate) {
                        if (typeof onSeatBookedCallback === 'function') {
                            onSeatBookedCallback(b);
                        }
                    }
                }
            };

            if (broadcastChannel) {
                broadcastChannel.addEventListener('message', broadcastHandler);
            }

            // Return cleanup function
            return () => {
                if (channel && window.supabaseClient) {
                    window.supabaseClient.removeChannel(channel);
                }
                if (broadcastChannel) {
                    broadcastChannel.removeEventListener('message', broadcastHandler);
                }
            };
        },

        /**
         * Save a new booking to Supabase & local storage
         */
        async createBooking(bookingData) {
            const pnr = generatePNR();
            const record = {
                ...bookingData,
                pnr,
                booking_status: 'CONFIRMED',
                created_at: new Date().toISOString()
            };

            let savedToSupabase = false;

            if (this.isLive()) {
                try {
                    const { data, error } = await window.supabaseClient
                        .from('bookings')
                        .insert([record])
                        .select()
                        .single();

                    if (error) throw error;
                    savedToSupabase = true;
                    console.log('[Dhage Travels] Booking saved to Supabase! PNR:', pnr);
                } catch (err) {
                    console.error('[Dhage Travels] Error saving booking to Supabase:', err);
                }
            }

            // Always save to local storage for instant access & offline guarantee
            saveLocalBooking(record);

            return {
                success: true,
                pnr,
                booking: record,
                isSupabaseLive: savedToSupabase
            };
        },

        /**
         * Look up a confirmed booking by PNR
         */
        async getBookingByPNR(pnr) {
            const cleanPNR = (pnr || '').trim().toUpperCase();

            if (this.isLive()) {
                try {
                    const { data, error } = await window.supabaseClient
                        .from('bookings')
                        .select('*')
                        .ilike('pnr', cleanPNR)
                        .maybeSingle();

                    if (!error && data) return data;
                } catch (err) {
                    console.warn('[Dhage Travels] Supabase getBookingByPNR error:', err);
                }
            }

            // Fallback to local
            const local = getLocalBookings();
            return local.find(b => (b.pnr || '').toUpperCase() === cleanPNR) || null;
        },

        /**
         * Look up bookings by 10-digit mobile number
         */
        async getBookingsByPhone(phone) {
            const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);

            if (this.isLive()) {
                try {
                    const { data, error } = await window.supabaseClient
                        .from('bookings')
                        .select('*')
                        .ilike('primary_passenger_phone', `%${cleanPhone}%`)
                        .order('created_at', { ascending: false });

                    if (!error && data && data.length > 0) return data;
                } catch (err) {
                    console.warn('[Dhage Travels] Supabase getBookingsByPhone error:', err);
                }
            }

            const local = getLocalBookings();
            return local.filter(b => (b.primary_passenger_phone || '').includes(cleanPhone));
        },

        /**
         * Cancel a booking by PNR
         */
        async cancelBooking(pnr) {
            const cleanPNR = (pnr || '').trim().toUpperCase();

            if (this.isLive()) {
                try {
                    await window.supabaseClient
                        .from('bookings')
                        .update({ booking_status: 'CANCELLED' })
                        .eq('pnr', cleanPNR);
                } catch (e) {
                    console.error('[Dhage Travels] Error cancelling in Supabase:', e);
                }
            }

            const local = getLocalBookings();
            const idx = local.findIndex(b => (b.pnr || '').toUpperCase() === cleanPNR);
            if (idx !== -1) {
                local[idx].booking_status = 'CANCELLED';
                localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
                if (broadcastChannel) {
                    broadcastChannel.postMessage({ type: 'CANCEL_BOOKING', pnr: cleanPNR });
                }
            }

            return { success: true, pnr: cleanPNR };
        },

        /**
         * Submit contact / feedback message
         */
        async submitFeedback(feedback) {
            const item = {
                ...feedback,
                created_at: new Date().toISOString()
            };

            if (this.isLive()) {
                try {
                    const { error } = await window.supabaseClient
                        .from('feedback')
                        .insert([item]);
                    if (!error) return { success: true };
                } catch (e) {
                    console.warn('[Dhage Travels] Feedback insert fallback:', e);
                }
            }

            // Local fallback
            try {
                const list = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
                list.push(item);
                localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
            } catch (e) {}

            return { success: true };
        }
    };
})();
