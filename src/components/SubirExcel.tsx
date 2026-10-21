import {
  FileSpreadsheetIcon,
  Loader2Icon,
  SheetIcon,
  XIcon,
} from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { Button } from "./ui/button";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

const EXTENSIONES_PERMITIDAS = [".csv", ".xls", ".xlsx"];

function esArchivoValido(archivo: File) {
  const nombre = archivo.name.toLowerCase();
  return EXTENSIONES_PERMITIDAS.some((ext) => nombre.endsWith(ext));
}

function formatearTamano(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  onExcelCargado: (excel: File) => Promise<void> | void;
}

function SubirExcel({ onExcelCargado }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const contadorArrastre = useRef(0);

  const [archivo, setArchivo] = useState<File | null>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);

  function seleccionarArchivo(nuevo: File | undefined) {
    if (!nuevo) return;

    if (!esArchivoValido(nuevo)) {
      setError("Solo se permiten archivos .csv, .xls o .xlsx");
      return;
    }

    setError("");
    setArchivo(nuevo);
  }

  function manejadorArchivo(e: ChangeEvent<HTMLInputElement>) {
    seleccionarArchivo(e.target.files?.[0]);
    e.target.value = "";
  }

  function manejadorDragEnter(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    contadorArrastre.current += 1;
    setArrastrando(true);
  }

  function manejadorDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    contadorArrastre.current -= 1;
    if (contadorArrastre.current <= 0) {
      contadorArrastre.current = 0;
      setArrastrando(false);
    }
  }

  function manejadorOnDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    contadorArrastre.current = 0;
    setArrastrando(false);
    seleccionarArchivo(e.dataTransfer.files[0]);
  }

  function limpiarArchivo() {
    setArchivo(null);
    setError("");
  }

  async function procesarArchivo() {
    if (!archivo) return;

    try {
      setProcesando(true);
      setError("");
      await onExcelCargado(archivo);
      setArchivo(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al procesar el archivo",
      );
    } finally {
      setProcesando(false);
    }
  }

  return (
    <div
      onDragEnter={manejadorDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={manejadorDragLeave}
      onDrop={manejadorOnDrop}
      className={`rounded-lg border-2 border-dashed transition-colors ${
        arrastrando ? "border-primary bg-primary/10" : "border-transparent"
      }`}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={manejadorArchivo}
        className="hidden"
        accept=".csv,.xls,.xlsx"
      />

      {archivo ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-20">
              <FileSpreadsheetIcon className="size-16" />
            </EmptyMedia>
            <EmptyTitle className="text-lg">
              Archivo listo para procesar
            </EmptyTitle>
            <EmptyDescription className="text-sm">
              Revisa el archivo y presiona continuar
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex items-center gap-3 rounded-md border bg-muted/50 px-3 py-2 max-w-full">
              <FileSpreadsheetIcon className="size-5 shrink-0 text-primary" />
              <div className="flex min-w-0 flex-col text-left">
                <span className="truncate text-base font-medium">
                  {archivo.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatearTamano(archivo.size)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={limpiarArchivo}
                disabled={procesando}
                aria-label="Quitar archivo"
                className="size-7 shrink-0"
              >
                <XIcon className="size-4" />
              </Button>
            </div>

            <Button onClick={procesarArchivo} disabled={procesando}>
              {procesando && <Loader2Icon className="animate-spin" />}
              {procesando ? "Procesando..." : "Continuar"}
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-20">
              <SheetIcon className="size-16" />
            </EmptyMedia>
            <EmptyTitle className="text-lg">No hay datos cargados</EmptyTitle>
            <EmptyDescription className="text-sm">
              {arrastrando
                ? "Suelta el archivo para cargarlo"
                : "Presione el botón o arrastre un archivo .csv o Excel para cargar los datos"}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => inputRef.current?.click()}>
              Cargar datos
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {error && (
        <p className="mt-2 text-center text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

export default SubirExcel;
