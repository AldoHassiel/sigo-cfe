import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import api from "@/api/api.config";
import type { APIRespuesta } from "@/types/apiRespuesta";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function subirArchivo<T>(
  endpoint: string,
  archivo: File,
): Promise<T> {
  const formData = new FormData();
  formData.append("archivo", archivo);

  const { data } = await api.post<APIRespuesta<T>>(endpoint, formData);

  if (!data.exito) {
    throw new Error("No se pudo procesar el archivo");
  }

  return data.datos;
}
