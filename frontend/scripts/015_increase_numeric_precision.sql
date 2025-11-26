-- Increase numeric precision for price fields to handle larger GNF values
-- numeric(15, 2) allows up to 9,999,999,999,999.99

ALTER TABLE public.products 
ALTER COLUMN price TYPE numeric(15, 2);

ALTER TABLE public.orders 
ALTER COLUMN total TYPE numeric(15, 2);

ALTER TABLE public.order_items 
ALTER COLUMN unit_price TYPE numeric(15, 2);

ALTER TABLE public.order_items 
ALTER COLUMN total_price TYPE numeric(15, 2);
