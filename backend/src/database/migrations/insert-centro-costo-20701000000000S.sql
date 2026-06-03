-- Inserta el centro de costo 20701000000000S perteneciente a Secretaría de Finanzas.
-- No hace nada si el código ya existe en adq_centros_costo.

INSERT INTO adq_centros_costo
  (id_dependencia, nombre, codigo, created_at)
SELECT
  d.id_dependencia,
  'Unidad de Apoyo a la Administración General',
  '20701000000000S',
  NOW()
FROM adq_dependencias d
WHERE d.nombre = 'Secretaría de Finanzas'
  AND NOT EXISTS (
    SELECT 1
    FROM adq_centros_costo cc
    WHERE cc.codigo = '20701000000000S'
  );
