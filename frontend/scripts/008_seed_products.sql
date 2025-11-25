-- Seed some sample products from the invoices
-- Get category IDs first (we'll use the slugs to reference them)

-- Cosmetics
insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'cosmetiques'),
  'Savon Priss Paris',
  'Savon de qualité - Carton de 72 pièces',
  150000,
  'carton',
  50,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Savon Priss Paris');

insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'cosmetiques'),
  'Gel douche Men Classique',
  'Gel douche pour hommes',
  150000,
  'douzaine',
  30,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Gel douche Men Classique');

insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'cosmetiques'),
  'Crème de corps Ideal Skin PM',
  'Crème hydratante pour le corps',
  65000,
  'douzaine',
  40,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Crème de corps Ideal Skin PM');

insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'cosmetiques'),
  'Parfum Stant',
  'Parfum de qualité',
  90000,
  'douzaine',
  25,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Parfum Stant');

-- Hygiene
insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'hygiene'),
  'Brosse à dent Colgate',
  'Brosses à dents - Carton de 144 pièces',
  370000,
  'carton',
  20,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Brosse à dent Colgate');

insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'hygiene'),
  'Pâte dentifrice Doctor',
  'Dentifrice - Carton de 72 pièces',
  370000,
  'carton',
  15,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Pâte dentifrice Doctor');

insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'hygiene'),
  'Serviette',
  'Serviettes de qualité',
  540000,
  'douzaine',
  35,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Serviette');

-- School supplies
insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'fournitures-scolaires'),
  'Cahier 100 pages',
  'Cahier 100 pages - Paquet de 12',
  175000,
  'carton',
  60,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Cahier 100 pages');

insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'fournitures-scolaires'),
  'Bic Bleu',
  'Stylos Bic bleus - 20 paquets',
  480000,
  'carton',
  45,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Bic Bleu');

insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'fournitures-scolaires'),
  'Craie blanche',
  'Craie blanche - 60 paquets',
  300000,
  'carton',
  50,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Craie blanche');

-- Kitchen items
insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'cuisine'),
  'Bouilloir',
  'Bouilloire électrique',
  80000,
  'douzaine',
  20,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Bouilloir');

insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'cuisine'),
  'Couteaux de cuisine',
  'Set de couteaux de cuisine',
  42000,
  'douzaine',
  30,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Couteaux de cuisine');

insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'cuisine'),
  'Tasse à café',
  'Tasses à café',
  10000,
  'pièce',
  100,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Tasse à café');

-- Household items
insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'articles-menagers'),
  'Kit de nettoyage',
  'Kit complet de nettoyage',
  90000,
  'pièce',
  25,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Kit de nettoyage');

insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'articles-menagers'),
  'Poubelle maison',
  'Poubelle pour la maison',
  25000,
  'pièce',
  40,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Poubelle maison');

insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'articles-menagers'),
  'Tabouret plastique',
  'Tabouret en plastique',
  55000,
  'pièce',
  35,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Tabouret plastique');

-- Electronics
insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'electronique'),
  'Rallonge électrique',
  'Rallonge électrique standard',
  70000,
  'pièce',
  30,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Rallonge électrique');

insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'electronique'),
  'Lampe éclairage néon',
  'Lampe néon pour éclairage',
  40000,
  'pièce',
  25,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Lampe éclairage néon');

-- Accessories
insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'accessoires'),
  'Valise Roulette',
  'Valise à roulettes',
  140000,
  'pièce',
  15,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Valise Roulette');

insert into public.products (category_id, name, description, price, unit, stock, image_url)
select 
  (select id from public.categories where slug = 'accessoires'),
  'Ceinture',
  'Ceinture de qualité',
  25000,
  'pièce',
  50,
  '/placeholder.svg?height=400&width=400'
where not exists (select 1 from public.products where name = 'Ceinture');
