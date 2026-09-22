import raw from "@/data/africa-countries.json";

export type MarketRollout = "pilot" | "coming_soon" | "planned" | "watch";

export type AfricaCountry = {
  iso2: string;
  iso3: string;
  name: string;
  affiliation: string;
  population: number;
  path: string;
  cx: number;
  cy: number;
  status: MarketRollout;
};

type AfricaMapFile = {
  viewBox: string;
  width: number;
  height: number;
  source: string;
  countries: AfricaCountry[];
};

const map = raw as AfricaMapFile;

export const AFRICA_VIEWBOX = map.viewBox;
export const AFRICA_MAP_WIDTH = map.width;
export const AFRICA_MAP_HEIGHT = map.height;
export const AFRICA_COUNTRIES = map.countries;
export const AFRICA_CLIP_PATH = AFRICA_COUNTRIES.map((c) => c.path).join(" ");

export const DIASPORA_RESIDENCES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Germany",
  "France",
  "Netherlands",
  "Sweden",
  "United Arab Emirates",
  "Other",
] as const;

export const RESIDENCE_OPTIONS = [
  ...AFRICA_COUNTRIES.map((c) => c.name),
  ...DIASPORA_RESIDENCES,
];

const EXCHANGE_NOTE: Record<string, string> = {
  GH: "Ghana Stock Exchange — first pilot market",
  NG: "Nigerian Exchange — next African market",
  KE: "Nairobi Securities Exchange — planned rollout",
  ZA: "Johannesburg Stock Exchange — planned rollout",
  CI: "BRVM (Abidjan) — West African regional exchange",
  SN: "BRVM — West African regional exchange",
  BJ: "BRVM — West African regional exchange",
  BF: "BRVM — West African regional exchange",
  ML: "BRVM — West African regional exchange",
  NE: "BRVM — West African regional exchange",
  TG: "BRVM — West African regional exchange",
  GW: "BRVM — West African regional exchange",
  EG: "Egyptian Exchange — later rollout",
  MA: "Casablanca Stock Exchange — later rollout",
  TN: "Tunis Stock Exchange — later rollout",
  MU: "Stock Exchange of Mauritius — later rollout",
  RW: "Rwanda Stock Exchange — later rollout",
  UG: "Uganda Securities Exchange — later rollout",
  TZ: "Dar es Salaam Stock Exchange — later rollout",
  NA: "Namibian Stock Exchange — later rollout",
  BW: "Botswana Stock Exchange — later rollout",
  ZW: "Victoria Falls / Zimbabwe exchanges — later rollout",
};

export function countryByIso2(iso2: string) {
  return AFRICA_COUNTRIES.find((c) => c.iso2 === iso2);
}

export function countryByName(name: string) {
  const needle = name.trim().toLowerCase();
  return AFRICA_COUNTRIES.find((c) => c.name.toLowerCase() === needle);
}

export function marketStatusLabel(status: MarketRollout) {
  if (status === "pilot") return "Pilot";
  if (status === "coming_soon") return "Coming soon";
  if (status === "planned") return "Planned";
  return "Watching";
}

export function exchangeNote(iso2: string) {
  return EXCHANGE_NOTE[iso2] ?? "No public exchange connected yet";
}

export function taxResidenceNote(countryName: string) {
  return `Withholding, capital-gains and reporting rules follow the investor’s country of residence${
    countryName ? ` (${countryName})` : ""
  }. We collect residence so we can show the right tax obligations before you invest.`;
}

export function formatPopulation(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}m`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}
