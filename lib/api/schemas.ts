import { removeAccents } from "../utils";
import * as yup from "yup";

export const checkoutFormSchema = yup.object().shape({
  firstName: yup
    .string()
    .transform(removeAccents)
    .required("El nombre es requerido")
    .matches(/^[a-zA-Z]+$/, "El nombre solo puede contener letras"),
  lastName: yup
    .string()
    .transform(removeAccents)
    .required("El apellido es requerido")
    .matches(/^[a-zA-Z]+$/, "El apellido solo puede contener letras"),
  career: yup.string().required("La carrera es requerida"),
  startingDate: yup.string().required("La fecha de inicio es requerida"),
  discountType: yup
    .string()
    .required("El plan de pago es requerido")
    .min(1, "El plan de pago es requerido"),
  totalAmount: yup
    .number()
    .required("El monto total es requerido")
    .min(1, "El monto total debe ser mayor a 0"),
});
