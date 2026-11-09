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
import { addDays, format, parseISO } from "date-fns";
import FiltroRpe from "@/components/FiltroRpe";
import SubirHorasExtras from "@/components/SubirHorasExtras";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const estiloFondoFila = {
  excede: "bg-red-300",
  normal: "bg-white",
};

const TODAS_LAS_SEMANAS = "todas";

// "2026-08-31" -> "31/08 – 06/09/2026" (de lunes a domingo)
function formatearSemana(lunes: string) {
  const inicio = parseISO(lunes);
  return `${format(inicio, "dd/MM")} – ${format(addDays(inicio, 6), "dd/MM/yyyy")}`;
}

function HorasExtras() {
  const {
    horasExtras,
    filas,
    filtroRpe,
    filtroSemana,
    rpes,
    semanas,
    cargando,
    filtrarPorRpe,
    filtrarPorSemana,
    importarHorasExtras,
    eliminarHoras,
  } = useHorasExtras();

  const opcionesSemana = [
    { value: TODAS_LAS_SEMANAS, label: "Todas las semanas" },
    ...semanas.map((semana) => ({
      value: semana,
      label: formatearSemana(semana),
    })),
  ];

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

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <p className="font-bold">Filtros</p>

          <FiltroRpe
            rpes={rpes}
            valor={filtroRpe}
            onRpeChange={filtrarPorRpe}
          />

          <Select
            items={opcionesSemana}
            value={filtroSemana ?? TODAS_LAS_SEMANAS}
            onValueChange={(valor) =>
              filtrarPorSemana(
                !valor || valor === TODAS_LAS_SEMANAS ? null : valor,
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {opcionesSemana.map((opcion) => (
                <SelectItem key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
      </div>

      <Table className="mt-5">
        <TableHeader className="bg-white">
          <TableRow>
            <TableHead>RPE</TableHead>
            <TableHead>
              {filtroSemana ? "Horas de la semana" : "Horas totales"}
            </TableHead>
            {!filtroSemana && <TableHead>Semanas excedidas</TableHead>}
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filas.length == 0 && (
            <TableRow className="bg-white">
              <TableCell
                colSpan={filtroSemana ? 3 : 4}
                className="text-center"
              >
                No hay horas extras con estos filtros
              </TableCell>
            </TableRow>
          )}

          {filas.map((fila) => (
            <TableRow
              key={fila.rpe}
              className={`${estiloFondoFila[fila.excede ? "excede" : "normal"]}`}
            >
              <TableCell>{fila.rpe}</TableCell>
              <TableCell>{fila.horas}</TableCell>
              {!filtroSemana && (
                <TableCell>
                  {fila.semanasExcedidas} de {fila.totalSemanas}
                </TableCell>
              )}
              <TableCell>{fila.excede ? "Excede" : "Normal"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HorasExtras;
