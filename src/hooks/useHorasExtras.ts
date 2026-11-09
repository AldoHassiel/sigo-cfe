import { useState, useEffect } from "react";
import type { HorasExtras } from "../types/horasExtras";
import api from "@/api/api.config";
import type { APIRespuesta } from "@/types/apiRespuesta";
import { isAxiosError } from "axios";

export interface FilaHorasExtras {
  rpe: string;
  horas: string;
  // null cuando se filtra por una semana
  semanasExcedidas: number | null;
  totalSemanas: number | null;
  excede: boolean;
}

function useHorasExtras() {
  const [horasExtras, setHorasExtras] = useState<HorasExtras[]>([]);
  const [filtroRpe, setFiltroRpe] = useState("");
  // Lunes de la semana elegida (aaaa-mm-dd); null = todas las semanas
  const [filtroSemana, setFiltroSemana] = useState<string | null>(null);
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
    // Limpia los filtros para que se muestre la pantalla de subir archivos
    setFiltroRpe("");
    setFiltroSemana(null);
  }

  useEffect(() => {
    obtenerHorasExtras();
  }, []);

  // Con una semana elegida, cada fila muestra solo las horas y el estado de
  // esa semana; los RPE sin horas en esa semana no aparecen
  const filas: FilaHorasExtras[] = horasExtras
    .filter(
      (horaExtra) =>
        !filtroRpe ||
        horaExtra.rpe.toLowerCase().includes(filtroRpe.trim().toLowerCase()),
    )
    .flatMap((horaExtra): FilaHorasExtras[] => {
      if (!filtroSemana) {
        return [
          {
            rpe: horaExtra.rpe,
            horas: horaExtra.horas_totales,
            semanasExcedidas: horaExtra.semanas_excedidas,
            totalSemanas: horaExtra.total_semanas,
            excede: horaExtra.excede_limite_semanal,
          },
        ];
      }

      const semana = horaExtra.semanas.find((s) => s.semana === filtroSemana);
      if (!semana) return [];

      return [
        {
          rpe: horaExtra.rpe,
          horas: semana.horas,
          semanasExcedidas: null,
          totalSemanas: null,
          excede: semana.excede_limite_semanal,
        },
      ];
    });

  // RPE sin repetir, ordenados, para las sugerencias del filtro
  const rpes = horasExtras.map((horaExtra) => horaExtra.rpe).sort();

  // Semanas que aparecen en los datos importados, de la más reciente a la más antigua
  const semanas = [
    ...new Set(
      horasExtras.flatMap((horaExtra) =>
        horaExtra.semanas.map((s) => s.semana),
      ),
    ),
  ]
    .sort()
    .reverse();

  return {
    horasExtras,
    filas,
    filtroRpe,
    filtroSemana,
    rpes,
    semanas,
    cargando,
    filtrarPorRpe: setFiltroRpe,
    filtrarPorSemana: setFiltroSemana,
    importarHorasExtras,
    eliminarHoras,
  };
}

export default useHorasExtras;
