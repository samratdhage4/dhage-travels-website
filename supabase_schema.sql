-- ============================================================================
-- DHAGE TRAVELS - SUPABASE DATABASE SCHEMA & REALTIME SETUP
-- ============================================================================
-- Execute this script in your Supabase Project -> SQL Editor
-- This sets up the tables, Row Level Security (RLS), and Realtime publications.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. BUSES TABLE (Fleet & Routes)
CREATE TABLE IF NOT EXISTS public.buses (
    id TEXT PRIMARY KEY,
    bus_name TEXT NOT NULL,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    bus_type TEXT NOT NULL DEFAULT '2+1 AC Sleeper',
    base_price NUMERIC(10, 2) NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 4.5,
    total_seats INT DEFAULT 36,
    amenities JSONB DEFAULT '["Charging Point", "Reading Light", "Blanket", "Water Bottle", "Emergency Exit", "Live GPS Tracking"]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Buses Data if empty
INSERT INTO public.buses (id, bus_name, from_city, to_city, bus_type, base_price, departure_time, arrival_time, duration, rating)
VALUES
    ('B-MUM-MAJ-1', 'Royal Cruiser', 'Mumbai', 'Majalgaon', 'BharatBenz 2+1 AC Sleeper', 800.00, '21:15', '06:15', '9h 00m', 4.8),
    ('B-MUM-NAN-1', 'Nanded Express', 'Mumbai', 'Nanded', 'Volvo Multi-Axle AC Sleeper', 950.00, '20:30', '07:45', '11h 15m', 4.6),
    ('B-MUM-SON-1', 'Sonpeth Link', 'Mumbai', 'Sonpeth', '2+1 Luxury AC Sleeper', 720.00, '22:00', '07:00', '9h 00m', 4.4),
    ('B-MUM-GEO-1', 'Georai Fast', 'Mumbai', 'Georai', 'SuperFast AC Sleeper', 680.00, '23:15', '07:30', '8h 15m', 4.3),
    ('B-PUN-MAJ-1', 'Pune-Majal Express', 'Pune', 'Majalgaon', '2+1 Luxury Sleeper', 750.00, '22:45', '07:30', '8h 45m', 4.5),
    ('B-PUN-NAN-1', 'Marathwada King', 'Pune', 'Nanded', 'BharatBenz AC Sleeper', 880.00, '21:00', '07:00', '10h 00m', 4.7),
    ('B-PUN-BEE-1', 'Beed Central', 'Pune', 'Beed', '2+1 Semi-Sleeper / Sleeper', 620.00, '23:30', '06:15', '6h 45m', 4.4),
    ('B-PUN-GEO-1', 'Georai Express', 'Pune', 'Georai', 'Express AC Sleeper', 670.00, '20:15', '05:00', '8h 45m', 4.2),
    ('B-PUN-MUM-1', 'Expressway Shuttle', 'Pune', 'Mumbai', 'Volvo B11R Multi-Axle', 550.00, '06:00', '10:30', '4h 30m', 4.5)
ON CONFLICT (id) DO NOTHING;


-- 3. BOOKINGS TABLE (Real-time Bookings & Seat Tracking)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pnr TEXT UNIQUE NOT NULL,
    bus_id TEXT,
    bus_name TEXT NOT NULL,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    travel_date DATE NOT NULL,
    selected_seats TEXT[] NOT NULL,
    primary_passenger_name TEXT NOT NULL,
    primary_passenger_phone TEXT NOT NULL,
    primary_passenger_email TEXT,
    primary_passenger_gender TEXT NOT NULL DEFAULT 'Male',
    primary_passenger_age INT NOT NULL DEFAULT 25,
    passengers JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of [{seat: "L1A", name: "...", age: 25, gender: "Female"}]
    pickup_point TEXT NOT NULL,
    drop_point TEXT NOT NULL,
    base_fare NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'Pay on Boarding',
    booking_status TEXT NOT NULL DEFAULT 'CONFIRMED', -- 'CONFIRMED', 'CANCELLED'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy lookups by bus & travel_date and by PNR / Phone
CREATE INDEX IF NOT EXISTS idx_bookings_bus_date ON public.bookings (bus_name, travel_date);
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON public.bookings (pnr);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings (primary_passenger_phone);


-- 4. FEEDBACK & INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow public read access to buses
DROP POLICY IF EXISTS "Public can view active buses" ON public.buses;
CREATE POLICY "Public can view active buses" ON public.buses
    FOR SELECT USING (is_active = true);

-- Allow public read and insert access to bookings
DROP POLICY IF EXISTS "Public can view bookings" ON public.bookings;
CREATE POLICY "Public can view bookings" ON public.bookings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
CREATE POLICY "Public can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can cancel own booking" ON public.bookings;
CREATE POLICY "Public can cancel own booking" ON public.bookings
    FOR UPDATE USING (true);

-- Allow public insert to feedback
DROP POLICY IF EXISTS "Public can insert feedback" ON public.feedback;
CREATE POLICY "Public can insert feedback" ON public.feedback
    FOR INSERT WITH CHECK (true);


-- 6. REALTIME REPLICATION SETUP
-- Add bookings table to Supabase Realtime publication so clients receive instant live events
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'bookings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
    END IF;
END $$;
