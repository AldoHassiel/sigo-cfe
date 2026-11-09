export interface HorasSemana {
  semana: string;
  horas: string;
  excede_limite_semanal: boolean;
}

export interface HorasExtras {
  rpe: string;
  horas_totales: string;
  semanas_excedidas: number;
  total_semanas: number;
  excede_limite_semanal: boolean;
  semanas: HorasSemana[];
}
