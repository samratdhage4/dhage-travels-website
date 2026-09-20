/**
 * Dhage Travels - Central Travel & Route Configuration
 * Configurable data structures for cities, routes, multi-bus fleets,
 * city-specific boarding points, and city-specific dropping points.
 */

(function () {
    // 1. ALL SERVICED CITIES IN MAHARASHTRA
    const CITIES = [
        'Mumbai',
        'Pune',
        'Nanded',
        'Majalgaon',
        'Parbhani',
        'Jalna',
        'Beed',
        'Georai',
        'Sonpeth',
        'Latur',
        'Pathri',
        'Hingoli',
        'Udgir',
        'Purna'
    ];

    // 2. ROUTE NETWORK (Origin -> Array of reachable destinations)
    const SERVICE_ROUTES = {
        Mumbai: ['Nanded', 'Majalgaon', 'Parbhani', 'Jalna', 'Beed', 'Georai', 'Sonpeth', 'Latur', 'Pune'],
        Pune: ['Nanded', 'Majalgaon', 'Parbhani', 'Jalna', 'Beed', 'Georai', 'Sonpeth', 'Latur', 'Mumbai'],
        Nanded: ['Mumbai', 'Pune', 'Majalgaon', 'Parbhani', 'Jalna', 'Latur'],
        Majalgaon: ['Mumbai', 'Pune', 'Nanded', 'Parbhani', 'Jalna', 'Beed'],
        Parbhani: ['Mumbai', 'Pune', 'Nanded', 'Majalgaon', 'Jalna', 'Latur'],
        Jalna: ['Mumbai', 'Pune', 'Nanded', 'Majalgaon', 'Parbhani'],
        Beed: ['Mumbai', 'Pune', 'Nanded', 'Majalgaon', 'Parbhani'],
        Georai: ['Mumbai', 'Pune', 'Nanded', 'Majalgaon'],
        Sonpeth: ['Mumbai', 'Pune', 'Majalgaon', 'Parbhani'],
        Latur: ['Mumbai', 'Pune', 'Nanded', 'Parbhani'],
        Pathri: ['Mumbai', 'Pune', 'Nanded'],
        Hingoli: ['Mumbai', 'Pune', 'Nanded'],
        Udgir: ['Mumbai', 'Pune', 'Nanded'],
        Purna: ['Mumbai', 'Pune', 'Nanded']
    };

    // 3. MULTI-BUS INVENTORY
    // Crucial: Each bus is a distinct object with unique ID, timing, seats, and pricing.
    // A single route contains multiple buses departing at different times.
    const BUS_INVENTORY = [
        // --- MUMBAI -> NANDED (3 distinct buses) ---
        {
            id: 'MUM-NAN-001',
            operatorId: 'dhage-001',
            busNumber: 'MH-26-BE-1985',
            busName: 'Volvo 9600 Luxury Sleeper (Prime)',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Mumbai',
            to: 'Nanded',
            departureTime: '20:00',
            departureTimeDisplay: '08:00 PM',
            arrivalTime: '06:30',
            arrivalTimeDisplay: '06:30 AM (Next Day)',
            duration: '10h 30m',
            fare: 950,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Blanket & Pillow', 'Reading Lamp', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'MUM-NAN-002',
            operatorId: 'dhage-002',
            busNumber: 'MH-26-BE-2024',
            busName: 'Volvo 9600 Multi-Axle Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Mumbai',
            to: 'Nanded',
            departureTime: '21:30',
            departureTimeDisplay: '09:30 PM',
            arrivalTime: '08:00',
            arrivalTimeDisplay: '08:00 AM (Next Day)',
            duration: '10h 30m',
            fare: 999,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Live GPS Tracking', 'Blanket & Pillow', 'High-Speed WiFi'],
            isActive: true
        },
        {
            id: 'MUM-NAN-003',
            operatorId: 'dhage-003',
            busNumber: 'MH-26-BE-3311',
            busName: 'Dhage Express Night Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Mumbai',
            to: 'Nanded',
            departureTime: '23:00',
            departureTimeDisplay: '11:00 PM',
            arrivalTime: '09:30',
            arrivalTimeDisplay: '09:30 AM (Next Day)',
            duration: '10h 30m',
            fare: 899,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Reading Lamp', 'Water Bottle'],
            isActive: true
        },

        // --- NANDED -> MUMBAI (3 distinct return buses) ---
        {
            id: 'NAN-MUM-001',
            operatorId: 'dhage-004',
            busNumber: 'MH-26-BE-1986',
            busName: 'Volvo 9600 Luxury Sleeper (Prime)',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Nanded',
            to: 'Mumbai',
            departureTime: '19:30',
            departureTimeDisplay: '07:30 PM',
            arrivalTime: '06:00',
            arrivalTimeDisplay: '06:00 AM (Next Day)',
            duration: '10h 30m',
            fare: 950,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Blanket & Pillow', 'Reading Lamp', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'NAN-MUM-002',
            operatorId: 'dhage-005',
            busNumber: 'MH-26-BE-2025',
            busName: 'Volvo 9600 Multi-Axle Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Nanded',
            to: 'Mumbai',
            departureTime: '21:00',
            departureTimeDisplay: '09:00 PM',
            arrivalTime: '07:30',
            arrivalTimeDisplay: '07:30 AM (Next Day)',
            duration: '10h 30m',
            fare: 999,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Live GPS Tracking', 'Blanket & Pillow', 'High-Speed WiFi'],
            isActive: true
        },
        {
            id: 'NAN-MUM-003',
            operatorId: 'dhage-006',
            busNumber: 'MH-26-BE-3312',
            busName: 'Dhage Express Night Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Nanded',
            to: 'Mumbai',
            departureTime: '22:30',
            departureTimeDisplay: '10:30 PM',
            arrivalTime: '09:00',
            arrivalTimeDisplay: '09:00 AM (Next Day)',
            duration: '10h 30m',
            fare: 899,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Reading Lamp', 'Water Bottle'],
            isActive: true
        },

        // --- PUNE -> NANDED (3 distinct buses) ---
        {
            id: 'PUN-NAN-001',
            operatorId: 'dhage-007',
            busNumber: 'MH-12-DT-8899',
            busName: 'Volvo 9600 Executive Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Pune',
            to: 'Nanded',
            departureTime: '19:30',
            departureTimeDisplay: '07:30 PM',
            arrivalTime: '05:30',
            arrivalTimeDisplay: '05:30 AM (Next Day)',
            duration: '10h 00m',
            fare: 899,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Blanket & Pillow', 'Reading Lamp'],
            isActive: true
        },
        {
            id: 'PUN-NAN-002',
            operatorId: 'dhage-008',
            busNumber: 'MH-12-DT-8800',
            busName: 'Volvo 9600 SuperBus Experience',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Pune',
            to: 'Nanded',
            departureTime: '21:00',
            departureTimeDisplay: '09:00 PM',
            arrivalTime: '07:00',
            arrivalTimeDisplay: '07:00 AM (Next Day)',
            duration: '10h 00m',
            fare: 950,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'WiFi', 'Blanket & Pillow', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'PUN-NAN-003',
            operatorId: 'dhage-009',
            busNumber: 'MH-12-DT-8801',
            busName: 'Dhage Express Night Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Pune',
            to: 'Nanded',
            departureTime: '22:45',
            departureTimeDisplay: '10:45 PM',
            arrivalTime: '08:45',
            arrivalTimeDisplay: '08:45 AM (Next Day)',
            duration: '10h 00m',
            fare: 850,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Water Bottle'],
            isActive: true
        },

        // --- NANDED -> PUNE (3 distinct return buses) ---
        {
            id: 'NAN-PUN-001',
            operatorId: 'dhage-010',
            busNumber: 'MH-12-DT-8898',
            busName: 'Volvo 9600 Executive Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Nanded',
            to: 'Pune',
            departureTime: '19:00',
            departureTimeDisplay: '07:00 PM',
            arrivalTime: '05:00',
            arrivalTimeDisplay: '05:00 AM (Next Day)',
            duration: '10h 00m',
            fare: 899,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Blanket & Pillow', 'Reading Lamp'],
            isActive: true
        },
        {
            id: 'NAN-PUN-002',
            operatorId: 'dhage-011',
            busNumber: 'MH-12-DT-8802',
            busName: 'Volvo 9600 SuperBus Experience',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Nanded',
            to: 'Pune',
            departureTime: '21:00',
            departureTimeDisplay: '09:00 PM',
            arrivalTime: '07:00',
            arrivalTimeDisplay: '07:00 AM (Next Day)',
            duration: '10h 00m',
            fare: 950,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'WiFi', 'Blanket & Pillow', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'NAN-PUN-003',
            operatorId: 'dhage-012',
            busNumber: 'MH-12-DT-8803',
            busName: 'Dhage Express Night Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Nanded',
            to: 'Pune',
            departureTime: '22:30',
            departureTimeDisplay: '10:30 PM',
            arrivalTime: '08:30',
            arrivalTimeDisplay: '08:30 AM (Next Day)',
            duration: '10h 00m',
            fare: 850,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Water Bottle'],
            isActive: true
        },

        // --- PUNE -> MAJALGAON (2 distinct buses) ---
        {
            id: 'PUN-MAJ-001',
            operatorId: 'dhage-013',
            busNumber: 'MH-23-AF-4421',
            busName: 'Volvo 9600 Luxury Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Pune',
            to: 'Majalgaon',
            departureTime: '20:30',
            departureTimeDisplay: '08:30 PM',
            arrivalTime: '04:30',
            arrivalTimeDisplay: '04:30 AM (Next Day)',
            duration: '8h 00m',
            fare: 799,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Blanket & Pillow', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'PUN-MAJ-002',
            operatorId: 'dhage-014',
            busNumber: 'MH-23-AF-4422',
            busName: 'Dhage Express Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Pune',
            to: 'Majalgaon',
            departureTime: '22:00',
            departureTimeDisplay: '10:00 PM',
            arrivalTime: '06:00',
            arrivalTimeDisplay: '06:00 AM (Next Day)',
            duration: '8h 00m',
            fare: 749,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Reading Lamp'],
            isActive: true
        },

        // --- MAJALGAON -> PUNE (2 distinct buses) ---
        {
            id: 'MAJ-PUN-001',
            operatorId: 'dhage-015',
            busNumber: 'MH-23-AF-4423',
            busName: 'Volvo 9600 Luxury Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Majalgaon',
            to: 'Pune',
            departureTime: '20:00',
            departureTimeDisplay: '08:00 PM',
            arrivalTime: '04:00',
            arrivalTimeDisplay: '04:00 AM (Next Day)',
            duration: '8h 00m',
            fare: 799,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Blanket & Pillow', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'MAJ-PUN-002',
            operatorId: 'dhage-016',
            busNumber: 'MH-23-AF-4424',
            busName: 'Dhage Express Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Majalgaon',
            to: 'Pune',
            departureTime: '21:30',
            departureTimeDisplay: '09:30 PM',
            arrivalTime: '05:30',
            arrivalTimeDisplay: '05:30 AM (Next Day)',
            duration: '8h 00m',
            fare: 749,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Reading Lamp'],
            isActive: true
        },

        // --- MUMBAI -> MAJALGAON (2 distinct buses) ---
        {
            id: 'MUM-MAJ-001',
            operatorId: 'dhage-017',
            busNumber: 'MH-26-BE-5511',
            busName: 'Volvo 9600 Luxury Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Mumbai',
            to: 'Majalgaon',
            departureTime: '20:00',
            departureTimeDisplay: '08:00 PM',
            arrivalTime: '05:30',
            arrivalTimeDisplay: '05:30 AM (Next Day)',
            duration: '9h 30m',
            fare: 899,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Blanket & Pillow', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'MUM-MAJ-002',
            operatorId: 'dhage-018',
            busNumber: 'MH-26-BE-5512',
            busName: 'Dhage Express Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Mumbai',
            to: 'Majalgaon',
            departureTime: '21:45',
            departureTimeDisplay: '09:45 PM',
            arrivalTime: '07:15',
            arrivalTimeDisplay: '07:15 AM (Next Day)',
            duration: '9h 30m',
            fare: 849,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Reading Lamp'],
            isActive: true
        },

        // --- MAJALGAON -> MUMBAI (2 distinct buses) ---
        {
            id: 'MAJ-MUM-001',
            operatorId: 'dhage-019',
            busNumber: 'MH-26-BE-5513',
            busName: 'Volvo 9600 Luxury Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Majalgaon',
            to: 'Mumbai',
            departureTime: '19:30',
            departureTimeDisplay: '07:30 PM',
            arrivalTime: '05:00',
            arrivalTimeDisplay: '05:00 AM (Next Day)',
            duration: '9h 30m',
            fare: 899,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Blanket & Pillow', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'MAJ-MUM-002',
            operatorId: 'dhage-020',
            busNumber: 'MH-26-BE-5514',
            busName: 'Dhage Express Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Majalgaon',
            to: 'Mumbai',
            departureTime: '21:15',
            departureTimeDisplay: '09:15 PM',
            arrivalTime: '06:45',
            arrivalTimeDisplay: '06:45 AM (Next Day)',
            duration: '9h 30m',
            fare: 849,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Reading Lamp'],
            isActive: true
        },

        // --- MUMBAI -> PARBHANI (2 distinct buses) ---
        {
            id: 'MUM-PAR-001',
            operatorId: 'dhage-021',
            busNumber: 'MH-22-PB-7001',
            busName: 'Volvo 9600 Luxury Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Mumbai',
            to: 'Parbhani',
            departureTime: '19:45',
            departureTimeDisplay: '07:45 PM',
            arrivalTime: '05:45',
            arrivalTimeDisplay: '05:45 AM (Next Day)',
            duration: '10h 00m',
            fare: 920,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Blanket & Pillow', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'MUM-PAR-002',
            operatorId: 'dhage-022',
            busNumber: 'MH-22-PB-7002',
            busName: 'Dhage Express Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Mumbai',
            to: 'Parbhani',
            departureTime: '21:15',
            departureTimeDisplay: '09:15 PM',
            arrivalTime: '07:15',
            arrivalTimeDisplay: '07:15 AM (Next Day)',
            duration: '10h 00m',
            fare: 870,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Reading Lamp'],
            isActive: true
        },

        // --- PARBHANI -> MUMBAI (2 distinct buses) ---
        {
            id: 'PAR-MUM-001',
            operatorId: 'dhage-023',
            busNumber: 'MH-22-PB-7003',
            busName: 'Volvo 9600 Luxury Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Parbhani',
            to: 'Mumbai',
            departureTime: '19:30',
            departureTimeDisplay: '07:30 PM',
            arrivalTime: '05:30',
            arrivalTimeDisplay: '05:30 AM (Next Day)',
            duration: '10h 00m',
            fare: 920,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Blanket & Pillow', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'PAR-MUM-002',
            operatorId: 'dhage-024',
            busNumber: 'MH-22-PB-7004',
            busName: 'Dhage Express Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Parbhani',
            to: 'Mumbai',
            departureTime: '21:00',
            departureTimeDisplay: '09:00 PM',
            arrivalTime: '07:00',
            arrivalTimeDisplay: '07:00 AM (Next Day)',
            duration: '10h 00m',
            fare: 870,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Reading Lamp'],
            isActive: true
        },

        // --- PUNE -> PARBHANI (2 distinct buses) ---
        {
            id: 'PUN-PAR-001',
            operatorId: 'dhage-025',
            busNumber: 'MH-22-PB-8001',
            busName: 'Volvo 9600 Luxury Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Pune',
            to: 'Parbhani',
            departureTime: '20:15',
            departureTimeDisplay: '08:15 PM',
            arrivalTime: '05:15',
            arrivalTimeDisplay: '05:15 AM (Next Day)',
            duration: '9h 00m',
            fare: 850,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Blanket & Pillow', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'PUN-PAR-002',
            operatorId: 'dhage-026',
            busNumber: 'MH-22-PB-8002',
            busName: 'Dhage Express Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Pune',
            to: 'Parbhani',
            departureTime: '22:30',
            departureTimeDisplay: '10:30 PM',
            arrivalTime: '07:30',
            arrivalTimeDisplay: '07:30 AM (Next Day)',
            duration: '9h 00m',
            fare: 799,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Reading Lamp'],
            isActive: true
        },

        // --- PARBHANI -> PUNE (2 distinct buses) ---
        {
            id: 'PAR-PUN-001',
            operatorId: 'dhage-027',
            busNumber: 'MH-22-PB-8003',
            busName: 'Volvo 9600 Luxury Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Parbhani',
            to: 'Pune',
            departureTime: '20:30',
            departureTimeDisplay: '08:30 PM',
            arrivalTime: '05:30',
            arrivalTimeDisplay: '05:30 AM (Next Day)',
            duration: '9h 00m',
            fare: 850,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Blanket & Pillow', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'PAR-PUN-002',
            operatorId: 'dhage-028',
            busNumber: 'MH-22-PB-8004',
            busName: 'Dhage Express Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Parbhani',
            to: 'Pune',
            departureTime: '22:00',
            departureTimeDisplay: '10:00 PM',
            arrivalTime: '07:00',
            arrivalTimeDisplay: '07:00 AM (Next Day)',
            duration: '9h 00m',
            fare: 799,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Reading Lamp'],
            isActive: true
        },

        // --- MUMBAI -> PUNE (2 distinct buses) ---
        {
            id: 'MUM-PUN-001',
            operatorId: 'dhage-029',
            busNumber: 'MH-12-DT-1101',
            busName: 'Volvo 9600 Express Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Mumbai',
            to: 'Pune',
            departureTime: '07:00',
            departureTimeDisplay: '07:00 AM',
            arrivalTime: '11:00',
            arrivalTimeDisplay: '11:00 AM',
            duration: '4h 00m',
            fare: 550,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'MUM-PUN-002',
            operatorId: 'dhage-030',
            busNumber: 'MH-12-DT-1102',
            busName: 'Volvo 9600 Night Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Mumbai',
            to: 'Pune',
            departureTime: '23:30',
            departureTimeDisplay: '11:30 PM',
            arrivalTime: '03:30',
            arrivalTimeDisplay: '03:30 AM (Next Day)',
            duration: '4h 00m',
            fare: 599,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Water Bottle'],
            isActive: true
        },

        // --- PUNE -> MUMBAI (2 distinct buses) ---
        {
            id: 'PUN-MUM-001',
            operatorId: 'dhage-031',
            busNumber: 'MH-12-DT-1103',
            busName: 'Volvo 9600 Express Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Pune',
            to: 'Mumbai',
            departureTime: '06:30',
            departureTimeDisplay: '06:30 AM',
            arrivalTime: '10:30',
            arrivalTimeDisplay: '10:30 AM',
            duration: '4h 00m',
            fare: 550,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'PUN-MUM-002',
            operatorId: 'dhage-032',
            busNumber: 'MH-12-DT-1104',
            busName: 'Volvo 9600 Night Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Pune',
            to: 'Mumbai',
            departureTime: '23:00',
            departureTimeDisplay: '11:00 PM',
            arrivalTime: '03:00',
            arrivalTimeDisplay: '03:00 AM (Next Day)',
            duration: '4h 00m',
            fare: 599,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Water Bottle'],
            isActive: true
        },

        // --- PUNE -> BEED (2 distinct buses) ---
        {
            id: 'PUN-BEE-001',
            operatorId: 'dhage-033',
            busNumber: 'MH-23-BE-6601',
            busName: 'Volvo 9600 Luxury Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Pune',
            to: 'Beed',
            departureTime: '21:00',
            departureTimeDisplay: '09:00 PM',
            arrivalTime: '03:30',
            arrivalTimeDisplay: '03:30 AM (Next Day)',
            duration: '6h 30m',
            fare: 699,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'PUN-BEE-002',
            operatorId: 'dhage-034',
            busNumber: 'MH-23-BE-6602',
            busName: 'Dhage Express Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Pune',
            to: 'Beed',
            departureTime: '22:30',
            departureTimeDisplay: '10:30 PM',
            arrivalTime: '05:00',
            arrivalTimeDisplay: '05:00 AM (Next Day)',
            duration: '6h 30m',
            fare: 649,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Water Bottle'],
            isActive: true
        },

        // --- BEED -> PUNE (2 distinct buses) ---
        {
            id: 'BEE-PUN-001',
            operatorId: 'dhage-035',
            busNumber: 'MH-23-BE-6603',
            busName: 'Volvo 9600 Luxury Sleeper',
            type: 'Volvo 9600 Sleeper • 2 + 1 Berths',
            from: 'Beed',
            to: 'Pune',
            departureTime: '21:00',
            departureTimeDisplay: '09:00 PM',
            arrivalTime: '03:30',
            arrivalTimeDisplay: '03:30 AM (Next Day)',
            duration: '6h 30m',
            fare: 699,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Water Bottle'],
            isActive: true
        },
        {
            id: 'BEE-PUN-002',
            operatorId: 'dhage-036',
            busNumber: 'MH-23-BE-6604',
            busName: 'Dhage Express Sleeper',
            type: 'AC Sleeper Coach • 2 + 1 Layout',
            from: 'Beed',
            to: 'Pune',
            departureTime: '22:30',
            departureTimeDisplay: '10:30 PM',
            arrivalTime: '05:00',
            arrivalTimeDisplay: '05:00 AM (Next Day)',
            duration: '6h 30m',
            fare: 649,
            totalSeats: 42,
            amenities: ['AC Sleeper', 'USB Charging', 'Water Bottle'],
            isActive: true
        }
    ];

    // 4. CONFIGURABLE PICKUP POINTS BY ORIGIN CITY
    // Each stop has [StopName, Description / Landmark]
    const PICKUP_POINTS_BY_CITY = {
        Mumbai: [
            ['Borivali', 'Western Express Highway, Near National Park'],
            ['Mira Road', 'Highway Flyover, Golden Chemical'],
            ['Andheri', 'Western Express Highway, Bisleri Compound'],
            ['Kurla', 'Nehru Nagar Bus Station'],
            ['Sion', 'Sion Circle, Opp. Cinemax'],
            ['Dadar', 'Pritam Hotel / Swami Narayan Temple'],
            ['Chembur', 'Maitri Park, Eastern Express Highway'],
            ['Vashi', 'Old Toll Naka / Bus Station'],
            ['Thane', 'Teen Hath Naka / Cadbury Junction'],
            ['Panvel', 'Near ST Stand, Highway Junction']
        ],
        Pune: [
            ['Swargate', 'Opp. Laxmi Narayan Theatre'],
            ['Wakad', 'Hinjewadi Bridge / Ginja Hotel'],
            ['Hinjewadi', 'Phase 1, Shivaji Chowk'],
            ['Shivajinagar', 'Near Pune Station / Sangamwadi'],
            ['Katraj', 'Wonder City / Katraj Bypass'],
            ['Hadapsar', 'Gadital Bus Stop'],
            ['Pimpri-Chinchwad', 'Near Chinchwad Station'],
            ['Yerwada', 'Gunjan Talkies / Ahmednagar Road']
        ],
        Nanded: [
            ['Nanded Bus Stand', 'Central Bus Depot Entrance'],
            ['CIDCO', 'CIDCO New Bus Stop, Shivaji Chowk'],
            ['Waghala', 'Highway Circle'],
            ['Railway Station', 'Station Road Exit Gate'],
            ['Hingoli Gate', 'Flyover Pillar No. 12'],
            ['Bhagyanagar', 'Main Road Chowk']
        ],
        Parbhani: [
            ['Parbhani Bus Stand', 'Main Central Bus Stand'],
            ['Ganpati Chowk', 'City Center'],
            ['Visawa Corner', 'Main Jintur Road'],
            ['Parbhani Railway Station', 'Station Road Front Gate'],
            ['R. R. Petrol Pump', 'Highway Junction point']
        ],
        Majalgaon: [
            ['Majalgaon Bus Stand', 'Main State Transport Depot'],
            ['Majalgaon City Tower', 'City Centre Circle'],
            ['Majalgaon Bypass', 'Highway-side pickup point']
        ],
        Jalna: [
            ['Jalna Bus Stand', 'Central Bus Depot'],
            ['Mondha Naka', 'Main Market Junction'],
            ['Seven Hills', 'Ambad Road Corner']
        ],
        Beed: [
            ['Beed Bus Stand', 'Central ST Depot'],
            ['Jalna Road Corner', 'Shahu Chowk'],
            ['Nagar Road Bypass', 'Near Toll Plaza']
        ],
        Georai: [
            ['Georai Bus Stand', 'Main Highway Stand'],
            ['Georai Bypass', 'National Highway 52 Junction']
        ],
        Sonpeth: [
            ['Sonpeth Bus Stand', 'Main Bus Depot'],
            ['Sonpeth Shivaji Chowk', 'City Center']
        ],
        Latur: [
            ['Latur Bus Stand', 'Central Bus Depot'],
            ['Gandhi Chowk', 'City Heart'],
            ['Shivaji Chowk', 'Barshi Road']
        ]
    };

    // Fallback pickup points for unconfigured origin cities
    const COMMON_PICKUP_POINTS = [
        ['Central Bus Station', 'Main ST Bus Stand Gate'],
        ['City Center Chowk', 'Main City Circle'],
        ['Highway Bypass', 'Near Main Toll / Highway Junction']
    ];

    // 5. CONFIGURABLE DROP POINTS BY DESTINATION CITY
    const DROP_POINTS_BY_CITY = {
        Nanded: [
            ['Nanded Bus Stand', 'Central Bus Depot Exit'],
            ['CIDCO', 'CIDCO New Bus Stop'],
            ['Waghala', 'Highway Junction'],
            ['Railway Station', 'Platform 1 Side Station Gate'],
            ['Hingoli Gate', 'Flyover Drop Point']
        ],
        Mumbai: [
            ['Vashi', 'Highway Toll Naka Plaza'],
            ['Chembur', 'Maitri Park Drop Stop'],
            ['Sion', 'Sion Circle Drop Point'],
            ['Dadar', 'Pritam Hotel, Dadar East'],
            ['Andheri', 'Western Express Highway'],
            ['Borivali', 'National Park Bridge Drop point']
        ],
        Pune: [
            ['Wakad', 'Hinjewadi Flyover Bridge'],
            ['Shivajinagar', 'Sangamwadi Parking No. 2'],
            ['Swargate', 'Opp. ST Depot Exit'],
            ['Hadapsar', 'Gadital Flyover End'],
            ['Katraj', 'Katraj Tunnel Approach']
        ],
        Majalgaon: [
            ['Majalgaon Bus Stand', 'Main State Transport Depot'],
            ['Majalgaon Bypass', 'Highway Toll Naka']
        ],
        Parbhani: [
            ['Parbhani Bus Stand', 'Central Bus Stand'],
            ['Visawa Corner', 'Main Jintur Road'],
            ['Station Road', 'Opp. Railway Station']
        ],
        Jalna: [
            ['Jalna Bus Stand', 'Central Bus Depot'],
            ['Mondha Naka', 'Ambad Road Junction']
        ],
        Beed: [
            ['Beed Bus Stand', 'Central Bus Depot'],
            ['Shahu Chowk', 'City Center Drop Point']
        ],
        Georai: [
            ['Georai Bus Stand', 'Main Highway Stand']
        ],
        Sonpeth: [
            ['Sonpeth Bus Stand', 'Main Bus Depot']
        ],
        Latur: [
            ['Latur Bus Stand', 'Central Bus Depot'],
            ['Shivaji Chowk', 'Barshi Road Junction']
        ]
    };

    // Fallback drop points for unconfigured destination cities
    const COMMON_DROP_POINTS = [
        ['Main Bus Depot', 'Central Bus Stand Drop Point'],
        ['City Center', 'Main City Drop Point'],
        ['Highway Bypass', 'Highway Drop Junction']
    ];

    // EXPORT TO GLOBAL WINDOW OBJECT
    window.TravelConfig = {
        CITIES,
        SERVICE_ROUTES,
        BUS_INVENTORY,
        PICKUP_POINTS_BY_CITY,
        COMMON_PICKUP_POINTS,
        DROP_POINTS_BY_CITY,
        COMMON_DROP_POINTS,

        /**
         * Get all available origin cities
         */
        getAllCities() {
            return Object.keys(SERVICE_ROUTES);
        },

        /**
         * Get available destination cities from a given origin
         */
        getDestinationsFor(origin) {
            return SERVICE_ROUTES[origin] || [];
        },

        /**
         * Get pickup points strictly configured for the selected origin city,
         * falling back cleanly if city is not in the custom dictionary.
         */
        getPickupPoints(originCity) {
            if (PICKUP_POINTS_BY_CITY[originCity] && PICKUP_POINTS_BY_CITY[originCity].length > 0) {
                return PICKUP_POINTS_BY_CITY[originCity];
            }
            return COMMON_PICKUP_POINTS;
        },

        /**
         * Get dropping points strictly configured for the selected destination city,
         * falling back cleanly if city is not in the custom dictionary.
         */
        getDropPoints(destinationCity) {
            if (DROP_POINTS_BY_CITY[destinationCity] && DROP_POINTS_BY_CITY[destinationCity].length > 0) {
                return DROP_POINTS_BY_CITY[destinationCity];
            }
            return COMMON_DROP_POINTS;
        },

        /**
         * Get all bus objects operating on a specific route (Origin -> Destination).
         * Supports multiple buses per route!
         */
        getBusesForRoute(fromCity, toCity) {
            if (!fromCity || !toCity) return [];
            return BUS_INVENTORY.filter(bus => 
                bus.from.toLowerCase() === fromCity.toLowerCase() &&
                bus.to.toLowerCase() === toCity.toLowerCase() &&
                bus.isActive !== false
            );
        },

        /**
         * Lookup bus by unique Bus ID
         */
        getBusById(busId) {
            return BUS_INVENTORY.find(b => b.id === busId) || null;
        }
    };
})();
