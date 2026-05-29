ALTER TABLE adq_procedimiento_adquisitivo
  ADD COLUMN IF NOT EXISTS url_testimonio_testigo_social VARCHAR(500) NULL AFTER vigencia_termino,
  ADD COLUMN IF NOT EXISTS remanente_suficiencia_presupuestal DECIMAL(18,2) NULL AFTER url_testimonio_testigo_social,
  ADD COLUMN IF NOT EXISTS estatus_adjudicacion VARCHAR(60) NULL AFTER remanente_suficiencia_presupuestal,
  ADD COLUMN IF NOT EXISTS estatus_estudio_mercado_adj VARCHAR(30) NULL AFTER estatus_adjudicacion,
  ADD COLUMN IF NOT EXISTS comentarios_adjudicacion TEXT NULL AFTER estatus_estudio_mercado_adj,
  ADD COLUMN IF NOT EXISTS existe_reprogramacion TINYINT(1) NULL AFTER comentarios_adjudicacion;
