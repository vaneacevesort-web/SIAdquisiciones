-- Amplía adq_procedimiento_adquisitivo.proveedor_rfc de VARCHAR(20) a VARCHAR(255)
-- para aceptar múltiples RFC concatenados que provienen del Excel histórico.

ALTER TABLE adq_procedimiento_adquisitivo
  MODIFY COLUMN proveedor_rfc VARCHAR(255) NULL;
