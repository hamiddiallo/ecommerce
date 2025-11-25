-- Seed categories based on the product types
insert into public.categories (name, slug, description) values
  ('Cosmétiques', 'cosmetiques', 'Produits de beauté et soins corporels'),
  ('Hygiène', 'hygiene', 'Produits d''hygiène personnelle'),
  ('Fournitures Scolaires', 'fournitures-scolaires', 'Cahiers, stylos, et matériel scolaire'),
  ('Articles Ménagers', 'articles-menagers', 'Ustensiles et équipements pour la maison'),
  ('Cuisine', 'cuisine', 'Outils et accessoires de cuisine'),
  ('Électronique', 'electronique', 'Appareils et accessoires électroniques'),
  ('Accessoires', 'accessoires', 'Divers accessoires et articles')
on conflict (slug) do nothing;
