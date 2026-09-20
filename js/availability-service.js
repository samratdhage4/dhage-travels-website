/**
 * Dhage Travels - Central Availability & Booking Cutoff Service
 * Strictly enforces:
 *  1. Asia/Kolkata timezone datetime evaluation.
 *  2. 30-minute booking cutoff before scheduled departure.
 *  3. Past date and past departure time exclusion.
 *  4. Full bus exclusion (availableSeats === 0 => hidden from search results).
 *  5. Centralized, reusable logic across all components.
 */

(function () {
    const TIMEZONE = 'Asia/Kolkata';
    const CUTOFF_MINUTES = 30;

    /**
     * Get current Date object representing real-world time in Asia/Kolkata
     */
    function getCurrentKolkataTime() {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: TIMEZONE,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const parts = formatter.formatToParts(now);
        const getPart = type => parts.find(p => p.type === type).value;
        const year = getPart('year');
        const month = getPart('month');
        const day = getPart('day');
        let hour = getPart('hour');
        if (hour === '24') hour = '00';
        const minute = getPart('minute');
        const second = getPart('second');

        return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}+05:30`);
    }

    /**
     * Get today's date formatted as YYYY-MM-DD in Asia/Kolkata
     */
    function getTodayKolkataString() {
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: TIMEZONE,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date());
    }

    /**
     * Construct an exact Date object in Asia/Kolkata for a given travelDate (YYYY-MM-DD)
     * and bus departureTime (HH:mm in 24h format).
     */
    function getBusDepartureDateTime(travelDate, departureTime) {
        if (!travelDate || !departureTime) return null;
        const cleanTime = departureTime.trim().length === 5 ? `${departureTime.trim()}:00` : departureTime.trim();
        return new Date(`${travelDate}T${cleanTime}+05:30`);
    }

    /**
     * Calculate booking cutoff timestamp: Scheduled Departure - 30 minutes
     */
    function getBookingCutoff(departureDateTime) {
        if (!departureDateTime || isNaN(departureDateTime.getTime())) return null;
        return new Date(departureDateTime.getTime() - CUTOFF_MINUTES * 60 * 1000);
    }

    /**
     * Check if a specific bus is available for booking on a given travel date.
     *
     * Strict rules:
     * 1. Travel date must not be in the past.
     * 2. Current datetime in Asia/Kolkata must be strictly less than booking cutoff (Departure - 30m).
     * 3. Bus must be active.
     * 4. Available seats must be greater than 0 (fully booked bus MUST NOT appear).
     *
     * @param {Object} bus - Bus object from TravelConfig.BUS_INVENTORY
     * @param {string} travelDate - YYYY-MM-DD
     * @param {number} availableSeatsCount - Remaining unreserved seats
     * @param {Date} [overrideCurrentTime] - Optional date object for unit testing / mocking
     * @returns {boolean}
     */
    function isBusAvailable(bus, travelDate, availableSeatsCount, overrideCurrentTime) {
        if (!bus || bus.isActive === false) return false;

        const currentKolkataTime = overrideCurrentTime || getCurrentKolkataTime();
        const todayStr = getTodayKolkataString();

        // Rule 1: No past travel dates
        if (travelDate < todayStr) {
            return false;
        }

        // Rule 2: Booking cutoff calculation (Scheduled departure - 30 minutes)
        const departureDateTime = getBusDepartureDateTime(travelDate, bus.departureTime);
        if (!departureDateTime || isNaN(departureDateTime.getTime())) {
            return false;
        }

        const bookingCutoff = getBookingCutoff(departureDateTime);

        // Strict validation: At or after cutoff time, booking is CLOSED and bus is HIDDEN
        // Case 1: Departure 20:00, Current 19:29: current < cutoff (19:30) => AVAILABLE
        // Case 2: Departure 20:00, Current 19:30: current >= cutoff (19:30) => CLOSED / HIDE
        // Case 3: Departure 20:00, Current 20:01: current >= cutoff => CLOSED / HIDE
        if (currentKolkataTime.getTime() >= bookingCutoff.getTime()) {
            return false;
        }

        // Rule 3: Fully booked bus MUST NOT appear (availableSeats > 0)
        // Total seats = 18. If 18 booked, available = 0 => HIDE BUS
        if (availableSeatsCount <= 0) {
            return false;
        }

        return true;
    }

    /**
     * Filter a list of buses on a route to return only buses that are open for booking.
     * Fully booked, departed, or cutoff-passed buses are completely excluded.
     *
     * @param {Array} buses - Array of buses for route
     * @param {string} travelDate - YYYY-MM-DD
     * @param {Object} bookedSeatsMap - Map of busId -> array of booked seat strings
     * @param {Date} [currentTime] - Optional time override
     * @returns {Array} List of available buses with calculated availableSeats
     */
    function filterAvailableBuses(buses, travelDate, bookedSeatsMap = {}, currentTime) {
        const now = currentTime || getCurrentKolkataTime();

        return buses
            .map(bus => {
                const bookedList = bookedSeatsMap[bus.id] || bookedSeatsMap[bus.busName] || [];
                const totalSeats = bus.totalSeats || 18;
                const availableSeats = Math.max(0, totalSeats - bookedList.length);

                return {
                    ...bus,
                    bookedSeats: bookedList,
                    availableSeats: availableSeats
                };
            })
            .filter(bus => isBusAvailable(bus, travelDate, bus.availableSeats, now));
    }

    // EXPORT TO GLOBAL WINDOW OBJECT
    window.AvailabilityService = {
        TIMEZONE,
        CUTOFF_MINUTES,
        getCurrentKolkataTime,
        getTodayKolkataString,
        getBusDepartureDateTime,
        getBookingCutoff,
        isBusAvailable,
        filterAvailableBuses
    };
})();
