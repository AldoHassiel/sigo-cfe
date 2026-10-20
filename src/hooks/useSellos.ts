import api from "@/api/api.config";
import type { Sello } from "@/types/sellos";
import { useEffect, useState } from "react";
import type { APIRespuesta } from "@/types/apiRespuesta";

function useSellos() {
  const [sellos, setSellos] = useState<Sello[]>([]);
  const [cargando, setCargando] = useState(true);

  async function obtenerSellos() {
    try {
      setCargando(true);

      const peticion = await api.get<APIRespuesta<Sello[]>>("/sellos");
      const datos = peticion.data;
      const sellos = datos.datos;

      if (!datos) {
        console.error("No se encontraron los sellos");
        return;
      }
      setSellos(sellos);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
      obtenerSellos();
    }, []);

    return { sellos, cargando };
}

export default useSellos;
