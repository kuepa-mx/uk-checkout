// {
//   "descuento_id": "03d89bc8-760f-44df-9bf1-c3cb73ad5e6d",
//   "descuento_nombre": "Promo anualidad Diciembre",
//   "descuento_porcentaje": "0.47",
//   "descuento_cuotas": "12",
//   "tipo": "estandar",
//   "activo": true,
//   "descripcion": null,
//   "checkout": false,
//   "paises": null,
//   "carreras": null
// }

declare type TDiscount = {
  descuento_id: string;
  descuento_nombre: string;
  descuento_porcentaje: string;
  descuento_cuotas: string | null;
  tipo: string;
  activo: boolean;
  descripcion: string | null;
  checkout: boolean;
  paises: string[] | null;
  carreras: string[] | null;
};
