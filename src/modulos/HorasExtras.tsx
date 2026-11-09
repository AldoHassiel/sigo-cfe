import { Spinner } from "@/components/ui/spinner";
import useHorasExtras from "@/hooks/useHorasExtras";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CloudUploadIcon } from "lucide-react";
import SubirHorasExtras from "@/components/SubirHorasExtras";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const estiloFondoFila = {
  excede: "bg-red-300",
  normal: "bg-white",
};

function HorasExtras() {
  const { horasExtras, cargando, importarHorasExtras, eliminarHoras } =
    useHorasExtras();

  if (cargando)
    return (
      <div className="grid place-items-center">
        <Spinner className="size-10 text-green-600" />
      </div>
    );

  if (!cargando && horasExtras.length == 0) {
    return <SubirHorasExtras onImportar={importarHorasExtras} />;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-2xl font-bold">Horas extras</h2>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <div className="flex items-center gap-1">
            <span className="block w-3 h-3 bg-red-500 rounded-full" />
            <span>Excede</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="block w-3 h-3 bg-white rounded-full" />
            <span>Normal</span>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger>
            <CloudUploadIcon
              className="cursor-pointer"
              onClick={eliminarHoras}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Subir archivos</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Table className="mt-5">
        <TableHeader className="bg-white">
          <TableRow>
            <TableHead>RPE</TableHead>
            <TableHead>Horas totales</TableHead>
            <TableHead>Semanas excedidas</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {horasExtras.map((horaExtra) => (
            <TableRow
              key={horaExtra.rpe}
              className={`${estiloFondoFila[horaExtra.excede_limite_semanal ? "excede" : "normal"]}`}
            >
              <TableCell>{horaExtra.rpe}</TableCell>
              <TableCell>{horaExtra.horas_totales}</TableCell>
              <TableCell>
                {horaExtra.semanas_excedidas} de {horaExtra.total_semanas}
              </TableCell>
              <TableCell>
                {horaExtra.excede_limite_semanal ? "Excede" : "Normal"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HorasExtras;
