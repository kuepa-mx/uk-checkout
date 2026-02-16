import { Entity } from "../enum/entity";

export type EntityTypeMap = {
  [Entity.LEAD]: TLead;
  [Entity.CHECKOUT]: TCheckout;
  [Entity.DISCOUNT]: TDiscount;
  [Entity.CAREER]: TCareer;
  [Entity.COST]: TCost;
  [Entity.GROUP]: TGrupo;
}