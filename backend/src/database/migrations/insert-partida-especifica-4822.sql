-- Inserta la partida específica 4822 relacionada con la genérica 4820
-- No hace nada si el código 4822 ya existe.

INSERT INTO adq_cat_partidas_especificas
  (id_partida_generica, codigo, nombre, clave, descripcion, created_at)
SELECT
  pg.id_partida_generica,
  '4822',
  'Donativos a Municipios',
  '4822',
  'Donativos a Municipios',
  NOW()
FROM adq_cat_partidas_genericas pg
WHERE pg.codigo = '4820'
  AND NOT EXISTS (
    SELECT 1
    FROM adq_cat_partidas_especificas pe
    WHERE pe.codigo = '4822'
  );
