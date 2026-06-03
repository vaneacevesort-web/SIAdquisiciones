-- Inserta la partida específica 4432 relacionada con la genérica 4430
-- Usa ON DUPLICATE KEY UPDATE para no fallar si el código ya existe.

INSERT INTO adq_cat_partidas_especificas
  (id_partida_generica, codigo, nombre, clave, descripcion, created_at)
SELECT
  pg.id_partida_generica,
  '4432',
  'Premios, recompensas y pensión recreativa estudiantil',
  '4432',
  'Premios, recompensas y pensión recreativa estudiantil',
  NOW()
FROM adq_cat_partidas_genericas pg
WHERE pg.codigo = '4430'
ON DUPLICATE KEY UPDATE
  id_partida_generica = VALUES(id_partida_generica),
  nombre              = VALUES(nombre),
  clave               = VALUES(clave),
  descripcion         = VALUES(descripcion),
  updated_at          = CURRENT_TIMESTAMP;
