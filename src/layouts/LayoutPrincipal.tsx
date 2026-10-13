import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function LayoutPrincipal({ children }: Props) {
  return (
    <div className="min-h-screen min-w-screen bg-gray-200">
      <header className="text-2xl bg-green-600 text-white p-2 pl-4 font-bold">
        Sistema Integral de Gestión Comercial CFE
      </header>
      <main className="flex justify-center items-center">{children}</main>
    </div>
  );
}
