import { NextResponse } from "next/server"

const STOCK_SYMBOLS = [
  // Large Cap
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", marketCap: "Large" },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology", marketCap: "Large" },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", marketCap: "Large" },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Discretionary", marketCap: "Large" },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Consumer Discretionary", marketCap: "Large" },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology", marketCap: "Large" },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology", marketCap: "Large" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial Services", marketCap: "Large" },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", marketCap: "Large" },
  { symbol: "V", name: "Visa Inc.", sector: "Financial Services", marketCap: "Large" },
  { symbol: "PG", name: "Procter & Gamble Co.", sector: "Consumer Staples", marketCap: "Large" },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", sector: "Healthcare", marketCap: "Large" },
  { symbol: "HD", name: "Home Depot Inc.", sector: "Consumer Discretionary", marketCap: "Large" },
  { symbol: "MA", name: "Mastercard Inc.", sector: "Financial Services", marketCap: "Large" },
  { symbol: "BAC", name: "Bank of America Corp.", sector: "Financial Services", marketCap: "Large" },

  // Mid Cap
  { symbol: "ROKU", name: "Roku Inc.", sector: "Technology", marketCap: "Mid" },
  { symbol: "SNAP", name: "Snap Inc.", sector: "Technology", marketCap: "Mid" },
  { symbol: "UBER", name: "Uber Technologies Inc.", sector: "Technology", marketCap: "Mid" },
  { symbol: "LYFT", name: "Lyft Inc.", sector: "Technology", marketCap: "Mid" },
  { symbol: "TWTR", name: "Twitter Inc.", sector: "Technology", marketCap: "Mid" },
  { symbol: "SQ", name: "Block Inc.", sector: "Financial Services", marketCap: "Mid" },
  { symbol: "SHOP", name: "Shopify Inc.", sector: "Technology", marketCap: "Mid" },
  { symbol: "ZM", name: "Zoom Video Communications", sector: "Technology", marketCap: "Mid" },
  { symbol: "DOCU", name: "DocuSign Inc.", sector: "Technology", marketCap: "Mid" },
  { symbol: "PTON", name: "Peloton Interactive Inc.", sector: "Consumer Discretionary", marketCap: "Mid" },

  // Small Cap
  { symbol: "PLTR", name: "Palantir Technologies Inc.", sector: "Technology", marketCap: "Small" },
  { symbol: "BB", name: "BlackBerry Limited", sector: "Technology", marketCap: "Small" },
  { symbol: "WISH", name: "ContextLogic Inc.", sector: "Consumer Discretionary", marketCap: "Small" },
  { symbol: "CLOV", name: "Clover Health Investments", sector: "Healthcare", marketCap: "Small" },
  { symbol: "SPCE", name: "Virgin Galactic Holdings", sector: "Industrials", marketCap: "Small" },
  { symbol: "TLRY", name: "Tilray Brands Inc.", sector: "Healthcare", marketCap: "Small" },
  { symbol: "SNDL", name: "Sundial Growers Inc.", sector: "Healthcare", marketCap: "Small" },
  { symbol: "NOK", name: "Nokia Corporation", sector: "Technology", marketCap: "Small" },
  { symbol: "SENS", name: "Senseonics Holdings Inc.", sector: "Healthcare", marketCap: "Small" },
  { symbol: "OCGN", name: "Ocugen Inc.", sector: "Healthcare", marketCap: "Small" },

  // Additional Popular Stocks
  { symbol: "DIS", name: "Walt Disney Co.", sector: "Communication Services", marketCap: "Large" },
  { symbol: "NFLX", name: "Netflix Inc.", sector: "Communication Services", marketCap: "Large" },
  { symbol: "CRM", name: "Salesforce Inc.", sector: "Technology", marketCap: "Large" },
  { symbol: "ADBE", name: "Adobe Inc.", sector: "Technology", marketCap: "Large" },
  { symbol: "PYPL", name: "PayPal Holdings Inc.", sector: "Financial Services", marketCap: "Large" },
  { symbol: "INTC", name: "Intel Corporation", sector: "Technology", marketCap: "Large" },
  { symbol: "AMD", name: "Advanced Micro Devices", sector: "Technology", marketCap: "Large" },
  { symbol: "ORCL", name: "Oracle Corporation", sector: "Technology", marketCap: "Large" },
  { symbol: "IBM", name: "International Business Machines", sector: "Technology", marketCap: "Large" },
  { symbol: "CSCO", name: "Cisco Systems Inc.", sector: "Technology", marketCap: "Large" },
]

