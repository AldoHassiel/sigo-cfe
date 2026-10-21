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

function esArrastreDeArchivos(e: DragEvent<HTMLElement>) {
  return e.dataTransfer.types.includes("Files");
}

interface Props {
  onExcelCargado: (excel: File) => Promise<void> | void;
  permitirTexto?: boolean;
  onTextoCargado?: (texto: string) => Promise<void> | void;
}

function SubirExcel({
  onExcelCargado,
  permitirTexto = false,
  onTextoCargado,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const contadorArrastre = useRef(0);

  const [modo, setModo] = useState<"archivo" | "texto">("archivo");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [texto, setTexto] = useState("");
  const [arrastrando, setArrastrando] = useState(false);
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);

  const mostrarTexto = permitirTexto && modo === "texto";

  function seleccionarArchivo(nuevo: File | undefined) {
    if (!nuevo) return;

    if (!esArchivoValido(nuevo)) {
      setError("Solo se permiten archivos .csv, .xls o .xlsx");
      return;
    }

    setError("");
    setArchivo(nuevo);
    setModo("archivo");
  }

  function manejadorArchivo(e: ChangeEvent<HTMLInputElement>) {
    seleccionarArchivo(e.target.files?.[0]);
    e.target.value = "";
  }

  function manejadorDragEnter(e: DragEvent<HTMLDivElement>) {
    if (!esArrastreDeArchivos(e)) return;
    e.preventDefault();
    contadorArrastre.current += 1;
    setArrastrando(true);
  }

  function manejadorDragOver(e: DragEvent<HTMLDivElement>) {
    if (esArrastreDeArchivos(e)) e.preventDefault();
  }

  function manejadorDragLeave(e: DragEvent<HTMLDivElement>) {
    if (!esArrastreDeArchivos(e)) return;
    e.preventDefault();
    contadorArrastre.current -= 1;
    if (contadorArrastre.current <= 0) {
      contadorArrastre.current = 0;
      setArrastrando(false);
    }
  }

  function manejadorOnDrop(e: DragEvent<HTMLDivElement>) {
    if (!esArrastreDeArchivos(e)) return;
    e.preventDefault();
    contadorArrastre.current = 0;
    setArrastrando(false);
    seleccionarArchivo(e.dataTransfer.files[0]);
  }

  function limpiarArchivo() {
    setArchivo(null);
    setError("");
  }

  function limpiarTexto() {
    setTexto("");
    setError("");
  }

  async function ejecutar(accion: () => Promise<void> | void) {
    try {
      setProcesando(true);
      setError("");
      await accion();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setProcesando(false);
    }
  }

  function procesarArchivo() {
    if (!archivo) return;
    ejecutar(() => onExcelCargado(archivo));
  }

  function procesarTexto() {
    if (!texto.trim() || !onTextoCargado) return;
    ejecutar(() => onTextoCargado(texto));
  }

  return (
    <div
      onDragEnter={manejadorDragEnter}
      onDragOver={manejadorDragOver}
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

      {permitirTexto && (
        <div className="flex justify-center gap-2 pt-4">
          <Button
            size="sm"
            variant={modo === "archivo" ? "default" : "outline"}
            onClick={() => setModo("archivo")}
            disabled={procesando}
          >
            Subir archivo
          </Button>
          <Button
            size="sm"
            variant={modo === "texto" ? "default" : "outline"}
            onClick={() => setModo("texto")}
            disabled={procesando}
          >
            Pegar tabla
          </Button>
        </div>
      )}

      {mostrarTexto ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-20">
              <SheetIcon className="size-16" />
            </EmptyMedia>
            <EmptyTitle className="text-lg">Pegar tabla copiada</EmptyTitle>
            <EmptyDescription className="text-sm">
              Copia las celdas desde Excel y pégalas aquí. También puedes
              arrastrar texto seleccionado.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="max-w-xl">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              disabled={procesando}
              placeholder="Pega aquí la tabla..."
              spellCheck={false}
              className="h-48 w-full resize-y rounded-md border bg-background p-3 font-mono text-xs whitespace-pre outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={limpiarTexto}
                disabled={procesando || !texto}
              >
                Limpiar
              </Button>
              <Button
                onClick={procesarTexto}
                disabled={procesando || !texto.trim()}
              >
                {procesando && <Loader2Icon className="animate-spin" />}
                {procesando ? "Procesando..." : "Continuar"}
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      ) : archivo ? (
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
            <EmptyTitle className="text-lg">Subir archivo</EmptyTitle>
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
        <p className="mt-2 pb-2 text-center text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export default SubirExcel;
