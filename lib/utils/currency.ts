type CurrencyFormatConfig = {
  locale: string;
  currency: string;
};

// Add new countries here when discounts/costs are enabled for them.
const COUNTRY_CURRENCY_MAP: Record<string, CurrencyFormatConfig> = {
  Argentina: { locale: "es-AR", currency: "ARS" },
  Guatemala: { locale: "es-GT", currency: "GTQ" },
  Bolivia: { locale: "es-BO", currency: "BOB" },
  Honduras: { locale: "es-HN", currency: "HNL" },
  Uruguay: { locale: "es-UY", currency: "UYU" },
  "El Salvador": { locale: "es-SV", currency: "SVC" },
  Panama: { locale: "es-PA", currency: "PAB" },
  "Republica Dominicana": { locale: "es-DO", currency: "DOP" },
  Paraguay: { locale: "es-PY", currency: "PYG" },
  Ecuador: { locale: "es-EC", currency: "USD" },
  Nicaragua: { locale: "es-NI", currency: "NIO" },
  Mexico: { locale: "es-MX", currency: "MXN" },
  EUA: { locale: "en-US", currency: "USD" },
  España: { locale: "es-ES", currency: "EUR" },
  Chile: { locale: "es-CL", currency: "CLP" },
  "Costa Rica": { locale: "es-CR", currency: "CRC" },
  Peru: { locale: "es-PE", currency: "PEN" },
  Colombia: { locale: "es-CO", currency: "COP" },
};

const DEFAULT_CURRENCY_CONFIG: CurrencyFormatConfig = {
  locale: "en-US",
  currency: "USD",
};

export function getCurrencyFormatConfig(
  country?: TCountry,
): CurrencyFormatConfig {
  if (!country?.pais_nombre) {
    return DEFAULT_CURRENCY_CONFIG;
  }
  return COUNTRY_CURRENCY_MAP[country.pais_nombre] ?? DEFAULT_CURRENCY_CONFIG;
}

export function formatCurrency(amount: number, country?: TCountry): string {
  const config = getCurrencyFormatConfig(country);

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
