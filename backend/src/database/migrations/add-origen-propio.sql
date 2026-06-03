-- Separa "Concurrente o Propio" en dos registros independientes.
-- id=4 queda como "Concurrente", id=5 es el nuevo "Propio".

UPDATE adq_cat_origen_recurso
  SET nombre = 'Concurrente'
  WHERE id_origen_recurso = 4;

INSERT INTO adq_cat_origen_recurso (id_origen_recurso, nombre)
  VALUES (5, 'Propio')
  ON DUPLICATE KEY UPDATE nombre = 'Propio';
