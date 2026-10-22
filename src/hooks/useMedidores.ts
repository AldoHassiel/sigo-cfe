import api from "@/api/api.config";
import type { APIRespuesta } from "@/types/apiRespuesta";
import type { Medidor } from "@/types/medidores";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

function useMedidores() {
  const [todosLosMedidores, setTodosLosMedidores] = useState<Medidor[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroArea, setFiltroArea] = useState<string | null>(null);
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

  async function subirMedidores(excel: File) {
    const formData = new FormData();
    formData.append("archivo", excel);

    try {
      const peticion = await api.post<APIRespuesta<Medidor[]>>(
        "/medidores/importar",
        formData,
      );
      const datos = peticion.data;

      if (!datos.exito) {
        throw new Error(datos.mensaje);
      }

      setTodosLosMedidores(datos.datos);
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

  function eliminarMedidores() {
    setTodosLosMedidores([]);
    // Limpia los filtros para que se muestre la pantalla de subir Excel
    setFiltroEstado("");
    setFiltroArea(null);
  }

  useEffect(() => {
    obtenerMedidores();
  }, []);

  // Aplica los dos filtros a la vez; si un filtro está vacío, no descarta nada
  const medidores = todosLosMedidores.filter(
    (medidor) =>
      (!filtroEstado || medidor.estado === filtroEstado) &&
      (!filtroArea || medidor.cvearea === filtroArea),
  );

  return {
    medidores,
    filtroEstado,
    filtroArea,
    cargando,
    filtrarPorEstado,
    filtrarPorArea: setFiltroArea,
    subirMedidores,
    eliminarMedidores,
  };
}

export default useMedidores;
