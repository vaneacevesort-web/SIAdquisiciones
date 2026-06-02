-- ============================================================
-- DIAGNÓSTICO Y LIMPIEZA DE ETAPAS
-- Tablas: adq_afectacion_presupuestal, adq_procedimiento_adquisitivo
-- NOTA: adq_adjudicacion NO existe como tabla separada.
--       Los datos de Adjudicación viven en adq_procedimiento_adquisitivo.
-- ============================================================
-- Instrucciones:
--   1. Ejecuta los SELECT en orden para entender el estado de los datos.
--   2. Solo cuando estés seguro, descomenta y ejecuta el DELETE puntual.
-- ============================================================



-- ╔══════════════════════════════════════════════════════════╗
-- ║  TABLA 1: adq_afectacion_presupuestal                   ║
-- ╚══════════════════════════════════════════════════════════╝

-- 1A. GENERAL — todos los registros con contexto de solicitud
SELECT
  a.id_afectacion,
  a.id_solicitud,
  s.folio           AS folio_solicitud,
  s.estatus_id      AS estatus_solicitud,
  a.tipo_gasto,
  a.nombre_testigo_social,
  a.importe_suficiencia,
  a.oficio_suficiencia_path,
  a.created_at
FROM adq_afectacion_presupuestal a
LEFT JOIN adq_solicitudes s ON s.id_solicitud = a.id_solicitud
ORDER BY a.id_afectacion;


-- 1B. HUÉRFANOS — id_solicitud sin relación válida
SELECT
  a.id_afectacion,
  a.id_solicitud,
  a.created_at,
  'HUERFANO - solicitud no existe' AS motivo
FROM adq_afectacion_presupuestal a
LEFT JOIN adq_solicitudes s ON s.id_solicitud = a.id_solicitud
WHERE s.id_solicitud IS NULL;


-- 1C. INCOMPLETOS — sin tipo_gasto ni importe (campos clave vacíos)
SELECT
  a.id_afectacion,
  a.id_solicitud,
  s.folio           AS folio_solicitud,
  a.tipo_gasto,
  a.nombre_testigo_social,
  a.importe_suficiencia,
  a.created_at,
  'INCOMPLETO - sin tipo_gasto ni importe' AS motivo
FROM adq_afectacion_presupuestal a
LEFT JOIN adq_solicitudes s ON s.id_solicitud = a.id_solicitud
WHERE
  a.tipo_gasto        IS NULL
  AND a.importe_suficiencia IS NULL
  AND a.nombre_testigo_social IS NULL;


-- 1D. CANDIDATOS A ELIMINAR (huérfanos + incompletos)
-- Revisa este SELECT antes de cualquier DELETE.
SELECT
  a.id_afectacion,
  a.id_solicitud,
  s.folio           AS folio_solicitud,
  a.tipo_gasto,
  a.importe_suficiencia,
  a.nombre_testigo_social,
  a.created_at,
  CASE
    WHEN s.id_solicitud IS NULL THEN 'HUERFANO'
    ELSE 'INCOMPLETO'
  END AS motivo
FROM adq_afectacion_presupuestal a
LEFT JOIN adq_solicitudes s ON s.id_solicitud = a.id_solicitud
WHERE
  s.id_solicitud IS NULL
  OR (
    a.tipo_gasto          IS NULL
    AND a.importe_suficiencia  IS NULL
    AND a.nombre_testigo_social IS NULL
  );


-- 1E. DELETE SEGURO — SOLO descomentar después de validar 1D
-- Reemplaza <id> con el/los id_afectacion exactos del resultado de 1D.
-- DELETE FROM adq_afectacion_presupuestal WHERE id_afectacion IN (<id1>, <id2>);



-- ╔══════════════════════════════════════════════════════════╗
-- ║  TABLA 2: adq_procedimiento_adquisitivo                 ║
-- ║  (contiene datos de ADQUISICIÓN y ADJUDICACIÓN)         ║
-- ╚══════════════════════════════════════════════════════════╝

-- 2A. GENERAL — todos los registros con contexto de solicitud
SELECT
  p.id_proc,
  p.id_solicitud,
  s.folio              AS folio_solicitud,
  s.estatus_id         AS estatus_solicitud,
  p.modalidad,
  p.responsable,
  p.no_procedimiento,
  p.proveedor_razon_social,
  p.no_contrato,
  p.estatus_adjudicacion,
  p.created_at
FROM adq_procedimiento_adquisitivo p
LEFT JOIN adq_solicitudes s ON s.id_solicitud = p.id_solicitud
ORDER BY p.id_proc;


-- 2B. HUÉRFANOS — id_solicitud sin relación válida
SELECT
  p.id_proc,
  p.id_solicitud,
  p.created_at,
  'HUERFANO - solicitud no existe' AS motivo
FROM adq_procedimiento_adquisitivo p
LEFT JOIN adq_solicitudes s ON s.id_solicitud = p.id_solicitud
WHERE s.id_solicitud IS NULL;


-- 2C. INCOMPLETOS — sin datos de adquisición ni adjudicación
-- Un registro de prueba no tendrá modalidad, responsable NI proveedor.
SELECT
  p.id_proc,
  p.id_solicitud,
  s.folio           AS folio_solicitud,
  p.modalidad,
  p.responsable,
  p.no_procedimiento,
  p.proveedor_razon_social,
  p.created_at,
  'INCOMPLETO - sin modalidad/responsable/proveedor' AS motivo
FROM adq_procedimiento_adquisitivo p
LEFT JOIN adq_solicitudes s ON s.id_solicitud = p.id_solicitud
WHERE
  p.modalidad              IS NULL
  AND p.responsable        IS NULL
  AND p.no_procedimiento   IS NULL
  AND p.proveedor_razon_social IS NULL;


-- 2D. CANDIDATOS A ELIMINAR (huérfanos + incompletos)
-- Revisa este SELECT antes de cualquier DELETE.
SELECT
  p.id_proc,
  p.id_solicitud,
  s.folio              AS folio_solicitud,
  p.modalidad,
  p.responsable,
  p.no_procedimiento,
  p.proveedor_razon_social,
  p.created_at,
  CASE
    WHEN s.id_solicitud IS NULL THEN 'HUERFANO'
    ELSE 'INCOMPLETO'
  END AS motivo
FROM adq_procedimiento_adquisitivo p
LEFT JOIN adq_solicitudes s ON s.id_solicitud = p.id_solicitud
WHERE
  s.id_solicitud IS NULL
  OR (
    p.modalidad              IS NULL
    AND p.responsable        IS NULL
    AND p.no_procedimiento   IS NULL
    AND p.proveedor_razon_social IS NULL
  );


-- 2E. DELETE SEGURO — SOLO descomentar después de validar 2D
-- Reemplaza <id> con el/los id_proc exactos del resultado de 2D.
-- DELETE FROM adq_procedimiento_adquisitivo WHERE id_proc IN (<id1>, <id2>);



-- ╔══════════════════════════════════════════════════════════╗
-- ║  VERIFICACIÓN FINAL después de cualquier limpieza       ║
-- ╚══════════════════════════════════════════════════════════╝

-- SELECT COUNT(*) AS afectacion_restantes  FROM adq_afectacion_presupuestal;
-- SELECT COUNT(*) AS procedimiento_restantes FROM adq_procedimiento_adquisitivo;
