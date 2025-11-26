-- Add images column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Update existing rows to have image_url in images array if not null
UPDATE public.products 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND (images IS NULL OR images = '{}');
