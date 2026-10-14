import ModuloCard from "./ModuloCard";
import { CATALOGO } from "@/modulos/catalogo";

interface Props {
  onAbrir: (id: string) => void;
}

export default function Modulos({ onAbrir }: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      {CATALOGO.map((m) => (
        <ModuloCard
          key={m.id}
          titulo={m.titulo}
          Icono={m.Icono}
          onClick={() => onAbrir(m.id)}
        />
      ))}
    </div>
  );
}
