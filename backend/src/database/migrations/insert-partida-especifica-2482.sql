-- Inserta la partida específica 2482 relacionada con la genérica 2480.
-- ON DUPLICATE KEY UPDATE evita duplicar si ya existe el código.

INSERT INTO adq_cat_partidas_especificas
  (id_partida_generica, codigo, nombre, clave, descripcion, created_at)
SELECT
  pg.id_partida_generica,
  '2482',
  'Material de señalización',
  '2482',
  'Material de señalización',
  NOW()
FROM adq_cat_partidas_genericas pg
WHERE pg.codigo = '2480'
ON DUPLICATE KEY UPDATE
  nombre      = 'Material de señalización',
  clave       = '2482',
  descripcion = 'Material de señalización',
  updated_at  = CURRENT_TIMESTAMP;
