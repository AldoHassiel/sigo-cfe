import api from "@/api/api.config";
import type { APIRespuesta } from "@/types/apiRespuesta";
import type { Sello } from "@/types/sellos";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

function useSellos() {
  const [todosLosSellos, setTodosLosSellos] = useState<Sello[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("");
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

  useEffect(() => {
    obtenerSellos();
  }, []);

  const sellos = filtroEstado
    ? todosLosSellos.filter((sello) => sello.estado === filtroEstado)
    : todosLosSellos;

  return { sellos, filtroEstado, cargando, filtrarPorEstado, subirSellos };
}

export default useSellos;
