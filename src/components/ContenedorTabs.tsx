import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Modulos from "./Modulos";
import { CATALOGO } from "@/modulos/catalogo";
import { useTabs, ID_MODULOS } from "@/hooks/useTabs";

const ESTILO_PANEL = "bg-gray-300 p-6 rounded-b-md rounded-tr-md";

export default function ContenedorTabs() {
  const { abiertas, activa, abrir, cerrar, setActiva } = useTabs();

  return (
    <Tabs
      value={activa}
      onValueChange={(valor) => setActiva(String(valor))}
      className="w-full gap-0"
    >
      {/* ---- La barra de pestañas ---- */}
      <TabsList className="bg-transparent p-0 rounded-none gap-0.5">
        <TabsTrigger
          value={ID_MODULOS}
          className="rounded-none rounded-t-md border-0 px-4 bg-gray-200 data-active:bg-gray-300 data-active:shadow-none!"
        >
          Módulos
        </TabsTrigger>

        {abiertas.map((id) => {
          const modulo = CATALOGO.find((m) => m.id === id)!;
          return (
            <TabsTrigger key={id} value={id}>
              {modulo.titulo}
              <span
                role="button"
                aria-label={`Cerrar ${modulo.titulo}`}
                className="rounded p-0.5 hover:bg-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  cerrar(id);
                }}
              >
                <X className="size-3" />
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* ---- El contenido de cada pestaña ---- */}
      <TabsContent value={ID_MODULOS} keepMounted className={ESTILO_PANEL}>
        <Modulos onAbrir={abrir} />
      </TabsContent>

      {abiertas.map((id) => {
        const { componente: Vista } = CATALOGO.find((m) => m.id === id)!;
        return (
          <TabsContent key={id} value={id} keepMounted className={ESTILO_PANEL}>
            <Vista />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
