import { useState } from "react";

export const ID_MODULOS = "modulos";

export function useTabs() {
  // ids de las pestañas abiertas (sin contar "Módulos", que siempre está)
  const [abiertas, setAbiertas] = useState<string[]>([]);
  // id de la pestaña que se está viendo
  const [activa, setActiva] = useState<string>(ID_MODULOS);

  function abrir(id: string) {
    // si ya está abierta no la duplica, solo la enfoca
    setAbiertas((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiva(id);
  }

  function cerrar(id: string) {
    const indice = abiertas.indexOf(id);
    const restantes = abiertas.filter((t) => t !== id);
    setAbiertas(restantes);

    // si cerraste la que estabas viendo, pasa a la vecina
    if (activa === id) {
      const vecina = restantes[indice] ?? restantes[indice - 1] ?? ID_MODULOS;
      setActiva(vecina);
    }
  }

  return { abiertas, activa, abrir, cerrar, setActiva };
}