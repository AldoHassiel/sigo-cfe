export interface Sello {
  numsello: string;
  rpe: string;
  fechaultimomovimiento: Date;
  cvarea: string;
  nombre_area: string;
  estado: "vencido" | "proximo" | "vigente";
  dias_restantes: number;
}
