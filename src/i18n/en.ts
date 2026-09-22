export const messages = {
  brand: "Africa Invest",
  tagline: "Invest today. A brighter Africa tomorrow.",
  subhead:
    "Buy stocks and ETFs on African exchanges, and later global stocks. We are piloting in Ghana first. KYC is required for every investor.",
  nav: {
    home: "Home",
    markets: "Markets",
    portfolio: "Portfolio",
    activity: "Activity",
    profile: "Profile",
  },
  cta: {
    explore: "Explore African stocks",
    waitlist: "Get early access",
    invest: "Invest",
    addMoney: "Add Money",
    convert: "Convert",
    autoInvest: "Auto Invest",
  },
  empty: {
    investments: "No investments yet.",
    investmentsHint: "Start with a Ghana stock or ETF.",
    watchlist: "No watchlist items.",
    watchlistHint: "Keep an eye on companies and markets you're interested in.",
  },
  risk: "Investment values can rise or fall. You may lose capital. This product is under development and uses illustrative prices.",
  advice: "Educational information only. This is not personalised investment advice.",
  sandbox: "Illustrative market data",
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
