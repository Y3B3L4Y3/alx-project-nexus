-- Fix thumbnail column size to support base64 images and long URLs
-- This migration increases the thumbnail column size to handle longer image data

ALTER TABLE products MODIFY COLUMN thumbnail TEXT NOT NULL;

-- Also increase product_images.image_url to handle longer URLs
ALTER TABLE product_images MODIFY COLUMN image_url TEXT NOT NULL;

-- Update other image-related columns for consistency
ALTER TABLE categories MODIFY COLUMN image TEXT;
ALTER TABLE users MODIFY COLUMN avatar TEXT;
