"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGameStore } from "@/lib/game-store"
import { toast } from "sonner"
import { TrendingUp, TrendingDown, Search, Filter, RefreshCw } from "lucide-react"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: string
  sector: string
}

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

export function TradingInterface() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [marketCapFilter, setMarketCapFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const { user, buyStock, sellStock, addXP } = useGameStore()

  // Fetch stock data
  const fetchStockData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stock-data")
      const data = await response.json()

      if (data.stocks) {
        setStocks(data.stocks)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error("Error fetching stock data:", error)
      toast.error("Failed to fetch stock data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStockData()

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchStockData, 60000)
    return () => clearInterval(interval)
  }, [])

  // Filter stocks
  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = sectorFilter === "all" || stock.sector === sectorFilter
    const matchesMarketCap = marketCapFilter === "all" || stock.marketCap === marketCapFilter

    return matchesSearch && matchesSector && matchesMarketCap
  })

  const handleBuy = () => {
    if (!selectedStock || !user) return

    const totalCost = selectedStock.price * quantity
    if (totalCost > user.balance) {
      toast.error("Insufficient funds!")
      return
    }

    buyStock(selectedStock.symbol, quantity, selectedStock.price)
    addXP(10 * quantity) // 10 XP per share bought
    toast.success(`Bought ${quantity} shares of ${selectedStock.symbol}`)
    setQuantity(1)
  }

  const handleSell = () => {
    if (!selectedStock || !user) return

    const holding = user.portfolio.find((p) => p.symbol === selectedStock.symbol)
    if (!holding || holding.quantity < quantity) {
      toast.error("Insufficient shares!")
      return
    }

    sellStock(selectedStock.symbol, quantity, selectedStock.price)
    addXP(15 * quantity) // 15 XP per share sold
    toast.success(`Sold ${quantity} shares of ${selectedStock.symbol}`)
    setQuantity(1)
  }

  const sectors = [...new Set(STOCK_SYMBOLS.map((s) => s.sector))]
  const marketCaps = ["Small", "Mid", "Large"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Live Stock Trading</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={fetchStockData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Badge variant="secondary" className="text-xs">
                Updated: {lastUpdate.toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search stocks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sectors" />
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

                <Select value={marketCapFilter} onValueChange={setMarketCapFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Market Caps" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Market Caps</SelectItem>
                    {marketCaps.map((cap) => (
                      <SelectItem key={cap} value={cap}>
                        {cap} Cap
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{filteredStocks.length} stocks</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock List */}
          <Card>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Loading stock data...</p>
                  </div>
                ) : filteredStocks.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-600">No stocks found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredStocks.map((stock) => (
                      <div
                        key={stock.symbol}
                        className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          selectedStock?.symbol === stock.symbol ? "bg-blue-50 dark:bg-blue-900/20" : ""
                        }`}
                        onClick={() => setSelectedStock(stock)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{stock.name}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {stock.sector}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {stock.marketCap}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-lg tabular-nums">${(stock.price || 0).toFixed(2)}</div>
                            <div
                              className={`flex items-center space-x-1 text-sm ${
                                (stock.change || 0) >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {(stock.change || 0) >= 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              <span className="tabular-nums">
                                {(stock.change || 0) >= 0 ? "+" : ""}
                                {(stock.change || 0).toFixed(2)} ({(stock.changePercent || 0).toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trading Panel */}
        <div className="space-y-4">
          {selectedStock ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trade {selectedStock.symbol}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold tabular-nums">${(selectedStock.price || 0).toFixed(2)}</div>
                  <div className={`text-sm ${(selectedStock.change || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {(selectedStock.change || 0) >= 0 ? "+" : ""}
                    {(selectedStock.change || 0).toFixed(2)} ({(selectedStock.changePercent || 0).toFixed(2)}%)
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="tabular-nums"
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="font-semibold tabular-nums">
                      ${((selectedStock.price || 0) * quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Balance:</span>
                    <span className="font-semibold tabular-nums">${(user?.balance || 0).toFixed(2)}</span>
                  </div>
                  {user?.portfolio.find((p) => p.symbol === selectedStock.symbol) && (
                    <div className="flex justify-between">
                      <span>Owned Shares:</span>
                      <span className="font-semibold tabular-nums">
                        {user.portfolio.find((p) => p.symbol === selectedStock.symbol)?.quantity || 0}
                      </span>
                    </div>
                  )}
                </div>

                <Tabs defaultValue="buy" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy">Buy</TabsTrigger>
                    <TabsTrigger value="sell">Sell</TabsTrigger>
                  </TabsList>

                  <TabsContent value="buy" className="space-y-4">
                    <Button
                      onClick={handleBuy}
                      className="w-full"
                      disabled={!user || (selectedStock.price || 0) * quantity > (user?.balance || 0)}
                    >
                      Buy {quantity} Share{quantity !== 1 ? "s" : ""}
                    </Button>
                  </TabsContent>

                  <TabsContent value="sell" className="space-y-4">
                    <Button
                      onClick={handleSell}
                      variant="destructive"
                      className="w-full"
                      disabled={
                        !user ||
                        !user.portfolio.find((p) => p.symbol === selectedStock.symbol) ||
                        (user.portfolio.find((p) => p.symbol === selectedStock.symbol)?.quantity || 0) < quantity
                      }
                    >
                      Sell {quantity} Share{quantity !== 1 ? "s" : ""}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Select a Stock</h3>
                <p className="text-gray-600 dark:text-gray-400">Choose a stock from the list to start trading</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Market Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total Stocks:</span>
                <span className="font-semibold">{stocks.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Gainers:</span>
                <span className="font-semibold text-green-600">{stocks.filter((s) => (s.change || 0) > 0).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Losers:</span>
                <span className="font-semibold text-red-600">{stocks.filter((s) => (s.change || 0) < 0).length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
