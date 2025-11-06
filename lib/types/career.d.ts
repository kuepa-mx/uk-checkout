declare type TCareer = {
  carrera_id: string;
  carrera_nombre: string;
  carrera_codigo: string;
  carrera_activo: boolean;
  salesforce_carrera_Id: string;
  cuenta: {
    cuenta_id: string;
    cuenta_tipo: string;
    cuenta_cantidad_cuotas: number;
    cuenta_activo: boolean;
  };
};

declare type Page<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
