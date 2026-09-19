export const messages = {
  brand: "Africa Invest",
  tagline: "Invest in Africa from anywhere.",
  subhead: "One investment account designed to connect Africans and the global African diaspora with African capital markets.",
  nav: {
    home: "Home",
    markets: "Markets",
    portfolio: "Portfolio",
    activity: "Activity",
    profile: "Profile",
  },
  cta: {
    explore: "Explore the Product",
    waitlist: "Join the Waitlist",
    invest: "Invest",
    addMoney: "Add Money",
    convert: "Convert",
    autoInvest: "Auto Invest",
  },
  empty: {
    investments: "No investments yet.",
    investmentsHint: "Start building your African portfolio.",
    watchlist: "No watchlist items.",
    watchlistHint: "Keep an eye on companies and markets you're interested in.",
  },
  risk: "Investment values can rise or fall. You may lose capital. This product is under development and uses sandbox data.",
  advice: "Educational information only. This is not personalised investment advice.",
  sandbox: "Sandbox market data",
} as const;

export function t(path: string) {
  const parts = path.split(".");
  let cur: unknown = messages;
  for (const part of parts) {
    if (typeof cur !== "object" || cur === null) return path;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "string" ? cur : path;
}
