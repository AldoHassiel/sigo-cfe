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
        await api.get<APIRespuesta<HorasExtras[]>>("/horas-extras/");
      const datos = peticion.data;
      const horasExtras = datos.datos;

      if (!datos.exito || !horasExtras) {
        console.error("No se encontraron las horas extras");
        return;
      }

      setHorasExtras(datos.datos);
    } catch (error) {
      if (isAxiosError<APIRespuesta<null>>(error)) {
        if (error.response) {
          throw new Error(error.response.data.mensaje);
        }

        throw new Error("No se pudo conectar con el servidor.");
      }

      throw error;
    } finally {
      setCargando(false);
    }
  }

  // Todas las fuentes van en una sola petición: la importación reemplaza
  // todos los datos, así que mandarlas por separado borraría las anteriores
  async function importarHorasExtras(archivos: File[], textos: string[]) {
    const formData = new FormData();
    archivos.forEach((archivo) => formData.append("archivos", archivo));
    textos.forEach((texto) => formData.append("textos", texto));

    try {
      const peticion = await api.post<APIRespuesta<HorasExtras[]>>(
        "/horas-extras/importar",
        formData,
      );
      const datos = peticion.data;

      if (!datos.exito) {
        throw new Error(datos.mensaje);
      }

      setHorasExtras(datos.datos);
    } catch (error) {
      if (isAxiosError<APIRespuesta<null>>(error)) {
        if (error.response) {
          throw new Error(error.response.data.mensaje);
        }

        throw new Error("No se pudo conectar con el servidor.");
      }

      throw error;
    }
  }

  function eliminarHoras() {
    setHorasExtras([]);
  }

  useEffect(() => {
    obtenerHorasExtras();
  }, []);

  return {
    horasExtras,
    cargando,
    importarHorasExtras,
    eliminarHoras,
  };
}

export default useHorasExtras;
