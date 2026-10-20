import { useState, useEffect } from "react";
import type { HorasExtras } from "../types/horasExtras";
import api from "@/api/api.config";
import type { APIRespuesta } from "@/types/apiRespuesta";
import { isAxiosError } from "axios";

function useHorasExtras() {
  const [horasExtras, setHorasExtras] = useState<HorasExtras[]>([]);
  const [cargando, setCargando] = useState(true);

  async function obtenerHorasExtras() {
    try {
      setCargando(true);

      const peticion =
        await api.get<APIRespuesta<HorasExtras[]>>("/horas-extras");
      const datos = peticion.data;
      const horasExtras = datos.datos;

      if (!datos.exito || !horasExtras) {
        console.error("No se encontraron las horas extras");
        return;
      }

      setHorasExtras(datos.datos);
    } catch (error) {
      if (isAxiosError<APIRespuesta<null>>(error) && error.response) {
        // Errores mandados por la api
        const { mensaje } = error.response.data;
        console.error(mensaje);
      } else {
        // Errores mandados al intentar hacer la peticion
        console.log("Ha ocurrido un error inesperado: " + error);
      }
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    obtenerHorasExtras();

  }, []);

  return {horasExtras, cargando};
}

export default useHorasExtras;
