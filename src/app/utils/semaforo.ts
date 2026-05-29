export type SemaforoEstado = 'en-tiempo' | 'atrasado' | 'concluido' | 'rechazado';

export interface SemaforoInfo {
  estado: SemaforoEstado;
  label: string;
  cssClass: string;
  /** Días naturales transcurridos desde fecha_ingreso (null si no aplica) */
  dias: number | null;
}

const DIAS_LIMITE = 15;

function calcularDias(fechaIngreso: string | null | undefined): number | null {
  if (!fechaIngreso) return null;
  const ingreso = new Date(fechaIngreso + 'T00:00:00');
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return Math.floor((hoy.getTime() - ingreso.getTime()) / 86_400_000);
}

/**
 * Calcula el semáforo de seguimiento de una solicitud.
 * Prioridad: 1 Rechazado → 2 Concluido → 3 Atrasado → 4 En tiempo
 */
export function calcularSemaforo(solicitud: any): SemaforoInfo {
  const dias = calcularDias(solicitud?.fecha_ingreso);

  if (!solicitud) {
    return { estado: 'en-tiempo', label: 'En tiempo', cssClass: 'semaforo-en-tiempo', dias: null };
  }

  if (solicitud.estado_estudio_mercado === 'RECHAZADO') {
    return { estado: 'rechazado', label: 'Rechazado', cssClass: 'semaforo-rechazado', dias };
  }

  if (Number(solicitud.estatus_id) === 5) {
    return { estado: 'concluido', label: 'Concluido', cssClass: 'semaforo-concluido', dias };
  }

  if (dias !== null && dias > DIAS_LIMITE) {
    return { estado: 'atrasado', label: 'Atrasado', cssClass: 'semaforo-atrasado', dias };
  }

  return { estado: 'en-tiempo', label: 'En tiempo', cssClass: 'semaforo-en-tiempo', dias };
}
