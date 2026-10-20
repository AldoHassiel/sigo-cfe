import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSellos from "@/hooks/useSellos";
import { cn } from "@/lib/utils";
import type { Sello } from "@/types/sellos";
import { CloudUploadIcon } from "lucide-react";

const estiloFondoFila: Record<Sello["estado"], string> = {
  vencido: "bg-red-300",
  proximo: "bg-orange-400",
  vigente: "bg-white",
};

export default function Sellos() {
  const { sellos, filtroEstado, cargando, filtrarPorEstado } = useSellos();

  if (cargando) {
    return (
      <div className="grid place-items-center">
        <Spinner className="size-10 text-green-600" />
      </div>
    );
  }

  if (!cargando && sellos.length == 0 && filtroEstado == "") {
    return <div>No hay sellos cargados</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">Sellos</h2>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1">
            <span className="block w-3 h-3 bg-red-500 rounded-full" />
            <span>Vencidos</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="block w-3 h-3 bg-orange-400 rounded-full" />
            <span>Por vencer</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="block w-3 h-3 bg-white rounded-full" />
            <span>A tiempo</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="font-bold">Filtros</p>

          <Select defaultValue="Todos" onValueChange={filtrarPorEstado}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Vencidos">Vencidos</SelectItem>
              <SelectItem value="Por vencer">Por vencer</SelectItem>
              <SelectItem value="A tiempo">A tiempo</SelectItem>
            </SelectContent>
          </Select>

          <CloudUploadIcon className="cursor-pointer" />
        </div>
      </div>

      <Table className="mt-5">
        <TableHeader className = "bg-white">
          <TableRow>
            <TableHead>Sello</TableHead>
            <TableHead>RPE</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Dias restantes</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sellos.map((sello) => (
            <TableRow
              key={sello.numsello}
              className={cn(estiloFondoFila[sello.estado])}
            >
              <TableCell>{sello.numsello}</TableCell>
              <TableCell>{sello.rpe}</TableCell>
              <TableCell>{sello.nombre_area}</TableCell>
              <TableCell>{sello.fechaultimomovimiento}</TableCell>
              <TableCell>{sello.dias_restantes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
