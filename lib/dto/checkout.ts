import * as yup from "yup";

export const createCheckoutDTO = yup.object().shape({
  lead_id: yup.string().required(),
  owner_email: yup.string().required(),
});
export type TCreateCheckoutDTO = yup.InferType<typeof createCheckoutDTO>;
