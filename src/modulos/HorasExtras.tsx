import useHorasExtras from "@/hooks/useHorasExtras";

function HorasExtras() {
  const { horasExtras, cargando } = useHorasExtras();

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">Horas extras</h2>

      {horasExtras.map((registro) => (
        <p key={registro.rpe}>
          {registro.rpe} - {registro.horas_totales} -{" "}
          {registro.excede_limite_semanal ? "Excede" : "OK"}
        </p>
      ))}
    </div>
  );
}

export default HorasExtras;
