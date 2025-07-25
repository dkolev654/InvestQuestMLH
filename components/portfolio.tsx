"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { TrendingUp, TrendingDown, PieChartIcon, BarChart3 } from "lucide-react"
import { useGameStore } from "@/lib/game-store"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function Portfolio() {
  const { user, stocks } = useGameStore()

  if (!user) return null

  const portfolioData = user.holdings.map((holding, index) => {
    const stock = stocks.find((s) => s.symbol === holding.symbol)
    const value = holding.shares * holding.currentPrice
    const pnl = (holding.currentPrice - holding.avgPrice) * holding.shares

    return {
      symbol: holding.symbol,
      name: stock?.name || holding.symbol,
      shares: holding.shares,
      avgPrice: holding.avgPrice,
      currentPrice: holding.currentPrice,
      value,
      pnl,
      pnlPercent: ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100,
      color: COLORS[index % COLORS.length],
      sector: stock?.sector || "Unknown",
    }
  })

  const sectorData = portfolioData.reduce(
    (acc, holding) => {
      const existing = acc.find((item) => item.sector === holding.sector)
      if (existing) {
        existing.value += holding.value
      } else {
        acc.push({
          sector: holding.sector,
          value: holding.value,
          color: COLORS[acc.length % COLORS.length],
        })
      }
      return acc
    },
    [] as Array<{ sector: string; value: number; color: string }>,
  )

  const totalValue = user.balance + user.portfolioValue

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Portfolio Value</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${user.totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                {user.totalPnL >= 0 ? "+" : ""}${user.totalPnL.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total P&L</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{user.holdings.length}</div>
              <div className="text-sm text-gray-500">Holdings</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {user.holdings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <PieChartIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Holdings Yet</h3>
              <p>Start trading to build your portfolio!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Allocation Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="w-5 h-5" />
                <span>Portfolio Allocation</span>
              </CardTitle>
              <CardDescription>Distribution by holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ symbol, value }) => `${symbol}: $${value.toLocaleString()}`}
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sector Diversification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Sector Diversification</span>
              </CardTitle>
              <CardDescription>Portfolio distribution by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectorData}>
                  <XAxis dataKey="sector" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]} />
                  <Bar dataKey="value" fill="#8884d8">
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Holdings Table */}
      {user.holdings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Holdings</CardTitle>
            <CardDescription>Detailed view of your stock positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Stock</th>
                    <th className="text-right p-2">Shares</th>
                    <th className="text-right p-2">Avg Price</th>
                    <th className="text-right p-2">Current Price</th>
                    <th className="text-right p-2">Value</th>
                    <th className="text-right p-2">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.map((holding) => (
                    <tr key={holding.symbol} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{holding.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {holding.sector}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">{holding.name}</div>
                      </td>
                      <td className="text-right p-2">{holding.shares}</td>
                      <td className="text-right p-2">${holding.avgPrice.toFixed(2)}</td>
                      <td className="text-right p-2">${holding.currentPrice.toFixed(2)}</td>
                      <td className="text-right p-2 font-semibold">${holding.value.toLocaleString()}</td>
                      <td
                        className={`text-right p-2 font-semibold ${holding.pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        <div className="flex items-center justify-end space-x-1">
                          {holding.pnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span>
                            {holding.pnl >= 0 ? "+" : ""}${holding.pnl.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs">
                          ({holding.pnlPercent >= 0 ? "+" : ""}
                          {holding.pnlPercent.toFixed(1)}%)
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Diversification Tip</h4>
              <p className="text-sm">
                {sectorData.length < 3
                  ? "Consider diversifying across more sectors to reduce risk!"
                  : "Great job diversifying across multiple sectors! 🎉"}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📊 Performance</h4>
              <p className="text-sm">
                {user.totalPnL >= 0
                  ? `Your portfolio is up ${((user.totalPnL / (totalValue - user.totalPnL)) * 100).toFixed(1)}%! Keep it up! 🚀`
                  : "Don't worry about short-term losses. Stay focused on long-term growth! 💪"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
