"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Info, ShoppingCart } from "lucide-react"
import { useGameStore } from "@/lib/game-store"
import { toast } from "@/hooks/use-toast"

export default function TradingInterface() {
  const { stocks, user, buyStock, sellStock } = useGameStore()
  const [selectedStock, setSelectedStock] = useState<string>("")
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy")
  const [shares, setShares] = useState<string>("")
  const [filterSector, setFilterSector] = useState<string>("all")

  const filteredStocks = filterSector === "all" ? stocks : stocks.filter((stock) => stock.sector === filterSector)

  const sectors = Array.from(new Set(stocks.map((stock) => stock.sector)))

  const handleTrade = () => {
    if (!selectedStock || !shares || !user) return

    const stock = stocks.find((s) => s.symbol === selectedStock)
    if (!stock) return

    const shareCount = Number.parseInt(shares)
    if (shareCount <= 0) return

    if (tradeType === "buy") {
      const totalCost = shareCount * stock.price
      if (totalCost > user.balance) {
        toast({
          title: "Insufficient Funds",
          description: "You don't have enough money for this trade.",
          variant: "destructive",
        })
        return
      }
      buyStock(selectedStock, shareCount, stock.price)
      toast({
        title: "Trade Successful! 🎉",
        description: `Bought ${shareCount} shares of ${stock.name}`,
      })
    } else {
      const holding = user.holdings.find((h) => h.symbol === selectedStock)
      if (!holding || holding.shares < shareCount) {
        toast({
          title: "Insufficient Shares",
          description: "You don't own enough shares to sell.",
          variant: "destructive",
        })
        return
      }
      sellStock(selectedStock, shareCount, stock.price)
      toast({
        title: "Trade Successful! 💰",
        description: `Sold ${shareCount} shares of ${stock.name}`,
      })
    }

    setShares("")
    setSelectedStock("")
  }

  const getMaxShares = () => {
    if (!selectedStock || !user) return 0

    if (tradeType === "buy") {
      const stock = stocks.find((s) => s.symbol === selectedStock)
      return stock ? Math.floor(user.balance / stock.price) : 0
    } else {
      const holding = user.holdings.find((h) => h.symbol === selectedStock)
      return holding ? holding.shares : 0
    }
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Market Overview</span>
          </CardTitle>
          <CardDescription>Real-time stock prices • Educational simulation only</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Label htmlFor="sector-filter">Filter by Sector:</Label>
            <Select value={filterSector} onValueChange={setFilterSector}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks.map((stock) => (
              <Card key={stock.symbol} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{stock.logo}</span>
                      <div>
                        <h3 className="font-semibold">{stock.symbol}</h3>
                        <p className="text-sm text-gray-500">{stock.name}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{stock.sector}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${stock.price}</span>
                      <div
                        className={`flex items-center space-x-1 ${
                          stock.change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="text-sm font-medium">
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change} ({stock.changePercent}%)
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600">{stock.description}</p>

                    <div className="flex space-x-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedStock(stock.symbol)}>
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Trade
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Trade {stock.name}</DialogTitle>
                            <DialogDescription>
                              Current Price: ${stock.price} • Available Balance: ${user?.balance.toLocaleString()}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div>
                              <Label>Trade Type</Label>
                              <Select value={tradeType} onValueChange={(value: "buy" | "sell") => setTradeType(value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="buy">Buy</SelectItem>
                                  <SelectItem value="sell">Sell</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="shares">Number of Shares</Label>
                              <div className="flex space-x-2">
                                <Input
                                  id="shares"
                                  type="number"
                                  value={shares}
                                  onChange={(e) => setShares(e.target.value)}
                                  placeholder="0"
                                  min="1"
                                  max={getMaxShares()}
                                />
                                <Button variant="outline" onClick={() => setShares(getMaxShares().toString())}>
                                  Max
                                </Button>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Max: {getMaxShares()} shares</p>
                            </div>

                            {shares && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span>Total {tradeType === "buy" ? "Cost" : "Revenue"}:</span>
                                  <span className="font-bold">
                                    ${(Number.parseInt(shares) * stock.price).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )}

                            <Button
                              onClick={handleTrade}
                              className="w-full"
                              disabled={
                                !shares || Number.parseInt(shares) <= 0 || Number.parseInt(shares) > getMaxShares()
                              }
                            >
                              {tradeType === "buy" ? "Buy" : "Sell"} {shares} Shares
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Info className="w-4 h-4 mr-1" />
                            Info
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <span className="text-2xl">{stock.logo}</span>
                              <span>{stock.name}</span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Company Overview</h4>
                              <p className="text-sm text-gray-600">{stock.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Current Price</p>
                                <p className="font-bold">${stock.price}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Sector</p>
                                <p className="font-bold">{stock.sector}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Daily Change</p>
                                <p className={`font-bold ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  {stock.change >= 0 ? "+" : ""}
                                  {stock.change} ({stock.changePercent}%)
                                </p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
