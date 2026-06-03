-- ══════════════════════════════════════════════════════════════════════════════
-- CONSOLIDACIÓN: adq_cat_centros_costo → adq_centros_costo
-- Estrategia:
--   1. Cruzar dependencias por nombre entre adq_cat_dependencias y adq_dependencias.
--   2. Usar centro_costo como codigo, y descripcion (o centro_costo si es null) como nombre.
--   3. No insertar si el codigo ya existe en adq_centros_costo (evitar duplicados).
--
-- EJECUTAR PRIMERO EL PASO 0 (diagnóstico) para revisar qué se importaría.
-- ══════════════════════════════════════════════════════════════════════════════


-- ── PASO 0: Diagnóstico — Ver qué registros se importarían ───────────────────
-- (no modifica nada — solo muestra)
-- Nota: adq_cat_dependencias fue eliminada (estaba vacía).
-- El cruce es directo old.id_dependencia → adq_dependencias.id_dependencia.
-- Si los IDs no coinciden aparecerá "PENDIENTE: SIN DEPENDENCIA EN SISTEMA".
SELECT
  old.id_centro_costo                                          AS old_id,
  TRIM(old.centro_costo)                                       AS codigo_a_insertar,
  COALESCE(NULLIF(TRIM(old.descripcion), ''), old.centro_costo) AS nombre_a_insertar,
  old.id_dependencia                                           AS id_dep_origen,
  nd.id_dependencia                                            AS id_dep_destino,
  nd.nombre                                                    AS dependencia_destino,
  CASE
    WHEN nd.id_dependencia IS NULL
      THEN 'PENDIENTE: SIN DEPENDENCIA EN SISTEMA'
    WHEN EXISTS (
      SELECT 1 FROM adq_centros_costo cc
      WHERE TRIM(UPPER(cc.codigo)) = TRIM(UPPER(old.centro_costo))
    ) THEN 'YA EXISTE — OMITIR'
    ELSE 'NUEVO — SE INSERTARÁ'
  END AS accion
FROM adq_cat_centros_costo old
LEFT JOIN adq_dependencias nd
  ON nd.id_dependencia = old.id_dependencia
ORDER BY accion, nd.nombre, codigo_a_insertar;


-- ── PASO 1: Insertar registros nuevos (sin match de codigo en destino) ───────
-- Descomentar cuando el Paso 0 luzca correcto.
/*
INSERT INTO adq_centros_costo (id_dependencia, nombre, codigo, created_at)
SELECT
  nd.id_dependencia,
  COALESCE(NULLIF(TRIM(old.descripcion), ''), old.centro_costo) AS nombre,
  TRIM(old.centro_costo)                                         AS codigo,
  NOW()
FROM adq_cat_centros_costo old
JOIN adq_dependencias nd
  ON nd.id_dependencia = old.id_dependencia
WHERE NOT EXISTS (
  SELECT 1 FROM adq_centros_costo cc
  WHERE TRIM(UPPER(cc.codigo)) = TRIM(UPPER(old.centro_costo))
);
*/


-- ── PASO 2: Verificar resultado tras el INSERT ───────────────────────────────
-- (ejecutar después del Paso 1)
/*
SELECT
  COUNT(*) AS total_activos,
  (SELECT COUNT(*) FROM adq_cat_centros_costo) AS total_viejos
FROM adq_centros_costo;
*/


-- ── PASO 3 (OPCIONAL): Ver registros de adq_cat_centros_costo sin match ──────
-- Registros que no se pudieron consolidar porque id_dependencia no existe en adq_dependencias
/*
SELECT
  old.*,
  'id_dependencia ' || old.id_dependencia || ' no encontrado en adq_dependencias' AS motivo
FROM adq_cat_centros_costo old
LEFT JOIN adq_dependencias nd ON nd.id_dependencia = old.id_dependencia
WHERE nd.id_dependencia IS NULL;
*/
