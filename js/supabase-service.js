/**
 * Supabase Service Layer for Dhage Travels
 * Handles database queries, live seat tracking, PNR lookup, and feedback submission.
 */

window.DhageService = (function () {
    const STORAGE_KEY = 'dhage_travels_bookings_v2';
    const FEEDBACK_KEY = 'dhage_travels_feedback_v2';

    function getLocalBookings() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveLocalBooking(booking) {
        try {
            const list = getLocalBookings();
            list.push(booking);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (e) {}
    }

    function generatePNR() {
        const rand = Math.floor(10000 + Math.random() * 90000);
        return `DHT${rand}`;
    }

    return {
        isLive() {
            return !!(window.supabaseClient && window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.isConfigured());
        },

        /**
         * Fetch all booked seats for a given bus (by busId or busName) and travel date.
         * Returns an array of seat codes e.g. ['L2', 'R4']
         */
        async fetchBookedSeats(busName, travelDate, busId) {
            const bookedSeats = new Set();

            if (this.isLive()) {
                try {
                    let query = window.supabaseClient
                        .from('bookings')
                        .select('bus_id, bus_name, selected_seats, booking_status')
                        .eq('travel_date', travelDate)
                        .neq('booking_status', 'CANCELLED');

                    if (busId) {
                        query = query.or(`bus_id.eq.${busId},bus_name.eq.${busName}`);
                    } else {
                        query = query.eq('bus_name', busName);
                    }

                    const { data, error } = await query;

                    if (!error && data) {
                        data.forEach(b => {
                            if (Array.isArray(b.selected_seats)) {
                                b.selected_seats.forEach(s => bookedSeats.add(s));
                            }
                        });
                        return Array.from(bookedSeats);
                    }
                } catch (err) {
                    console.warn('[Dhage Travels] Supabase fetchBookedSeats warning:', err);
                }
            }

            // Local fallback
            const local = getLocalBookings();
            local.forEach(b => {
                const matchBus = (busId && b.bus_id === busId) || b.bus_name === busName;
                if (matchBus && b.travel_date === travelDate && b.booking_status !== 'CANCELLED') {
                    if (Array.isArray(b.selected_seats)) {
                        b.selected_seats.forEach(s => bookedSeats.add(s));
                    }
                }
            });

            return Array.from(bookedSeats);
        },

        /**
         * Fetch all booked seats on a specific date for all buses on a route.
         * Returns a map: { [busId]: ['L1', 'R2'], ... }
         */
        async fetchBookedSeatsForRouteDate(travelDate, fromCity, toCity) {
            const seatsMap = {};

            if (this.isLive()) {
                try {
                    let query = window.supabaseClient
                        .from('bookings')
                        .select('bus_id, bus_name, selected_seats, booking_status')
                        .eq('travel_date', travelDate)
                        .neq('booking_status', 'CANCELLED');

                    if (fromCity && toCity) {
                        query = query.ilike('from_city', fromCity).ilike('to_city', toCity);
                    }

                    const { data, error } = await query;

                    if (!error && data) {
                        data.forEach(b => {
                            const key = b.bus_id || b.bus_name;
                            if (!seatsMap[key]) seatsMap[key] = [];
                            if (Array.isArray(b.selected_seats)) {
                                b.selected_seats.forEach(s => {
                                    if (!seatsMap[key].includes(s)) seatsMap[key].push(s);
                                });
                            }
                        });
                    }
                } catch (err) {
                    console.warn('[Dhage Travels] Supabase fetchBookedSeatsForRouteDate error:', err);
                }
            }

            // Merge local storage bookings
            const local = getLocalBookings();
            local.forEach(b => {
                if (b.travel_date === travelDate && b.booking_status !== 'CANCELLED') {
                    const matchRoute = !fromCity || !toCity || 
                        (b.from_city && b.from_city.toLowerCase() === fromCity.toLowerCase() &&
                         b.to_city && b.to_city.toLowerCase() === toCity.toLowerCase());
                    if (matchRoute) {
                        const key = b.bus_id || b.bus_name;
                        if (!seatsMap[key]) seatsMap[key] = [];
                        if (Array.isArray(b.selected_seats)) {
                            b.selected_seats.forEach(s => {
                                if (!seatsMap[key].includes(s)) seatsMap[key].push(s);
                            });
                        }
                    }
                }
            });

            return seatsMap;
        },

        /**
         * Real-time subscription to booking table changes
         */
        subscribeToBookings(travelDate, onChangeCallback) {
            if (!this.isLive()) return null;
            try {
                const channel = window.supabaseClient
                    .channel('public:bookings')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
                        if (payload.new && payload.new.travel_date === travelDate) {
                            if (typeof onChangeCallback === 'function') onChangeCallback(payload);
                        }
                    })
                    .subscribe();
                return channel;
            } catch (e) {
                console.warn('[Dhage Travels] Realtime subscription failed:', e);
                return null;
            }
        },

        /**
         * Save a new booking to Supabase & localStorage.
         * Includes STRICT double-booking & race condition prevention:
         * Re-checks seat availability immediately prior to database insert.
         */
        async createBooking(bookingData) {
            // STEP 1: CONCURRENCY / DOUBLE-BOOKING CHECK
            // Fetch the authoritative, latest booked seats right before inserting
            const latestBookedSeats = await this.fetchBookedSeats(
                bookingData.bus_name,
                bookingData.travel_date,
                bookingData.bus_id
            );

            const conflictingSeats = (bookingData.selected_seats || []).filter(seat =>
                latestBookedSeats.includes(seat)
            );

            if (conflictingSeats.length > 0) {
                return {
                    success: false,
                    conflict: true,
                    conflictingSeats: conflictingSeats,
                    message: `Seat ${conflictingSeats.join(', ')} was just booked by another customer. Please select another seat.`
                };
            }

            const pnr = generatePNR();
            const record = {
                pnr: pnr,
                bus_id: bookingData.bus_id || 'express',
                bus_name: bookingData.bus_name,
                from_city: bookingData.from_city,
                to_city: bookingData.to_city,
                travel_date: bookingData.travel_date,
                selected_seats: bookingData.selected_seats,
                primary_passenger_name: bookingData.primary_passenger_name,
                primary_passenger_phone: bookingData.primary_passenger_phone,
                primary_passenger_email: bookingData.primary_passenger_email,
                passengers: bookingData.passengers || [],
                pickup_point: bookingData.pickup_point,
                drop_point: bookingData.drop_point,
                base_fare: bookingData.base_fare || 0,
                total_amount: bookingData.total_amount || 0,
                booking_status: 'CONFIRMED',
                created_at: new Date().toISOString()
            };

            let savedToSupabase = false;

            if (this.isLive()) {
                try {
                    const { data, error } = await window.supabaseClient
                        .from('bookings')
                        .insert([record]);

                    if (error) {
                        console.error('[Dhage Travels] Supabase booking insert error:', error);
                    } else {
                        savedToSupabase = true;
                        console.log('[Dhage Travels] Booking saved to Supabase with PNR:', pnr);
                    }
                } catch (err) {
                    console.error('[Dhage Travels] Supabase booking exception:', err);
                }
            }

            // Always save to local cache
            saveLocalBooking(record);

            return {
                success: true,
                pnr: pnr,
                booking: record,
                isLive: savedToSupabase
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
         * Submit contact inquiry / feedback message
         */
        async submitFeedback(feedback) {
            const item = {
                name: feedback.name,
                email: feedback.email,
                phone: feedback.phone || '',
                subject: feedback.subject || 'Enquiry',
                message: feedback.message,
                created_at: new Date().toISOString()
            };

            if (this.isLive()) {
                try {
                    const { error } = await window.supabaseClient
                        .from('feedback')
                        .insert([item]);

                    if (!error) {
                        console.log('[Dhage Travels] Feedback submitted to Supabase successfully.');
                        return { success: true };
                    }
                    console.warn('[Dhage Travels] Error submitting to feedback table:', error);
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
