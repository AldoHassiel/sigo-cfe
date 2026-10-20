import { useEffect, useState } from "react";
import { CATALOGO } from "@/modulos/catalogo";

export const ID_MODULOS = "modulos";
const CLAVE_GUARDADO = "pestanas-abiertas";

// ¿Existe un módulo con ese id?
function esModuloValido(id: string) {
  return CATALOGO.some((m) => m.id === id);
}

// Lee la URL: "/medidores" → "medidores"
function leerRuta(): string {
  const id = window.location.pathname.slice(1);
  return esModuloValido(id) ? id : ID_MODULOS;
}

// Lee las pestañas que quedaron guardadas en el navegador
function leerGuardadas(): string[] {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_GUARDADO) ?? "[]");
    return Array.isArray(guardado) ? guardado.filter(esModuloValido) : [];
  } catch {
    return [];
  }
}

export function useTabs() {
  const [activa, setActiva] = useState<string>(leerRuta);

  const [abiertas, setAbiertas] = useState<string[]>(() => {
    const guardadas = leerGuardadas();
    const desdeRuta = leerRuta();
    // si entras directo a /medidores, asegura que esa pestaña esté abierta
    if (desdeRuta !== ID_MODULOS && !guardadas.includes(desdeRuta)) {
      guardadas.push(desdeRuta);
    }
    return guardadas;
  });

  // Cada vez que cambia la pestaña activa, actualiza la URL
  useEffect(() => {
    const ruta = activa === ID_MODULOS ? "/" : `/${activa}`;
    window.history.replaceState(null, "", ruta);
  }, [activa]);

  // Cada vez que abres o cierras una pestaña, guarda la lista
  useEffect(() => {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(abiertas));
  }, [abiertas]);

  function abrir(id: string) {
    setAbiertas((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiva(id);
  }

  function cerrar(id: string) {
    const indice = abiertas.indexOf(id);
    const restantes = abiertas.filter((t) => t !== id);
    setAbiertas(restantes);

    if (activa === id) {
      const vecina = restantes[indice] ?? restantes[indice - 1] ?? ID_MODULOS;
      setActiva(vecina);
    }
  }

  return { abiertas, activa, abrir, cerrar, setActiva };
}