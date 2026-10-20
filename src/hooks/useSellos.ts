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

  return { sellos, filtroEstado, cargando, filtrarPorEstado };
}

export default useSellos;
