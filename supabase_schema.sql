-- ============================================================================
-- DHAGE TRAVELS - SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase Project -> SQL Editor:
-- https://supabase.com/dashboard/project/aoxyaxoxfsgothmjjias/sql
-- ============================================================================

-- 1. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
    passengers JSONB DEFAULT '[]'::jsonb,
    pickup_point TEXT NOT NULL,
    drop_point TEXT NOT NULL,
    base_fare NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    booking_status TEXT NOT NULL DEFAULT 'CONFIRMED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON public.bookings (pnr);
CREATE INDEX IF NOT EXISTS idx_bookings_bus_date ON public.bookings (bus_name, travel_date);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings (primary_passenger_phone);

-- 2. FEEDBACK & CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow public to create bookings
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
CREATE POLICY "Public can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (true);

-- Allow public to view bookings (for PNR search & seat checking)
DROP POLICY IF EXISTS "Public can view bookings" ON public.bookings;
CREATE POLICY "Public can view bookings" ON public.bookings
    FOR SELECT USING (true);

-- Allow public to submit feedback
DROP POLICY IF EXISTS "Public can insert feedback" ON public.feedback;
CREATE POLICY "Public can insert feedback" ON public.feedback
    FOR INSERT WITH CHECK (true);
