-- ══════════════════════════════════════════════════════════════════════════
-- Migración: crear tabla roles y poblarla con los 6 roles del sistema
--
-- CÓMO EJECUTAR:
--   Opción A — MySQL Workbench / DBeaver / HeidiSQL:
--     Abre este archivo y presiona "Ejecutar" (Ctrl+Shift+Enter).
--
--   Opción B — línea de comandos:
--     mysql -h 192.168.56.56 -u homestead -psecret adquisiciones < create_roles.sql
--
--   Nota: usa CREATE TABLE IF NOT EXISTS, es seguro ejecutarlo más de una vez.
-- ══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS `roles` (
  `id`         INT            NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(255)   NULL,
  `desc`       VARCHAR(255)   NULL,
  `createdAt`  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Insertar los 6 roles del sistema ───────────────────────────────────────
-- INSERT IGNORE no falla si el registro ya existe (usa el id como clave).

INSERT IGNORE INTO `roles` (`id`, `name`, `desc`) VALUES
(1, 'Administrador',           'Acceso total al sistema'),
(2, 'Validador',               'Solo lectura / consulta general'),
(3, 'Estudio de Mercado',      'Crea solicitudes y captura estudio de mercado'),
(4, 'Afectación Presupuestal', 'Edita únicamente la sección de afectación presupuestal'),
(5, 'Adquisiciones',           'Edita únicamente la sección de adquisición o contratación'),
(6, 'Adjudicación',            'Edita únicamente la sección de adjudicación');

-- ── Verificación ───────────────────────────────────────────────────────────
SELECT id, name, `desc` FROM `roles` ORDER BY id;
