-- Amplía adq_bienes_servicios.clave_verificacion de VARCHAR(120) a TEXT
-- para aceptar múltiples claves de verificación presupuestal concatenadas
-- que provienen de una sola celda del Excel (ej. "3821060001 3821060002 3821060003 ...")

ALTER TABLE adq_bienes_servicios
  MODIFY COLUMN clave_verificacion TEXT NULL;
