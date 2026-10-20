export interface Sello {
  numsello: string;
  rpe: string;
  fechaultimomovimiento: string;
  cvearea: string;
  nombre_area: string;
  estado: "vencido" | "proximo" | "vigente";
  dias_restantes: number;
}
