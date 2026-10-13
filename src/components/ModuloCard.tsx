import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardTitle } from "./ui/card";

interface Props {
  titulo: string;
  Icono: LucideIcon;

  onClick: () => void;
}

export default function ModuloCard({ titulo, Icono, onClick }: Props) {
  return (
    <Card
      className="flex flex-col justify-center items-center w-50 cursor-pointer hover:scale-105"
      onClick={onClick}
    >
      <CardContent>
        <Icono className="mx-auto" size={50} />
        <CardTitle className="text-xl mt-2">{titulo}</CardTitle>
      </CardContent>
    </Card>
  );
}
