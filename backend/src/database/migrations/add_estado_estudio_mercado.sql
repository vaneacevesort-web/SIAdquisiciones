-- Agrega el campo estado_estudio_mercado a adq_solicitudes
-- Ejecutar: mysql -h <host> -u <user> -p<pass> adquisiciones < add_estado_estudio_mercado.sql

ALTER TABLE adq_solicitudes
  ADD COLUMN IF NOT EXISTS estado_estudio_mercado ENUM('CONCLUIDO','PROCESO','RECHAZADO') NULL
  AFTER estatus_id;
