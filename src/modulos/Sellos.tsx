import FiltroArea from "@/components/FiltroArea";
import SubirExcel from "@/components/SubirExcel";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const {
    sellos,
    filtroEstado,
    filtroArea,
    cargando,
    filtrarPorEstado,
    filtrarPorArea,
    subirSellos,
    eliminarSellos,
  } = useSellos();

  if (cargando) {
    return (
      <div className="grid place-items-center">
        <Spinner className="size-10 text-green-600" />
      </div>
    );
  }

  if (!cargando && sellos.length == 0 && filtroEstado == "" && !filtroArea) {
    return <SubirExcel onExcelCargado={subirSellos} />;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="font-bold text-2xl">Sellos</h2>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
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

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <p className="font-bold">Filtros</p>

          <FiltroArea onAreaChange={filtrarPorArea} />

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

          <Tooltip>
            <TooltipTrigger>
              <CloudUploadIcon
                className="cursor-pointer"
                onClick={eliminarSellos}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Subir archivos</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Table className="mt-5">
        <TableHeader className="bg-white">
          <TableRow>
            <TableHead>Sello</TableHead>
            <TableHead>RPE</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Dias restantes</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sellos.length == 0 && (
            <TableRow className="bg-white">
              <TableCell colSpan={5} className="text-center">
                No hay sellos con estos filtros
              </TableCell>
            </TableRow>
          )}

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
