import api from "@/api/api.config";
import type { APIRespuesta } from "@/types/apiRespuesta";
import type { Medidor } from "@/types/medidores";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

function useMedidores() {
  const [todosLosMedidores, setTodosLosMedidores] = useState<Medidor[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [cargando, setCargando] = useState(true);

  async function obtenerMedidores() {
    try {
      setCargando(true);

      const peticion = await api.get<APIRespuesta<Medidor[]>>("/medidores");
      const datos = peticion.data;
      const medidores = datos.datos;

      if (!datos.exito || !medidores) {
        console.error("No se encontraron los medidores");
        return;
      }

      setTodosLosMedidores(datos.datos);
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
    obtenerMedidores();
  }, []);

  const medidores = filtroEstado
    ? todosLosMedidores.filter((medidor) => medidor.estado === filtroEstado)
    : todosLosMedidores;

  return { medidores, filtroEstado, cargando, filtrarPorEstado };
}

export default useMedidores;
