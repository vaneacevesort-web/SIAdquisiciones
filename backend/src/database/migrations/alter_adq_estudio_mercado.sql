-- Ajusta adq_estudio_mercado para el guardado completo del Estudio de Mercado
-- Ejecutar: mysql -h 192.168.56.56 -u homestead -psecret adquisiciones < alter_adq_estudio_mercado.sql

-- 1. Relaja columnas NOT NULL que no se capturan en el form actual
ALTER TABLE adq_estudio_mercado
  MODIFY COLUMN id_dependencia    INT UNSIGNED NULL,
  MODIFY COLUMN id_centro_costo   INT UNSIGNED NULL,
  MODIFY COLUMN id_capitulo       INT UNSIGNED NULL,
  MODIFY COLUMN id_partida        INT UNSIGNED NULL,
  MODIFY COLUMN id_giro           INT UNSIGNED NULL,
  MODIFY COLUMN id_subgiro        INT UNSIGNED NULL,
  MODIFY COLUMN estatus_estudio   VARCHAR(20) NULL,
  MODIFY COLUMN plurianual        BOOLEAN NULL,
  MODIFY COLUMN created_by        CHAR(36) NULL DEFAULT '00000000-0000-0000-0000-000000000000';

-- 2. Agrega columnas faltantes
ALTER TABLE adq_estudio_mercado
  ADD COLUMN IF NOT EXISTS tipo_solicitud            ENUM('BIEN','SERVICIO')    NULL AFTER valor_estudio_mercado,
  ADD COLUMN IF NOT EXISTS tipo_contratacion         ENUM('IRP','LPNP','CP')    NULL AFTER tipo_solicitud,
  ADD COLUMN IF NOT EXISTS descripcion_bien_servicio TEXT                       NULL AFTER tipo_contratacion,
  ADD COLUMN IF NOT EXISTS monto_sabys               DECIMAL(18,2)              NULL AFTER descripcion_bien_servicio,
  ADD COLUMN IF NOT EXISTS contratacion_plurianual   ENUM('SI','NO')            NULL AFTER monto_sabys,
  ADD COLUMN IF NOT EXISTS monto_2026                DECIMAL(18,2)              NULL AFTER contratacion_plurianual,
  ADD COLUMN IF NOT EXISTS monto_2027                DECIMAL(18,2)              NULL AFTER monto_2026,
  ADD COLUMN IF NOT EXISTS monto_2028                DECIMAL(18,2)              NULL AFTER monto_2027,
  ADD COLUMN IF NOT EXISTS monto_2029                DECIMAL(18,2)              NULL AFTER monto_2028;
