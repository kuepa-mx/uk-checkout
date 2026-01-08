import * as yup from "yup";

// type TGeneratePaymentLink = {
//   lead_id: string;
//   paymentMethod: "mercadopago" | "flywire";
//   amount: number;
//   paymentTypes: string;
//   solicited_email: string;
//   pago_cuotas_aplicar_descuento: number;
//   fecha_promesa_pago: string;
//   group: string;
//   pago_especial_cuatrimestre?: boolean;
// };

export const createPaymentDTO = yup.object().shape({
  lead_id: yup.string().required(),
  checkout_id: yup.string().required(),
  paymentMethod: yup.string().oneOf(["mercadopago", "flywire"]).required(),
  amount: yup.number().required(),
  paymentTypes: yup.string().required(),
  solicited_email: yup.string().required(),
  pago_cuotas_aplicar_descuento: yup.number().required(),
  fecha_promesa_pago: yup.string().required(),
  group: yup.string().required(),
  descuento: yup.object().shape({
    descuento_id: yup.string().required(),
    descuento_nombre: yup.string().required(),
    descuento_porcentaje: yup.string().required(),
    descuento_cuotas: yup.string().nullable(),
  }).required(),
  pago_especial_cuatrimestre: yup.boolean().optional(),
});

export type TCreatePaymentDTO = yup.InferType<typeof createPaymentDTO>;
