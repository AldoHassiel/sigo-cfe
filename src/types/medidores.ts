export interface Medidor {
  nummedidor: string;
  cvarea: string;
  rpe: string;
  fechaultimomovimiento: string;
  nombre_area: string;
  estado: "vencido" | "proximo" | "vigente";
  dias_restantes: number;
}
