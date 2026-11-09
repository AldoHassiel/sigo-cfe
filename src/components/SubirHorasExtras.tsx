import {
  FileSpreadsheetIcon,
  Loader2Icon,
  PlusIcon,
  SheetIcon,
  TableIcon,
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
import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";

const EXTENSIONES_PERMITIDAS = [".csv", ".xls", ".xlsx"];

function esArchivoValido(archivo: File) {
  const nombre = archivo.name.toLowerCase();
  return EXTENSIONES_PERMITIDAS.some((ext) => nombre.endsWith(ext));
}

function mismoArchivo(a: File, b: File) {
  return (
    a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
  );
}

function formatearTamano(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function contarFilas(texto: string) {
  return texto.split("\n").filter((linea) => linea.trim()).length;
}

function esArrastreDeArchivos(e: DragEvent<HTMLElement>) {
  return e.dataTransfer.types.includes("Files");
}

interface Props {
  onImportar: (archivos: File[], textos: string[]) => Promise<void> | void;
}

function SubirHorasExtras({ onImportar }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const contadorArrastre = useRef(0);

  const [archivos, setArchivos] = useState<File[]>([]);
  const [textos, setTextos] = useState<string[]>([]);
  const [textoActual, setTextoActual] = useState("");
  const [arrastrando, setArrastrando] = useState(false);
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);

  const textosAImportar = textoActual.trim()
    ? [...textos, textoActual]
    : textos;
  const totalFuentes = archivos.length + textosAImportar.length;

  function agregarArchivos(nuevos: FileList | null | undefined) {
    if (!nuevos?.length) return;

    const lista = Array.from(nuevos);
    const invalidos = lista.filter((archivo) => !esArchivoValido(archivo));
    const validos = lista.filter(esArchivoValido);

    setError(
      invalidos.length
        ? `Se ignoraron ${invalidos.map((a) => a.name).join(", ")}: solo se permiten archivos .csv, .xls o .xlsx`
        : "",
    );

    setArchivos((actuales) => [
      ...actuales,
      ...validos.filter(
        (nuevo) => !actuales.some((actual) => mismoArchivo(actual, nuevo)),
      ),
    ]);
  }

  function quitarArchivo(indice: number) {
    setArchivos((actuales) => actuales.filter((_, i) => i !== indice));
    setError("");
  }

  function agregarTexto() {
    if (!textoActual.trim()) return;
    setTextos((actuales) => [...actuales, textoActual]);
    setTextoActual("");
    setError("");
  }

  function quitarTexto(indice: number) {
    setTextos((actuales) => actuales.filter((_, i) => i !== indice));
    setError("");
  }

  function manejadorArchivo(e: ChangeEvent<HTMLInputElement>) {
    agregarArchivos(e.target.files);
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
    agregarArchivos(e.dataTransfer.files);
  }

  async function importar() {
    if (!totalFuentes) return;

    try {
      setProcesando(true);
      setError("");
      await onImportar(archivos, textosAImportar);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setProcesando(false);
    }
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
        multiple
      />

      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-20">
            <SheetIcon className="size-16" />
          </EmptyMedia>
          <EmptyTitle className="text-lg">Importar horas extras</EmptyTitle>
          <EmptyDescription className="text-sm">
            {arrastrando
              ? "Suelta los archivos para agregarlos"
              : "Agrega uno o varios archivos (.xlsx, .xls, .csv) o pega tablas copiadas del sistema."}
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className="w-full max-w-xl">
          <Button
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={procesando}
          >
            <FileSpreadsheetIcon />
            Agregar archivos
          </Button>

          <textarea
            value={textoActual}
            onChange={(e) => setTextoActual(e.target.value)}
            disabled={procesando}
            placeholder="O pega aquí una tabla..."
            spellCheck={false}
            className="h-32 w-full resize-y rounded-md border bg-background p-3 font-mono text-xs whitespace-pre outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={agregarTexto}
            disabled={procesando || !textoActual.trim()}
          >
            <PlusIcon />
            Agregar tabla y pegar otra
          </Button>

          {(archivos.length > 0 || textos.length > 0) && (
            <ul className="flex w-full flex-col gap-2">
              {archivos.map((archivo, indice) => (
                <ElementoFuente
                  key={`archivo-${archivo.name}-${archivo.lastModified}`}
                  icono={<FileSpreadsheetIcon className="size-5" />}
                  titulo={archivo.name}
                  detalle={formatearTamano(archivo.size)}
                  onQuitar={() => quitarArchivo(indice)}
                  deshabilitado={procesando}
                />
              ))}
              {textos.map((texto, indice) => (
                <ElementoFuente
                  key={`texto-${indice}`}
                  icono={<TableIcon className="size-5" />}
                  titulo={`Tabla pegada ${indice + 1}`}
                  detalle={`${contarFilas(texto)} filas`}
                  onQuitar={() => quitarTexto(indice)}
                  deshabilitado={procesando}
                />
              ))}
            </ul>
          )}

          <Button onClick={importar} disabled={procesando || !totalFuentes}>
            {procesando && <Loader2Icon className="animate-spin" />}
            {procesando
              ? "Procesando..."
              : `Importar${totalFuentes ? ` (${totalFuentes})` : ""}`}
          </Button>
        </EmptyContent>
      </Empty>

      {error && (
        <p className="mx-auto max-w-xl pb-3 text-left text-sm whitespace-pre-line text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

interface PropsElementoFuente {
  icono: ReactNode;
  titulo: string;
  detalle: string;
  onQuitar: () => void;
  deshabilitado: boolean;
}

function ElementoFuente({
  icono,
  titulo,
  detalle,
  onQuitar,
  deshabilitado,
}: PropsElementoFuente) {
  return (
    <li className="flex items-center gap-3 rounded-md border bg-muted/50 px-3 py-2">
      <span className="shrink-0 text-primary">{icono}</span>
      <div className="flex min-w-0 flex-1 flex-col text-left">
        <span className="truncate text-sm font-medium">{titulo}</span>
        <span className="text-xs text-muted-foreground">{detalle}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onQuitar}
        disabled={deshabilitado}
        aria-label={`Quitar ${titulo}`}
        className="size-7 shrink-0"
      >
        <XIcon className="size-4" />
      </Button>
    </li>
  );
}

export default SubirHorasExtras;
