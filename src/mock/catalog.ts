export const CURRENCY_SEED = [
  { code: "GHS", name: "Ghana Cedi", symbol: "GH₵", decimals: 2, active: true, displayOrder: 1 },
  { code: "USD", name: "US Dollar", symbol: "$", decimals: 2, active: true, displayOrder: 2 },
  { code: "EUR", name: "Euro", symbol: "€", decimals: 2, active: true, displayOrder: 3 },
  { code: "GBP", name: "British Pound", symbol: "£", decimals: 2, active: true, displayOrder: 4 },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", decimals: 2, active: true, displayOrder: 5 },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", decimals: 2, active: true, displayOrder: 6 },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", decimals: 2, active: true, displayOrder: 7 },
  { code: "ZAR", name: "South African Rand", symbol: "R", decimals: 2, active: true, displayOrder: 8 },
  { code: "XOF", name: "West African CFA franc", symbol: "CFA", decimals: 0, active: false, displayOrder: 9 },
];

export const MARKET_SEED = [
  {
    id: "ghana",
    name: "Ghana",
    country: "Ghana",
    countryCode: "GH",
    currency: "GHS",
    status: "prototype_pilot",
    description: "Ghana is the first pilot market. Equities, ETFs, treasuries and funds are available to explore.",
    timezone: "Africa/Accra",
    featureFlag: "ghana_equities",
    exchanges: [{ id: "gse", name: "Ghana Stock Exchange", mic: "XGHA", currency: "GHS", status: "sandbox" }],
  },
  {
    id: "nigeria",
    name: "Nigeria",
    country: "Nigeria",
    countryCode: "NG",
    currency: "NGN",
    status: "coming_soon",
    description: "Nigeria market access is architected and not live. Preview assets only.",
    timezone: "Africa/Lagos",
    featureFlag: "nigeria_market",
    exchanges: [{ id: "ngx", name: "Nigerian Exchange", mic: "XNSA", currency: "NGN", status: "coming_soon" }],
  },
  {
    id: "kenya",
    name: "Kenya",
    country: "Kenya",
    countryCode: "KE",
    currency: "KES",
    status: "coming_soon",
    description: "Kenya market access is planned. Preview only.",
    timezone: "Africa/Nairobi",
    featureFlag: "kenya_market",
    exchanges: [{ id: "nse", name: "Nairobi Securities Exchange", mic: "XNAI", currency: "KES", status: "coming_soon" }],
  },
  {
    id: "south_africa",
    name: "South Africa",
    country: "South Africa",
    countryCode: "ZA",
    currency: "ZAR",
    status: "coming_soon",
    description: "South Africa market access is planned. Preview only.",
    timezone: "Africa/Johannesburg",
    featureFlag: "south_africa_market",
    exchanges: [{ id: "jse", name: "Johannesburg Stock Exchange", mic: "XJSE", currency: "ZAR", status: "coming_soon" }],
  },
  {
    id: "brvm",
    name: "BRVM",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    currency: "XOF",
    status: "coming_soon",
    description: "West African regional market. Coming soon.",
    timezone: "Africa/Abidjan",
    featureFlag: "brvm_market",
    exchanges: [{ id: "brvm", name: "Bourse Régionale des Valeurs Mobilières", mic: "XBRV", currency: "XOF", status: "coming_soon" }],
  },
  {
    id: "global",
    name: "Global",
    country: "Global",
    countryCode: "US",
    currency: "USD",
    status: "coming_soon",
    description: "US and European stocks and ETFs for African investors. Coming soon.",
    timezone: "America/New_York",
    featureFlag: "global_markets",
    exchanges: [{ id: "global", name: "Global markets", mic: "XNAS", currency: "USD", status: "coming_soon" }],
  },
];

type AssetSeed = {
  symbol: string;
  name: string;
  issuer: string;
  marketId: string;
  exchangeId: string;
  country: string;
  currency: string;
  assetType: string;
  description: string;
  riskCategory: string;
  tradability: string;
  minimumInvestment: string;
  price: string;
  previousClose: string;
  changePercent: string;
  dividendYield?: string;
  marketCap?: string;
  week52High?: string;
  week52Low?: string;
  sector?: string;
  isin?: string;
};

