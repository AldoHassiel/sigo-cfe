import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function LayoutPrincipal({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="text-2xl bg-green-700 text-white p-4 pl-6 font-bold">
        Sistema Integral de Gestión Comercial CFE
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
