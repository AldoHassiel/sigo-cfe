export interface APIRespuesta<T> {
  exito: boolean;
  mensaje: string;
  datos: T;
}
