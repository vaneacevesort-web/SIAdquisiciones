-- Inserta la partida específica 3612 relacionada con la genérica 3610.
-- No hace nada si el código 3612 ya existe.

INSERT INTO adq_cat_partidas_especificas
  (id_partida_generica, codigo, nombre, clave, descripcion, created_at)
SELECT
  pg.id_partida_generica,
  '3612',
  'Publicaciones Oficiales',
  '3612',
  'Publicaciones Oficiales',
  NOW()
FROM adq_cat_partidas_genericas pg
WHERE pg.codigo = '3610'
  AND NOT EXISTS (
    SELECT 1
    FROM adq_cat_partidas_especificas pe
    WHERE pe.codigo = '3612'
  );
