-- Inserta la partida específica 2492 relacionada con la genérica 2490.
-- ON DUPLICATE KEY UPDATE evita duplicar si ya existe el código.

INSERT INTO adq_cat_partidas_especificas
  (id_partida_generica, codigo, nombre, clave, descripcion, created_at)
SELECT
  pg.id_partida_generica,
  '2492',
  'Estructuras y manufacturas para construcción',
  '2492',
  'Estructuras y manufacturas para construcción',
  NOW()
FROM adq_cat_partidas_genericas pg
WHERE pg.codigo = '2490'
ON DUPLICATE KEY UPDATE
  nombre      = 'Estructuras y manufacturas para construcción',
  clave       = '2492',
  descripcion = 'Estructuras y manufacturas para construcción',
  updated_at  = CURRENT_TIMESTAMP;
