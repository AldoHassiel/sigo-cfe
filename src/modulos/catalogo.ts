import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { Clock, Gauge, Map as MapIcon, Lock } from "lucide-react";
import Sellos from "./Sellos";
import Medidores from "./Medidores";
import Mapas from "./Mapas";
import HorasExtras from "./HorasExtras";

export interface Modulo {
  id: string;
  titulo: string;
  Icono: LucideIcon;
  componente: ComponentType;
}

export const CATALOGO: Modulo[] = [
  { id: "sellos", titulo: "Sellos", Icono: Lock, componente: Sellos },
  { id: "medidores", titulo: "Medidores", Icono: Gauge, componente: Medidores },
  { id: "mapas", titulo: "Mapas", Icono: MapIcon, componente: Mapas },
  {
    id: "horas-extras",
    titulo: "Horas Extras",
    Icono: Clock,
    componente: HorasExtras,
  },
];
