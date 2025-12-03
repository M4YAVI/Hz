-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create the 'songs' table
CREATE TABLE IF NOT EXISTS songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  album TEXT,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration INTEGER NOT NULL, -- Duration in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS) on the table
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for public access to the 'songs' table
-- (Since this is a personal app without auth, we allow public access)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'songs' AND policyname = 'Allow public read access') THEN
        CREATE POLICY "Allow public read access" ON songs FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'songs' AND policyname = 'Allow public insert access') THEN
        CREATE POLICY "Allow public insert access" ON songs FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'songs' AND policyname = 'Allow public delete access') THEN
        CREATE POLICY "Allow public delete access" ON songs FOR DELETE USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'songs' AND policyname = 'Allow public update access') THEN
        CREATE POLICY "Allow public update access" ON songs FOR UPDATE USING (true);
    END IF;
END
$$;

-- 4. Create Storage Buckets ('images' and 'audio')
-- We insert into storage.buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('images', 'images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]),
  ('audio', 'audio', true, 104857600, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav']::text[])
ON CONFLICT (id) DO NOTHING;

-- 5. Create Storage Policies for public access
-- Policy for 'images' bucket
CREATE POLICY "Public Access for images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Public Upload for images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Public Delete for images" ON storage.objects FOR DELETE USING (bucket_id = 'images');

-- Policy for 'audio' bucket
CREATE POLICY "Public Access for audio" ON storage.objects FOR SELECT USING (bucket_id = 'audio');
CREATE POLICY "Public Upload for audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audio');
CREATE POLICY "Public Delete for audio" ON storage.objects FOR DELETE USING (bucket_id = 'audio');
