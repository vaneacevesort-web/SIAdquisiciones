-- Inserta la partida específica 2992 relacionada con la genérica 2990.
-- ON DUPLICATE KEY UPDATE evita duplicar si ya existe el código.

INSERT INTO adq_cat_partidas_especificas
  (id_partida_generica, codigo, nombre, clave, descripcion, created_at)
SELECT
  pg.id_partida_generica,
  '2992',
  'Otros enseres',
  '2992',
  'Otros enseres',
  NOW()
FROM adq_cat_partidas_genericas pg
WHERE pg.codigo = '2990'
ON DUPLICATE KEY UPDATE
  nombre      = 'Otros enseres',
  clave       = '2992',
  descripcion = 'Otros enseres',
  updated_at  = CURRENT_TIMESTAMP;
