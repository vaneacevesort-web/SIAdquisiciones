-- ============================================================
-- DIAGNÓSTICO Y LIMPIEZA de adq_estudio_mercado
-- Ejecutar en cliente MySQL / DBeaver / HeidiSQL
-- PASO 1: Revisar SELECT antes de cualquier DELETE
-- ============================================================


-- ── PASO 1A: Ver todos los registros de la tabla ─────────────────────────
SELECT
  e.id_estudio,
  e.id_solicitud,
  s.folio            AS folio_solicitud,
  s.estatus_id       AS estatus_solicitud,
  e.estatus_estudio,
  e.contratacion_plurianual,
  e.descripcion_bien_servicio,
  e.valor_estudio_mercado,
  e.tipo_contratacion,
  e.created_at
FROM adq_estudio_mercado e
LEFT JOIN adq_solicitudes s ON s.id_solicitud = e.id_solicitud
ORDER BY e.id_estudio;


-- ── PASO 1B: Registros HUÉRFANOS (id_solicitud sin solicitud válida) ─────
SELECT
  e.id_estudio,
  e.id_solicitud,
  e.created_at,
  'HUERFANO - solicitud no existe' AS motivo
FROM adq_estudio_mercado e
LEFT JOIN adq_solicitudes s ON s.id_solicitud = e.id_solicitud
WHERE s.id_solicitud IS NULL;


-- ── PASO 1C: Registros INCOMPLETOS (sin campos clave) ────────────────────
-- Considera incompleto: sin estatus, sin contratacion_plurianual Y sin descripción
SELECT
  e.id_estudio,
  e.id_solicitud,
  s.folio            AS folio_solicitud,
  e.estatus_estudio,
  e.contratacion_plurianual,
  e.descripcion_bien_servicio,
  e.created_at,
  'INCOMPLETO - faltan campos clave' AS motivo
FROM adq_estudio_mercado e
LEFT JOIN adq_solicitudes s ON s.id_solicitud = e.id_solicitud
WHERE
  e.estatus_estudio        IS NULL
  AND e.contratacion_plurianual IS NULL
  AND e.descripcion_bien_servicio IS NULL;


-- ── PASO 1D: Registros CANDIDATOS A ELIMINAR (huérfanos + incompletos) ───
-- Este es el SELECT que representa exactamente lo que el DELETE va a borrar.
-- REVISAR antes de ejecutar el DELETE.
SELECT
  e.id_estudio,
  e.id_solicitud,
  s.folio            AS folio_solicitud,
  e.estatus_estudio,
  e.contratacion_plurianual,
  e.descripcion_bien_servicio,
  e.created_at,
  CASE
    WHEN s.id_solicitud IS NULL THEN 'HUERFANO'
    WHEN e.estatus_estudio IS NULL
         AND e.contratacion_plurianual IS NULL
         AND e.descripcion_bien_servicio IS NULL THEN 'INCOMPLETO'
  END AS motivo
FROM adq_estudio_mercado e
LEFT JOIN adq_solicitudes s ON s.id_solicitud = e.id_solicitud
WHERE
  s.id_solicitud IS NULL          -- huérfanos
  OR (
    e.estatus_estudio        IS NULL
    AND e.contratacion_plurianual IS NULL
    AND e.descripcion_bien_servicio IS NULL
  );                               -- incompletos sin ningún dato


-- ============================================================
-- PASO 2: DELETE — SOLO EJECUTAR DESPUÉS DE VALIDAR EL SELECT
-- Elimina únicamente registros huérfanos o sin ningún dato útil.
-- ============================================================

-- OPCIÓN A: Solo huérfanos
-- DELETE FROM adq_estudio_mercado
-- WHERE id_solicitud NOT IN (SELECT id_solicitud FROM adq_solicitudes);

-- OPCIÓN B: Solo incompletos (sin estatus + sin plurianual + sin descripción)
-- DELETE FROM adq_estudio_mercado
-- WHERE estatus_estudio IS NULL
--   AND contratacion_plurianual IS NULL
--   AND descripcion_bien_servicio IS NULL;

-- OPCIÓN C: Ambos (recomendada — igual que el SELECT 1D)
-- DELETE e FROM adq_estudio_mercado e
-- LEFT JOIN adq_solicitudes s ON s.id_solicitud = e.id_solicitud
-- WHERE
--   s.id_solicitud IS NULL
--   OR (
--     e.estatus_estudio IS NULL
--     AND e.contratacion_plurianual IS NULL
--     AND e.descripcion_bien_servicio IS NULL
--   );

-- ============================================================
-- SEGURIDAD: verificar resultado después del DELETE
-- ============================================================
-- SELECT COUNT(*) AS registros_restantes FROM adq_estudio_mercado;
-- SELECT * FROM adq_estudio_mercado ORDER BY id_estudio;
