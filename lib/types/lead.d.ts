// {
//   lead_id: "01d72748-2a64-45e1-a092-40ab4dae6950",
//   nombre: "prueba LS Organico 4",
//   email: "pruebaorganico5@prueba.com",
//   telefono: "8765432100",
//   telefono_lada: "+5218765432100",
//   fecha_creacion: "2025-10-10",
//   hora_creacion: "19:12",
//   contactado_sin_exito: false,
//   fecha_contacto_futuro: "2025-10-24",
//   hora_contacto_futuro: "15:58:00",
//   keywords: null,
//   sitio_web: null,
//   correo_universitario: "pruebarefactor@gmail.com",
//   lead_activo: true,
//   days_since_creation: null,
//   organizationId: null,
//   whatsapp_number: null,
//   metaInfo: null,
//   gclid: null,
//   fecha_promesa_pago: "2024-01-01",
//   comentarios: null,
//   timestamp_creation: "2025-10-10T19:12:01.782Z",
//   isFromBot: null,
//   call_consent: null,
//   send_consent_at: null,
//   consent_sent: null,
//   total_whatsapp_calls: null,
//   utm_source: null,
//   utm_campaign: null,
//   utm_medium: null,
//   utm_term: null,
//   utm_content: null,
//   pais: {
//     pais_id: "ebf7272f-6505-4834-8959-8f59de8e579b",
//     pais_nombre: "Colombia",
//     pais_moneda: "Pesos Colombianos",
//     pais_activo: true,
//   },
//   source: {
//     source_id: "09f31227-5aca-49ff-be79-ee11c46a4a8e",
//     source_nombre: "storie-edtech",
//     source_activo: true,
//   },
//   status: {
//     status_id: "32b6bfbf-aa90-42a3-b5fd-dd3b10f43778",
//     status_nombre: "Matriculado",
//     status_activo: true,
//   },
//   carrera: {
//     carrera_id: "fc9596ef-78e1-412d-a9f7-20733cca1135",
//     carrera_nombre: "Licenciatura en Contabilidad",
//     carrera_codigo: "LEC",
//     carrera_activo: true,
//     salesforce_carrera_Id: "0015f00000BRZ3NAAX",
//     cuenta: {
//       cuenta_id: "ab1da709-45c7-42a0-bced-2608c38537e9",
//       cuenta_tipo: "Licenciatura en Contabilidad",
//       cuenta_cantidad_cuotas: 36,
//       cuenta_activo: true,
//     },
//   },
//   owner: {
//     owner_id: "844afec5-ccbf-4762-ad4d-6f39a451967c",
//     owner_nombre: "Admin User",
//     owner_email: "lee.jong@example.com",
//     owner_activo: true,
//   },
//   no_interesado: null,
//   rating: {
//     rating_id: "0fa9ea31-0267-47aa-9f20-6ccdaa0e0b67",
//     rating_nombre: "Interes bajo",
//     rating_activo: true,
//   },
//   grupo: {
//     grupo_id: "41cc6cc1-6c39-4600-9fe2-91be3ca63145",
//     grupo_nombre: "LEC_2025-03-17",
//     grupo_codigo: "LEC",
//     grupo_inicio: "2025-03-17T07:00:00.000Z",
//     grupo_fin: "2028-03-19T07:00:00.000Z",
//     salesforce_grupo_id: "a0PTQ00000FYbuL2AT",
//     salesforce_grupo_account: "0015f00000BRZ3NAAX",
//     salesforce_cuatrimestre_id: "a0PTQ00000FceUK2AZ",
//   },
// }

declare type TLead = {
  lead_id: string;
  nombre: string;
  email: string;
  telefono: string;
  telefono_lada: string;
  fecha_creacion: string;
  hora_creacion: string;
  carrera: TCareer;
  pais: TCountry;
  owner: TOwner;
  no_interesado: boolean | null;
  rating: TRating;
  grupo: TGrupo;
  status: TStatus;
  source: TSource;
  keywords: string | null;
  sitio_web: string | null;
  correo_universitario: string;
  lead_activo: boolean;
  days_since_creation: number | null;
  organizationId: string | null;
  whatsapp_number: string | null;
  metaInfo: string | null;
  gclid: string | null;
  fecha_promesa_pago: string;
  comentarios: string | null;
  timestamp_creation: string;
  isFromBot: boolean | null;
  call_consent: boolean | null;
  send_consent_at: string | null;
  consent_sent: boolean | null;
  total_whatsapp_calls: number | null;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_medium: string | null;
  utm_term: string | null;
  utm_content: string | null;
  contactado_sin_exito: boolean;
  fecha_contacto_futuro: string | null;
  hora_contacto_futuro: string | null;
};
