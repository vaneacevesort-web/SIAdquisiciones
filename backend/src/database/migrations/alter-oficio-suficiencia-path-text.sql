-- Amplía adq_afectacion_presupuestal.oficio_suficiencia_path de VARCHAR(500) a TEXT
-- para aceptar rutas/URLs largas de documentos que provienen del Excel histórico.

ALTER TABLE adq_afectacion_presupuestal
  MODIFY COLUMN oficio_suficiencia_path TEXT NULL;
