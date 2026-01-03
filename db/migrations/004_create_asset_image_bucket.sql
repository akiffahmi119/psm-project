-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('Asset_image', 'Asset_image', false);

-- Create policies for the storage bucket
-- 1. Allow authenticated users to view their own images
CREATE POLICY "Allow authenticated users to view images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'Asset_image');

-- 2. Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'Asset_image');
