-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('Asset_image', 'Asset_image', false);

-- Create policies for the storage bucket
-- 1. Allow authenticated users to view their own images


-- 2. Allow authenticated users to upload images

