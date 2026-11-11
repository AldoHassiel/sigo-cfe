export interface Sello {
  numsello: string;
  codigosello: string;
  cvearea: string;
  ultimomovimiento: string;
  proximomovimiento: string;
  rpe: string;
  rpesimed: string;
  fechaultimomovimiento: string;
  cveareasimed: string;
  nombre_area: string;
  estado: "vencido" | "proximo" | "vigente";
  dias_restantes: number;
  dias_con_sello: number;
  sello: string;
  tipo: string;
}
