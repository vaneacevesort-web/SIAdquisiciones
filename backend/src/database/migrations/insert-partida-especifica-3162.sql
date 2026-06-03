-- Inserta la partida específica 3162 relacionada con la genérica 3160.
-- ON DUPLICATE KEY UPDATE evita duplicar si ya existe el código.
-- Aplica una sola vez aunque la advertencia aparezca en múltiples folios (S243, S500, etc.)

INSERT INTO adq_cat_partidas_especificas
  (id_partida_generica, codigo, nombre, clave, descripcion, created_at)
SELECT
  pg.id_partida_generica,
  '3162',
  'Servicios de conducción de señales analógicas y digitales',
  '3162',
  'Servicios de conducción de señales analógicas y digitales',
  NOW()
FROM adq_cat_partidas_genericas pg
WHERE pg.codigo = '3160'
ON DUPLICATE KEY UPDATE
  nombre      = 'Servicios de conducción de señales analógicas y digitales',
  clave       = '3162',
  descripcion = 'Servicios de conducción de señales analógicas y digitales',
  updated_at  = CURRENT_TIMESTAMP;
