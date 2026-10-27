import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import useAreas from "@/hooks/useAreas";
import type { Area } from "@/types/areas";

interface Props {
  // Recibe el código del área elegida, o null si se limpió el filtro
  onAreaChange: (idArea: string | null) => void;
}

// Busca coincidencias tanto en el código (DB07E) como en el nombre del área
function coincideArea(area: Area, busqueda: string) {
  const texto = busqueda.trim().toLowerCase();
  return (
    area.id.toLowerCase().includes(texto) ||
    area.nombre.toLowerCase().includes(texto)
  );
}

export default function FiltroArea({ onAreaChange }: Props) {
  const { areas, cargando } = useAreas();

  return (
    <Combobox
      items={areas}
      filter={coincideArea}
      itemToStringLabel={(area: Area) => `${area.id} - ${area.nombre}`}
      isItemEqualToValue={(a: Area, b: Area) => a.id === b.id}
      onValueChange={(area: Area | null) => onAreaChange(area?.id ?? null)}
    >
      <ComboboxInput
        className="min-w-48 flex-1 sm:w-64 sm:flex-none bg-white"
        placeholder={cargando ? "Cargando áreas..." : "Buscar área"}
        disabled={cargando}
        showClear
      />
      <ComboboxContent>
        <ComboboxEmpty>No se encontró el área</ComboboxEmpty>
        <ComboboxList>
          {(area: Area) => (
            <ComboboxItem key={area.id} value={area}>
              <span className="font-medium">{area.id}</span>
              <span className="text-muted-foreground">{area.nombre}</span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