// Base prices for simulation (realistic current market prices)
const BASE_PRICES: { [key: string]: number } = {
  AAPL: 175.5,
  MSFT: 338.2,
  GOOGL: 125.8,
  AMZN: 142.3,
  TSLA: 248.9,
  META: 298.5,
  NVDA: 485.2,
  JPM: 158.4,
  JNJ: 162.8,
  V: 245.6,
  PG: 155.3,
  UNH: 512.4,
  HD: 345.8,
  MA: 398.7,
  BAC: 38.9,
  ROKU: 58.4,
  SNAP: 11.2,
  UBER: 62.8,
  LYFT: 12.4,
  TWTR: 45.2,
  SQ: 68.9,
  SHOP: 72.3,
  ZM: 68.5,
  DOCU: 58.2,
  PTON: 4.8,
  PLTR: 18.9,
  BB: 2.85,
  WISH: 0.95,
  CLOV: 2.4,
  SPCE: 1.85,
  TLRY: 1.95,
  SNDL: 1.85,
  NOK: 4.2,
  SENS: 0.85,
  OCGN: 1.25,
  DIS: 95.8,
  NFLX: 485.2,
  CRM: 268.4,
  ADBE: 485.6,
  PYPL: 62.8,
  INTC: 24.8,
  AMD: 138.9,
  ORCL: 112.4,
  IBM: 158.2,
  CSCO: 48.9,
}

async function fetchRealStockData(symbols: string[]) {
  const API_KEY = process.env.ALPHA_VANTAGE_API_KEY

  if (!API_KEY) {
    console.log("No Alpha Vantage API key found, using simulated data")
    return null
  }

  try {
    // For demo purposes, we'll fetch a few key stocks
    const keySymbols = symbols.slice(0, 5) // Limit to avoid API rate limits
    const promises = keySymbols.map(async (symbol) => {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      const response = await fetch(url)
      const data = await response.json()

      if (data["Global Quote"]) {
        const quote = data["Global Quote"]
        return {
          symbol,
          price: Number.parseFloat(quote["05. price"]),
          change: Number.parseFloat(quote["09. change"]),
          changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
        }
      }
      return null
    })

    const results = await Promise.all(promises)
    return results.filter((result) => result !== null)
  } catch (error) {
    console.error("Error fetching real stock data:", error)
    return null
  }
}

function generateSimulatedData() {
  return STOCK_SYMBOLS.map((stock) => {
    const basePrice = BASE_PRICES[stock.symbol] || 50
    const volatility = stock.marketCap === "Large" ? 0.02 : stock.marketCap === "Mid" ? 0.04 : 0.08
    const changePercent = (Math.random() - 0.5) * 2 * volatility * 100
    const change = basePrice * (changePercent / 100)
    const currentPrice = basePrice + change

    return {
      symbol: stock.symbol,
      name: stock.name,
      price: Math.max(0.01, currentPrice),
      change: change,
      changePercent: changePercent,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: stock.marketCap,
      sector: stock.sector,
    }
  })
}

export async function GET() {
  try {
    // Try to fetch real data first
    const realData = await fetchRealStockData(STOCK_SYMBOLS.map((s) => s.symbol))

    if (realData && realData.length > 0) {
      // Merge real data with simulated data for stocks we couldn't fetch
      const realSymbols = realData.map((d) => d.symbol)
      const simulatedData = generateSimulatedData()

      const mergedData = simulatedData.map((stock) => {
        const realStock = realData.find((r) => r.symbol === stock.symbol)
        if (realStock) {
          return {
            ...stock,
            price: realStock.price,
            change: realStock.change,
            changePercent: realStock.changePercent,
          }
        }
        return stock
      })

      return NextResponse.json({
        stocks: mergedData,
        source: "mixed",
        realDataCount: realData.length,
      })
    } else {
      // Fall back to simulated data
      const simulatedData = generateSimulatedData()
      return NextResponse.json({
        stocks: simulatedData,
        source: "simulated",
      })
    }
  } catch (error) {
    console.error("Stock data API error:", error)

    // Always return simulated data as fallback
    const simulatedData = generateSimulatedData()
    return NextResponse.json({
      stocks: simulatedData,
      source: "simulated_fallback",
    })
  }
}