export const ASSET_SEED: AssetSeed[] = [
  { symbol: "MTNGH", name: "MTN Ghana", issuer: "Scancom PLC", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "equity", description: "Sandbox listing. Telecommunications operator in Ghana. Prices are illustrative.", riskCategory: "medium", tradability: "open", minimumInvestment: "50", price: "3.42", previousClose: "3.34", changePercent: "2.31", dividendYield: "4.80", marketCap: "45200000000", week52High: "3.90", week52Low: "2.10", sector: "Telecommunications", isin: "GH0000000001" },
  { symbol: "GCB", name: "GCB Bank", issuer: "GCB Bank PLC", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "equity", description: "Sandbox listing. Universal bank in Ghana. Prices are illustrative.", riskCategory: "medium", tradability: "open", minimumInvestment: "50", price: "6.15", previousClose: "6.08", changePercent: "1.15", dividendYield: "5.10", marketCap: "16400000000", week52High: "7.20", week52Low: "4.80", sector: "Financials", isin: "GH0000000002" },
  { symbol: "FML", name: "Fan Milk", issuer: "Fan Milk PLC", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "equity", description: "Sandbox listing. Dairy and beverages. Prices are illustrative.", riskCategory: "medium", tradability: "open", minimumInvestment: "40", price: "4.80", previousClose: "4.72", changePercent: "1.69", dividendYield: "2.40", marketCap: "2100000000", week52High: "5.40", week52Low: "3.90", sector: "Consumer staples", isin: "GH0000000003" },
  { symbol: "CAL", name: "CAL Bank", issuer: "CAL Bank PLC", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "equity", description: "Sandbox listing. Ghanaian bank. Prices are illustrative.", riskCategory: "high", tradability: "open", minimumInvestment: "20", price: "0.90", previousClose: "0.88", changePercent: "2.27", dividendYield: "3.10", marketCap: "1800000000", week52High: "1.15", week52Low: "0.55", sector: "Financials", isin: "GH0000000004" },
  { symbol: "TOTAL", name: "TotalEnergies Ghana", issuer: "TotalEnergies Marketing Ghana PLC", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "equity", description: "Sandbox listing. Downstream energy. Prices are illustrative.", riskCategory: "medium", tradability: "open", minimumInvestment: "50", price: "12.40", previousClose: "12.55", changePercent: "-1.20", dividendYield: "6.20", marketCap: "5400000000", week52High: "14.10", week52Low: "9.80", sector: "Energy", isin: "GH0000000005" },
  { symbol: "EGH", name: "Ecobank Ghana", issuer: "Ecobank Ghana PLC", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "equity", description: "Sandbox listing. Pan-African banking subsidiary. Prices are illustrative.", riskCategory: "medium", tradability: "open", minimumInvestment: "50", price: "5.50", previousClose: "5.42", changePercent: "1.48", dividendYield: "4.00", marketCap: "8900000000", week52High: "6.30", week52Low: "4.10", sector: "Financials", isin: "GH0000000006" },
  { symbol: "UNIL", name: "Unilever Ghana", issuer: "Unilever Ghana PLC", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "equity", description: "Sandbox listing. Consumer goods. Prices are illustrative.", riskCategory: "low", tradability: "open", minimumInvestment: "50", price: "17.85", previousClose: "17.60", changePercent: "1.42", dividendYield: "3.70", marketCap: "3200000000", week52High: "19.40", week52Low: "14.20", sector: "Consumer staples", isin: "GH0000000007" },
  { symbol: "GOIL", name: "GOIL", issuer: "Ghana Oil Company PLC", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "equity", description: "Sandbox listing. Oil marketing. Prices are illustrative.", riskCategory: "medium", tradability: "open", minimumInvestment: "40", price: "1.68", previousClose: "1.70", changePercent: "-1.18", dividendYield: "5.50", marketCap: "2500000000", week52High: "2.05", week52Low: "1.32", sector: "Energy", isin: "GH0000000008" },
  { symbol: "SCB", name: "Standard Chartered Ghana", issuer: "Standard Chartered Bank Ghana PLC", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "equity", description: "Sandbox listing. International bank subsidiary. Prices are illustrative.", riskCategory: "low", tradability: "open", minimumInvestment: "80", price: "21.10", previousClose: "20.85", changePercent: "1.20", dividendYield: "6.80", marketCap: "7100000000", week52High: "23.40", week52Low: "16.50", sector: "Financials", isin: "GH0000000009" },
  { symbol: "BOPP", name: "Benso Oil Palm", issuer: "Benso Oil Palm Plantation PLC", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "equity", description: "Sandbox listing. Agribusiness. Prices are illustrative.", riskCategory: "high", tradability: "open", minimumInvestment: "40", price: "22.50", previousClose: "22.10", changePercent: "1.81", dividendYield: "2.90", marketCap: "780000000", week52High: "25.00", week52Low: "16.80", sector: "Materials", isin: "GH0000000010" },
  { symbol: "GHS91D", name: "91-Day Treasury Bill", issuer: "Republic of Ghana", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "treasury", description: "Sandbox treasury bill. Yields are indicative, not live auction results.", riskCategory: "low", tradability: "open", minimumInvestment: "100", price: "100.00", previousClose: "100.00", changePercent: "0.00", sector: "Government" },
  { symbol: "GHS182D", name: "182-Day Treasury Bill", issuer: "Republic of Ghana", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "treasury", description: "Sandbox 182-day treasury bill. Indicative only.", riskCategory: "low", tradability: "open", minimumInvestment: "100", price: "100.00", previousClose: "100.00", changePercent: "0.00", sector: "Government" },
  { symbol: "GHS364D", name: "364-Day Treasury Bill", issuer: "Republic of Ghana", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "treasury", description: "Sandbox 364-day treasury bill. Indicative only.", riskCategory: "low", tradability: "open", minimumInvestment: "100", price: "100.00", previousClose: "100.00", changePercent: "0.00", sector: "Government" },
  { symbol: "GHGB27", name: "Ghana Government Bond 2027", issuer: "Republic of Ghana", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "bond", description: "Sandbox government bond. Yield and price are illustrative.", riskCategory: "medium", tradability: "open", minimumInvestment: "500", price: "96.40", previousClose: "96.10", changePercent: "0.31", sector: "Government" },
  { symbol: "AFRI-EQ", name: "Africa Invest Ghana Equity Fund", issuer: "Africa Invest Funds (sandbox)", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "fund", description: "Sandbox fund vehicle used for demo allocations. Not a real collective investment scheme.", riskCategory: "medium", tradability: "open", minimumInvestment: "100", price: "10.00", previousClose: "9.92", changePercent: "0.81", sector: "Diversified" },
  { symbol: "AFRI-BAL", name: "Africa Invest Balanced Fund", issuer: "Africa Invest Funds (sandbox)", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "fund", description: "Sandbox balanced fund. Not a live product.", riskCategory: "medium", tradability: "open", minimumInvestment: "100", price: "12.40", previousClose: "12.31", changePercent: "0.73", sector: "Diversified" },
  { symbol: "GSE-ETF", name: "Ghana Market Tracker", issuer: "Sandbox ETF issuer", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "etf", description: "Sandbox ETF. Not listed for live trading.", riskCategory: "medium", tradability: "preview", minimumInvestment: "50", price: "8.20", previousClose: "8.11", changePercent: "1.11", sector: "Diversified" },
  { symbol: "SOLAR-IPO", name: "Sahel Solar IPO", issuer: "Sahel Solar Ltd (fictional)", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "ipo", description: "Fictional IPO used to demonstrate subscription flow. Not a real offering.", riskCategory: "high", tradability: "ipo", minimumInvestment: "200", price: "1.20", previousClose: "1.20", changePercent: "0.00", sector: "Energy" },
  { symbol: "DANGCEM", name: "Dangote Cement", issuer: "Dangote Cement PLC", marketId: "nigeria", exchangeId: "ngx", country: "Nigeria", currency: "NGN", assetType: "equity", description: "Preview only. Nigeria market is not live.", riskCategory: "medium", tradability: "preview", minimumInvestment: "1000", price: "480.00", previousClose: "475.00", changePercent: "1.05", sector: "Materials" },
  { symbol: "GTCO", name: "GTCO", issuer: "Guaranty Trust Holding", marketId: "nigeria", exchangeId: "ngx", country: "Nigeria", currency: "NGN", assetType: "equity", description: "Preview only. Nigeria market is not live.", riskCategory: "medium", tradability: "preview", minimumInvestment: "1000", price: "45.20", previousClose: "44.85", changePercent: "0.78", sector: "Financials" },
  { symbol: "AIRTELAFRI", name: "Airtel Africa", issuer: "Airtel Africa", marketId: "nigeria", exchangeId: "ngx", country: "Nigeria", currency: "NGN", assetType: "equity", description: "Preview only.", riskCategory: "medium", tradability: "preview", minimumInvestment: "1000", price: "1980.00", previousClose: "1965.00", changePercent: "0.76", sector: "Telecommunications" },
  { symbol: "NGN91D", name: "Nigeria T-Bill 91D", issuer: "Federal Republic of Nigeria", marketId: "nigeria", exchangeId: "ngx", country: "Nigeria", currency: "NGN", assetType: "treasury", description: "Preview only.", riskCategory: "low", tradability: "preview", minimumInvestment: "5000", price: "100.00", previousClose: "100.00", changePercent: "0.00", sector: "Government" },
  { symbol: "SAFCOM", name: "Safaricom", issuer: "Safaricom PLC", marketId: "kenya", exchangeId: "nse", country: "Kenya", currency: "KES", assetType: "equity", description: "Preview only. Kenya market is not live.", riskCategory: "medium", tradability: "preview", minimumInvestment: "500", price: "18.40", previousClose: "18.10", changePercent: "1.66", sector: "Telecommunications" },
  { symbol: "EQTY", name: "Equity Group", issuer: "Equity Group Holdings", marketId: "kenya", exchangeId: "nse", country: "Kenya", currency: "KES", assetType: "equity", description: "Preview only.", riskCategory: "medium", tradability: "preview", minimumInvestment: "500", price: "48.50", previousClose: "47.90", changePercent: "1.25", sector: "Financials" },
  { symbol: "KCB", name: "KCB Group", issuer: "KCB Group PLC", marketId: "kenya", exchangeId: "nse", country: "Kenya", currency: "KES", assetType: "equity", description: "Preview only.", riskCategory: "medium", tradability: "preview", minimumInvestment: "500", price: "39.20", previousClose: "38.85", changePercent: "0.90", sector: "Financials" },
  { symbol: "KES91D", name: "Kenya T-Bill 91D", issuer: "Republic of Kenya", marketId: "kenya", exchangeId: "nse", country: "Kenya", currency: "KES", assetType: "treasury", description: "Preview only.", riskCategory: "low", tradability: "preview", minimumInvestment: "1000", price: "100.00", previousClose: "100.00", changePercent: "0.00", sector: "Government" },
  { symbol: "NPN", name: "Naspers", issuer: "Naspers Ltd", marketId: "south_africa", exchangeId: "jse", country: "South Africa", currency: "ZAR", assetType: "equity", description: "Preview only. South Africa market is not live.", riskCategory: "medium", tradability: "preview", minimumInvestment: "200", price: "3850.00", previousClose: "3810.00", changePercent: "1.05", sector: "Consumer discretionary" },
  { symbol: "SBK", name: "Standard Bank Group", issuer: "Standard Bank Group", marketId: "south_africa", exchangeId: "jse", country: "South Africa", currency: "ZAR", assetType: "equity", description: "Preview only.", riskCategory: "medium", tradability: "preview", minimumInvestment: "200", price: "225.40", previousClose: "223.10", changePercent: "1.03", sector: "Financials" },
  { symbol: "MTNZA", name: "MTN Group", issuer: "MTN Group Ltd", marketId: "south_africa", exchangeId: "jse", country: "South Africa", currency: "ZAR", assetType: "equity", description: "Preview only.", riskCategory: "medium", tradability: "preview", minimumInvestment: "200", price: "92.80", previousClose: "91.40", changePercent: "1.53", sector: "Telecommunications" },
  { symbol: "ZAR91D", name: "South Africa T-Bill", issuer: "Republic of South Africa", marketId: "south_africa", exchangeId: "jse", country: "South Africa", currency: "ZAR", assetType: "treasury", description: "Preview only.", riskCategory: "low", tradability: "preview", minimumInvestment: "500", price: "100.00", previousClose: "100.00", changePercent: "0.00", sector: "Government" },
  { symbol: "SNTS", name: "Sonatel", issuer: "Sonatel", marketId: "brvm", exchangeId: "brvm", country: "Senegal", currency: "XOF", assetType: "equity", description: "Preview only. BRVM is not live.", riskCategory: "medium", tradability: "preview", minimumInvestment: "5000", price: "16400", previousClose: "16250", changePercent: "0.92", sector: "Telecommunications" },
  { symbol: "ETIT", name: "Ecobank Transnational", issuer: "Ecobank Transnational", marketId: "brvm", exchangeId: "brvm", country: "Togo", currency: "XOF", assetType: "equity", description: "Preview only.", riskCategory: "medium", tradability: "preview", minimumInvestment: "5000", price: "18.50", previousClose: "18.20", changePercent: "1.65", sector: "Financials" },
  { symbol: "SGBC", name: "SGBCI", issuer: "Société Générale Côte d'Ivoire", marketId: "brvm", exchangeId: "brvm", country: "Côte d'Ivoire", currency: "XOF", assetType: "equity", description: "Preview only.", riskCategory: "medium", tradability: "preview", minimumInvestment: "5000", price: "15500", previousClose: "15380", changePercent: "0.78", sector: "Financials" },
  { symbol: "BOA", name: "Bank of Africa", issuer: "Bank of Africa", marketId: "brvm", exchangeId: "brvm", country: "Mali", currency: "XOF", assetType: "equity", description: "Preview only.", riskCategory: "medium", tradability: "preview", minimumInvestment: "5000", price: "5400", previousClose: "5350", changePercent: "0.93", sector: "Financials" },
  { symbol: "ACCESS", name: "Access Holdings", issuer: "Access Holdings PLC", marketId: "nigeria", exchangeId: "ngx", country: "Nigeria", currency: "NGN", assetType: "equity", description: "Preview only.", riskCategory: "medium", tradability: "preview", minimumInvestment: "1000", price: "19.80", previousClose: "19.45", changePercent: "1.80", sector: "Financials" },
  { symbol: "ZENITH", name: "Zenith Bank", issuer: "Zenith Bank PLC", marketId: "nigeria", exchangeId: "ngx", country: "Nigeria", currency: "NGN", assetType: "equity", description: "Preview only.", riskCategory: "medium", tradability: "preview", minimumInvestment: "1000", price: "38.50", previousClose: "37.90", changePercent: "1.58", sector: "Financials" },
  { symbol: "COOP", name: "Co-operative Bank", issuer: "Co-operative Bank of Kenya", marketId: "kenya", exchangeId: "nse", country: "Kenya", currency: "KES", assetType: "equity", description: "Preview only.", riskCategory: "medium", tradability: "preview", minimumInvestment: "500", price: "14.20", previousClose: "14.05", changePercent: "1.07", sector: "Financials" },
  { symbol: "FSR", name: "FirstRand", issuer: "FirstRand Ltd", marketId: "south_africa", exchangeId: "jse", country: "South Africa", currency: "ZAR", assetType: "equity", description: "Preview only.", riskCategory: "medium", tradability: "preview", minimumInvestment: "200", price: "76.40", previousClose: "75.80", changePercent: "0.79", sector: "Financials" },
  { symbol: "GHFUND2", name: "West Africa Income Fund", issuer: "Sandbox fund issuer", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "fund", description: "Sandbox income fund. Not a live product.", riskCategory: "low", tradability: "open", minimumInvestment: "100", price: "5.40", previousClose: "5.38", changePercent: "0.37", sector: "Fixed income" },
  { symbol: "CPC", name: "Cocoa Processing", issuer: "Cocoa Processing Company", marketId: "ghana", exchangeId: "gse", country: "Ghana", currency: "GHS", assetType: "equity", description: "Agribusiness processor. Prices are illustrative.", riskCategory: "high", tradability: "open", minimumInvestment: "20", price: "0.05", previousClose: "0.05", changePercent: "0.00", sector: "Materials" },
  { symbol: "AAPL", name: "Apple", issuer: "Apple Inc.", marketId: "global", exchangeId: "global", country: "United States", currency: "USD", assetType: "equity", description: "Global stock for African investors. Not available to buy yet.", riskCategory: "medium", tradability: "preview", minimumInvestment: "10", price: "228.40", previousClose: "226.10", changePercent: "1.02", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft", issuer: "Microsoft Corp.", marketId: "global", exchangeId: "global", country: "United States", currency: "USD", assetType: "equity", description: "Global stock for African investors. Not available to buy yet.", riskCategory: "medium", tradability: "preview", minimumInvestment: "10", price: "418.60", previousClose: "415.20", changePercent: "0.82", sector: "Technology" },
  { symbol: "VUAA", name: "S&P 500 ETF", issuer: "Vanguard", marketId: "global", exchangeId: "global", country: "United States", currency: "USD", assetType: "etf", description: "Global ETF for African investors. Not available to buy yet.", riskCategory: "medium", tradability: "preview", minimumInvestment: "20", price: "112.80", previousClose: "111.90", changePercent: "0.80", sector: "Diversified" },
];

export const ARTICLES = [
  { slug: "getting-started", title: "How Africa Invest works", category: "Getting Started", readMinutes: 4, body: "Create an account, complete KYC, add money, then buy stocks and ETFs. Ghana is the first market. This product is under development and is not a live brokerage." },
  { slug: "african-markets", title: "A tour of African exchanges", category: "African Markets", readMinutes: 6, body: "Ghana, Nigeria, Kenya, South Africa and the BRVM each have different currencies, calendars and regulators. We pilot Ghana first, then expand." },
  { slug: "stocks-basics", title: "What is an equity?", category: "Stocks", readMinutes: 5, body: "A share is a slice of a company. Prices move. Dividends are not guaranteed. This is education, not advice." },
  { slug: "bonds-basics", title: "Government securities in plain language", category: "Bonds", readMinutes: 5, body: "Treasury bills and bonds are how governments borrow. Yields here are indicative, not live auction results." },
  { slug: "funds-basics", title: "Funds and diversification", category: "Funds", readMinutes: 4, body: "A fund pools money across holdings. It does not remove risk." },
  { slug: "risk", title: "Risk is not a slogan", category: "Risk", readMinutes: 5, body: "You can lose capital. Currency moves can amplify gains and losses when you invest across borders." },
  { slug: "diversification", title: "Concentration in one market", category: "Diversification", readMinutes: 4, body: "A Ghana-heavy portfolio is a choice, not a default. Insights in the app are educational, not personal recommendations." },
  { slug: "kyc-and-tax", title: "KYC and tax residence", category: "Getting Started", readMinutes: 5, body: "Every investor completes identity verification. Tax liabilities follow your country of residence. We collect residence so we can show the rules that apply to you before you buy." },
  { slug: "global-stocks", title: "Global stocks for African investors", category: "Global Markets", readMinutes: 4, body: "After African exchanges, we will offer US and European stocks and ETFs from the same account. That offering is not live yet." },
  { slug: "long-term", title: "Long-term investing", category: "Long-term Investing", readMinutes: 6, body: "Recurring investments exist to make contributions regular. Returns are not guaranteed." },
];
