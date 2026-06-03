-- Cambia adq_solicitudes.estado_estudio_mercado de ENUM a VARCHAR(20)
-- para aceptar: ADJUDICADO, CONCLUIDO, DESIERTA, PROCESO, RECHAZADA

ALTER TABLE adq_solicitudes
  MODIFY COLUMN estado_estudio_mercado VARCHAR(20) NULL;
