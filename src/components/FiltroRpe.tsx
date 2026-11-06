import { Autocomplete } from "@base-ui/react/autocomplete";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ChevronDownIcon, XIcon } from "lucide-react";

interface Props {
  // Lista de RPE disponibles para sugerir
  rpes: string[];
  // Texto actual del filtro (lo que se escribió o se eligió)
  valor: string;
  onRpeChange: (texto: string) => void;
}

// Sugiere los RPE que contienen lo que se va escribiendo
function coincideRpe(rpe: string, busqueda: string) {
  return rpe.toLowerCase().includes(busqueda.trim().toLowerCase());
}

export default function FiltroRpe({ rpes, valor, onRpeChange }: Props) {
  return (
    <Autocomplete.Root
      items={rpes}
      filter={coincideRpe}
      value={valor}
      onValueChange={(texto: string) => onRpeChange(texto)}
    >
      <InputGroup className="min-w-36 flex-1 bg-white sm:w-44 sm:flex-none">
        <Autocomplete.Input
          render={<InputGroupInput />}
          placeholder="Buscar RPE"
        />
        <InputGroupAddon align="inline-end">
          {valor ? (
            <Autocomplete.Clear
              render={<InputGroupButton variant="ghost" size="icon-xs" />}
              aria-label="Limpiar RPE"
            >
              <XIcon className="pointer-events-none" />
            </Autocomplete.Clear>
          ) : (
            <Autocomplete.Trigger
              render={<InputGroupButton variant="ghost" size="icon-xs" />}
              aria-label="Ver lista de RPE"
            >
              <ChevronDownIcon className="pointer-events-none text-muted-foreground" />
            </Autocomplete.Trigger>
          )}
        </InputGroupAddon>
      </InputGroup>

      <Autocomplete.Portal>
        <Autocomplete.Positioner
          sideOffset={6}
          align="start"
          className="isolate z-50"
        >
          <Autocomplete.Popup className="max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
            <Autocomplete.Empty>
              <div className="py-2 text-center text-sm text-muted-foreground">
                No se encontró el RPE
              </div>
            </Autocomplete.Empty>
            <Autocomplete.List className="max-h-72 overflow-y-auto overscroll-contain p-1 data-empty:p-0">
              {(rpe: string) => (
                <Autocomplete.Item
                  key={rpe}
                  value={rpe}
                  className="flex cursor-default items-center rounded-md px-2 py-1 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  {rpe}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
}
