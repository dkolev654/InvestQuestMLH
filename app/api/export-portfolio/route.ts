import { type NextRequest, NextResponse } from "next/server"

interface PortfolioData {
  user: any
  portfolio: any[]
  portfolioStocks: any[]
  balance: number
  totalPortfolioValue: number
  totalGainLoss: number
  totalGainLossPercent: number
}

// Simulated Gemini AI analysis function
function generateAIAnalysis(data: PortfolioData) {
  const { portfolioStocks, totalGainLoss, totalGainLossPercent, totalPortfolioValue, balance } = data

  // Calculate diversification score
  const diversificationScore = Math.min(portfolioStocks.length * 20, 100)

  // Calculate risk level based on volatility and concentration
  const maxPosition = Math.max(...portfolioStocks.map((s) => s.totalValue))
  const concentration = (maxPosition / totalPortfolioValue) * 100
  const riskLevel = concentration > 50 ? "High" : concentration > 30 ? "Medium" : "Low"

  // Sector analysis (simplified)
  const sectors = portfolioStocks.map((stock) => {
    // Simple sector mapping based on common stock symbols
    const techStocks = ["AAPL", "GOOGL", "MSFT", "AMZN", "META", "TSLA", "NVDA"]
    const financeStocks = ["JPM", "BAC", "WFC", "GS", "MS"]
    const healthStocks = ["JNJ", "PFE", "UNH", "ABBV", "MRK"]

    if (techStocks.includes(stock.symbol)) return "Technology"
    if (financeStocks.includes(stock.symbol)) return "Finance"
    if (healthStocks.includes(stock.symbol)) return "Healthcare"
    return "Other"
  })

  const sectorBreakdown = sectors.reduce(
    (acc, sector) => {
      acc[sector] = (acc[sector] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Generate recommendations
  const recommendations = []

  if (diversificationScore < 60) {
    recommendations.push("Consider diversifying across more stocks to reduce risk")
  }

  if (concentration > 40) {
    recommendations.push("Your portfolio is heavily concentrated in one position - consider rebalancing")
  }

  if (totalGainLossPercent < -10) {
    recommendations.push("Review underperforming positions and consider stop-loss strategies")
  }

  if (balance / (totalPortfolioValue + balance) > 0.3) {
    recommendations.push("You have significant cash reserves - consider investing more for growth")
  }

  const bestPerformer = portfolioStocks.reduce((best, stock) =>
    stock.gainLossPercent > best.gainLossPercent ? stock : best,
  )

  const worstPerformer = portfolioStocks.reduce((worst, stock) =>
    stock.gainLossPercent < worst.gainLossPercent ? stock : worst,
  )

  return {
    diversificationScore,
    riskLevel,
    sectorBreakdown,
    recommendations,
    bestPerformer: bestPerformer.symbol,
    worstPerformer: worstPerformer.symbol,
    overallSentiment: totalGainLossPercent > 5 ? "Positive" : totalGainLossPercent < -5 ? "Negative" : "Neutral",
  }
}

function generateCSVContent(data: PortfolioData, analysis: any): string {
  const { user, portfolioStocks, balance, totalPortfolioValue, totalGainLoss, totalGainLossPercent } = data

  let csv = "InvestQuest Portfolio Summary\n"
  csv += `Generated on: ${new Date().toLocaleString()}\n`
  csv += `Investor: ${user?.name || "Unknown"}\n`
  csv += `Level: ${user?.level || 1}\n\n`

  // Portfolio Overview
  csv += "PORTFOLIO OVERVIEW\n"
  csv += "Metric,Value\n"
  csv += `Cash Balance,$${balance.toFixed(2)}\n`
  csv += `Portfolio Value,$${totalPortfolioValue.toFixed(2)}\n`
  csv += `Total P&L,$${totalGainLoss.toFixed(2)}\n`
  csv += `Total Return,${totalGainLossPercent.toFixed(2)}%\n`
  csv += `Total Account Value,$${(balance + totalPortfolioValue).toFixed(2)}\n\n`

  // AI Analysis
  csv += "AI ANALYSIS (Powered by Gemini)\n"
  csv += "Analysis Type,Result\n"
  csv += `Risk Level,${analysis.riskLevel}\n`
  csv += `Diversification Score,${analysis.diversificationScore}/100\n`
  csv += `Overall Sentiment,${analysis.overallSentiment}\n`
  csv += `Best Performer,${analysis.bestPerformer}\n`
  csv += `Worst Performer,${analysis.worstPerformer}\n\n`

  // Sector Breakdown
  csv += "SECTOR BREAKDOWN\n"
  csv += "Sector,Number of Holdings\n"
  Object.entries(analysis.sectorBreakdown).forEach(([sector, count]) => {
    csv += `${sector},${count}\n`
  })
  csv += "\n"

  // Holdings Details
  csv += "HOLDINGS DETAILS\n"
  csv += "Symbol,Quantity,Avg Price,Current Price,Total Value,Gain/Loss,Gain/Loss %\n"
  portfolioStocks.forEach((stock) => {
    csv += `${stock.symbol},${stock.quantity},$${stock.avgPrice.toFixed(2)},$${stock.currentPrice.toFixed(2)},$${stock.totalValue.toFixed(2)},$${stock.gainLoss.toFixed(2)},${stock.gainLossPercent.toFixed(2)}%\n`
  })
  csv += "\n"

  // AI Recommendations
  csv += "AI RECOMMENDATIONS\n"
  csv += "Recommendation\n"
  analysis.recommendations.forEach((rec: string) => {
    csv += `"${rec}"\n`
  })

  // Performance Metrics
  csv += "\nPERFORMANCE METRICS\n"
  csv += "Metric,Value\n"
  csv += `Number of Holdings,${portfolioStocks.length}\n`
  csv += `Average Position Size,$${(totalPortfolioValue / portfolioStocks.length).toFixed(2)}\n`
  csv += `Largest Position,$${Math.max(...portfolioStocks.map((s) => s.totalValue)).toFixed(2)}\n`
  csv += `Smallest Position,$${Math.min(...portfolioStocks.map((s) => s.totalValue)).toFixed(2)}\n`

  const winningPositions = portfolioStocks.filter((s) => s.gainLoss > 0).length
  const losingPositions = portfolioStocks.filter((s) => s.gainLoss < 0).length
  csv += `Winning Positions,${winningPositions}\n`
  csv += `Losing Positions,${losingPositions}\n`
  csv += `Win Rate,${((winningPositions / portfolioStocks.length) * 100).toFixed(1)}%\n`

  return csv
}

export async function POST(request: NextRequest) {
  try {
    const data: PortfolioData = await request.json()

    if (!data.portfolioStocks || data.portfolioStocks.length === 0) {
      return NextResponse.json({ error: "No portfolio data to export" }, { status: 400 })
    }

    // Generate AI analysis
    const analysis = generateAIAnalysis(data)

    // Generate CSV content
    const csvContent = generateCSVContent(data, analysis)

    // In a real implementation, you would integrate with Google Sheets API here
    // For now, we'll return the CSV content for download

    return NextResponse.json({
      success: true,
      csvContent,
      analysis,
      // sheetUrl would be returned here if Google Sheets integration was implemented
      // sheetUrl: "https://docs.google.com/spreadsheets/d/your-sheet-id"
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export portfolio" }, { status: 500 })
  }
}
