
-- Create a public storage bucket for opportunity images
INSERT INTO storage.buckets (id, name, public)
VALUES ('oportunidades', 'oportunidades', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all files
CREATE POLICY "Public read access for oportunidades"
ON storage.objects FOR SELECT
USING (bucket_id = 'oportunidades');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload oportunidades images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'oportunidades');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update oportunidades images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'oportunidades');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete oportunidades images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'oportunidades');
