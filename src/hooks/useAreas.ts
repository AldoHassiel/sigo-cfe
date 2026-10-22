import api from "@/api/api.config";
import type { APIRespuesta } from "@/types/apiRespuesta";
import type { Area } from "@/types/areas";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

function useAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [cargando, setCargando] = useState(true);

  async function obtenerAreas() {
    try {
      setCargando(true);

      const peticion = await api.get<APIRespuesta<Area[]>>("/areas");
      const datos = peticion.data;

      if (!datos.exito || !datos.datos) {
        console.error("No se encontraron las áreas");
        return;
      }

      setAreas(datos.datos);
    } catch (error) {
      if (isAxiosError<APIRespuesta<null>>(error) && error.response) {
        // Errores mandados por la api
        console.error(error.response.data.mensaje);
      } else {
        // Errores al intentar hacer la peticion
        console.error("No se pudieron obtener las áreas: " + error);
      }
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    obtenerAreas();
  }, []);

  return { areas, cargando };
}

export default useAreas;
