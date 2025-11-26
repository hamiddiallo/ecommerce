-- Add is_locked column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN orders.is_locked IS 'When true, prevents admin from modifying order status (set by client cancellation)';
