import api from "@/api/api.config";
import type { APIRespuesta } from "@/types/apiRespuesta";
import type { Sello } from "@/types/sellos";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

function useSellos() {
  const [todosLosSellos, setTodosLosSellos] = useState<Sello[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroArea, setFiltroArea] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  async function obtenerSellos() {
    try {
      setCargando(true);

      const peticion = await api.get<APIRespuesta<Sello[]>>("/sellos");
      const datos = peticion.data;
      const sellos = datos.datos;

      if (!datos.exito || !sellos) {
        console.error("No se encontraron los sellos");
        return;
      }

      setTodosLosSellos(sellos);
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

  async function subirSellos(excel: File) {
    const formData = new FormData();
    formData.append("archivo", excel);

    try {
      const peticion = await api.post<APIRespuesta<Sello[]>>(
        "/sellos/importar",
        formData,
      );
      const datos = peticion.data;

      if (!datos.exito) {
        throw new Error(datos.mensaje);
      }

      setTodosLosSellos(datos.datos);
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

  function filtrarPorEstado(filtro: string | null) {
    if (!filtro) return;

    if (filtro == "Vencidos") filtro = "vencido";
    else if (filtro == "Por vencer") filtro = "proximo";
    else if (filtro == "A tiempo") filtro = "vigente";
    else if (filtro == "Todos") filtro = "";

    setFiltroEstado(filtro);
  }

  function eliminarSellos() {
    setTodosLosSellos([]);
    // Limpia los filtros para que se muestre la pantalla de subir Excel
    setFiltroEstado("");
    setFiltroArea(null);
  }

  useEffect(() => {
    obtenerSellos();
  }, []);

  // Aplica los dos filtros a la vez; si un filtro está vacío, no descarta nada
  const sellos = todosLosSellos.filter(
    (sello) =>
      (!filtroEstado || sello.estado === filtroEstado) &&
      (!filtroArea || sello.cvearea === filtroArea),
  );

  return {
    sellos,
    filtroEstado,
    filtroArea,
    cargando,
    filtrarPorEstado,
    filtrarPorArea: setFiltroArea,
    subirSellos,
    eliminarSellos,
  };
}

export default useSellos;
