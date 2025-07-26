"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGameStore } from "@/lib/game-store"
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, RefreshCw, FileSpreadsheet } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PortfolioStock {
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  totalValue: number
  gainLoss: number
  gainLossPercent: number
}

export function Portfolio() {
  const { user } = useGameStore()
  const [portfolioStocks, setPortfolioStocks] = useState<PortfolioStock[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchPortfolioData = async () => {
    if (!user?.portfolio.length) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/stock-data")
      const data = await response.json()

      if (data.stocks) {
        const updatedPortfolio = user.portfolio.map((holding) => {
          const currentStock = data.stocks.find((s: any) => s.symbol === holding.symbol)
          const currentPrice = currentStock?.price || holding.avgPrice
          const totalValue = currentPrice * holding.quantity
          const gainLoss = totalValue - holding.avgPrice * holding.quantity
          const gainLossPercent = ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100

          return {
            symbol: holding.symbol,
            quantity: holding.quantity,
            avgPrice: holding.avgPrice,
            currentPrice,
            totalValue,
            gainLoss,
            gainLossPercent,
          }
        })

        setPortfolioStocks(updatedPortfolio)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error("Error fetching portfolio data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportToSheets = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/export-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          portfolio: user?.portfolio || [],
          portfolioStocks: portfolioStocks,
          balance: user?.balance || 0,
          totalPortfolioValue,
          totalGainLoss,
          totalGainLossPercent,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to export portfolio")
      }

      const data = await response.json()

      if (data.sheetUrl) {
        window.open(data.sheetUrl, "_blank")
        toast({
          title: "Success!",
          description: "Portfolio exported to Google Sheets!",
        })
      } else {
        // Fallback: download as CSV
        const csvContent = data.csvContent
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `portfolio-summary-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast({
          title: "Success!",
          description: "Portfolio exported as CSV!",
        })
      }
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Error",
        description: "Failed to export portfolio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  useEffect(() => {
    fetchPortfolioData()

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchPortfolioData, 60000)
    return () => clearInterval(interval)
  }, [user?.portfolio])

  const totalPortfolioValue = portfolioStocks.reduce((sum, stock) => sum + stock.totalValue, 0)
  const totalGainLoss = portfolioStocks.reduce((sum, stock) => sum + stock.gainLoss, 0)
  const totalGainLossPercent =
    totalPortfolioValue > 0 ? (totalGainLoss / (totalPortfolioValue - totalGainLoss)) * 100 : 0

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Please log in to view your portfolio.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Cash Balance</p>
                <p className="text-2xl font-bold tabular-nums">${(user.balance || 0).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Portfolio Value</p>
                <p className="text-2xl font-bold tabular-nums">${totalPortfolioValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              {totalGainLoss >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className="text-sm text-gray-600">Total P&L</p>
                <p
                  className={`text-2xl font-bold tabular-nums ${
                    totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalGainLoss >= 0 ? "+" : ""}${totalGainLoss.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Return</p>
                <p
                  className={`text-2xl font-bold tabular-nums ${
                    totalGainLossPercent >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalGainLossPercent >= 0 ? "+" : ""}
                  {totalGainLossPercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Your Holdings</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportToSheets}
                disabled={isExporting || portfolioStocks.length === 0}
                className="flex items-center space-x-2 bg-transparent"
              >
                {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                <span className="hidden sm:inline">{isExporting ? "Exporting..." : "Export to Sheets"}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={fetchPortfolioData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Badge variant="secondary" className="text-xs">
                Updated: {lastUpdate.toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {portfolioStocks.length === 0 ? (
            <div className="text-center py-8">
              <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Holdings Yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Start trading to build your portfolio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolioStocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stock.quantity} shares @ ${stock.avgPrice.toFixed(2)} avg
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-bold text-lg tabular-nums">${stock.totalValue.toFixed(2)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 tabular-nums">
                      ${stock.currentPrice.toFixed(2)} current
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <div
                      className={`font-semibold tabular-nums ${
                        stock.gainLoss >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stock.gainLoss >= 0 ? "+" : ""}${stock.gainLoss.toFixed(2)}
                    </div>
                    <div
                      className={`text-sm tabular-nums ${
                        stock.gainLossPercent >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stock.gainLossPercent >= 0 ? "+" : ""}
                      {stock.gainLossPercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      {portfolioStocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Best Performer</p>
                {portfolioStocks.length > 0 && (
                  <>
                    <p className="font-semibold">
                      {
                        portfolioStocks.reduce((best, stock) =>
                          stock.gainLossPercent > best.gainLossPercent ? stock : best,
                        ).symbol
                      }
                    </p>
                    <p className="text-sm text-green-600">
                      +
                      {portfolioStocks
                        .reduce((best, stock) => (stock.gainLossPercent > best.gainLossPercent ? stock : best))
                        .gainLossPercent.toFixed(2)}
                      %
                    </p>
                  </>
                )}
              </div>

              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Worst Performer</p>
                {portfolioStocks.length > 0 && (
                  <>
                    <p className="font-semibold">
                      {
                        portfolioStocks.reduce((worst, stock) =>
                          stock.gainLossPercent < worst.gainLossPercent ? stock : worst,
                        ).symbol
                      }
                    </p>
                    <p className="text-sm text-red-600">
                      {portfolioStocks
                        .reduce((worst, stock) => (stock.gainLossPercent < worst.gainLossPercent ? stock : worst))
                        .gainLossPercent.toFixed(2)}
                      %
                    </p>
                  </>
                )}
              </div>

              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Diversification</p>
                <p className="font-semibold">{portfolioStocks.length} stocks</p>
                <p className="text-sm text-gray-600">
                  Avg: ${(totalPortfolioValue / portfolioStocks.length).toFixed(0)} per stock
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
