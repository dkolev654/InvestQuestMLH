import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  sector: string
  description: string
  logo: string
}

export interface Holding {
  symbol: string
  shares: number
  avgPrice: number
  currentPrice: number
}

export interface Quest {
  id: string
  title: string
  description: string
  xpReward: number
  completed: boolean
  type: "trade" | "learn" | "portfolio"
  requirement?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: Date
}

export interface User {
  balance: number
  portfolioValue: number
  totalPnL: number
  xp: number
  level: number
  holdings: Holding[]
  completedQuests: string[]
  badges: Badge[]
  tradesCount: number
}

interface GameState {
  user: User | null
  stocks: Stock[]
  quests: Quest[]
  badges: Badge[]
  initializeUser: () => void
  buyStock: (symbol: string, shares: number, price: number) => void
  sellStock: (symbol: string, shares: number, price: number) => void
  completeQuest: (questId: string) => void
  earnBadge: (badgeId: string) => void
  addXP: (amount: number) => void
  updateStockPrices: () => void
}

const initialStocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 175.5,
    change: 2.3,
    changePercent: 1.33,
    sector: "Technology",
    description: "Apple designs and manufactures consumer electronics, software, and services.",
    logo: "🍎",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 242.8,
    change: -5.2,
    changePercent: -2.1,
    sector: "Automotive",
    description: "Tesla designs, develops, manufactures, and sells electric vehicles and energy storage systems.",
    logo: "⚡",
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: 445.2,
    change: 8.9,
    changePercent: 2.04,
    sector: "Entertainment",
    description: "Netflix is a streaming entertainment service with over 200 million subscribers worldwide.",
    logo: "🎬",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 138.4,
    change: 1.8,
    changePercent: 1.32,
    sector: "Technology",
    description: "Alphabet is the parent company of Google and other subsidiaries.",
    logo: "🔍",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 145.3,
    change: -2.1,
    changePercent: -1.42,
    sector: "E-commerce",
    description: "Amazon is a multinational technology company focusing on e-commerce and cloud computing.",
    logo: "📦",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 378.9,
    change: 4.5,
    changePercent: 1.2,
    sector: "Technology",
    description: "Microsoft develops, manufactures, licenses, supports, and sells computer software and services.",
    logo: "💻",
  },
]

const initialQuests: Quest[] = [
  {
    id: "first-trade",
    title: "First Trade",
    description: "Make your first stock purchase to get started!",
    xpReward: 100,
    completed: false,
    type: "trade",
  },
  {
    id: "diversify",
    title: "Diversify Portfolio",
    description: "Own stocks from at least 3 different sectors",
    xpReward: 200,
    completed: false,
    type: "portfolio",
  },
  {
    id: "profit-maker",
    title: "Profit Maker",
    description: "Achieve $500 in total profits",
    xpReward: 300,
    completed: false,
    type: "portfolio",
  },
  {
    id: "active-trader",
    title: "Active Trader",
    description: "Complete 10 trades",
    xpReward: 250,
    completed: false,
    type: "trade",
  },
]

const initialBadges: Badge[] = [
  {
    id: "first-trade-badge",
    name: "First Trade",
    description: "Completed your first stock trade",
    icon: "🛒",
    earned: false,
  },
  {
    id: "diversified-badge",
    name: "Diversified Investor",
    description: "Built a diversified portfolio",
    icon: "🌍",
    earned: false,
  },
  {
    id: "profit-badge",
    name: "Profit Master",
    description: "Achieved significant profits",
    icon: "💸",
    earned: false,
  },
  {
    id: "level-up-badge",
    name: "Level Up",
    description: "Reached Level 2",
    icon: "⭐",
    earned: false,
  },
]

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: null,
      stocks: initialStocks,
      quests: initialQuests,
      badges: initialBadges,

      initializeUser: () => {
        const existingUser = get().user
        if (!existingUser) {
          set({
            user: {
              balance: 10000,
              portfolioValue: 0,
              totalPnL: 0,
              xp: 0,
              level: 1,
              holdings: [],
              completedQuests: [],
              badges: [],
              tradesCount: 0,
            },
          })
        }
      },

      buyStock: (symbol: string, shares: number, price: number) => {
        const state = get()
        if (!state.user) return

        const totalCost = shares * price
        if (totalCost > state.user.balance) return

        const existingHolding = state.user.holdings.find((h) => h.symbol === symbol)
        let newHoldings: Holding[]

        if (existingHolding) {
          const totalShares = existingHolding.shares + shares
          const newAvgPrice = (existingHolding.avgPrice * existingHolding.shares + totalCost) / totalShares

          newHoldings = state.user.holdings.map((h) =>
            h.symbol === symbol ? { ...h, shares: totalShares, avgPrice: newAvgPrice, currentPrice: price } : h,
          )
        } else {
          newHoldings = [
            ...state.user.holdings,
            {
              symbol,
              shares,
              avgPrice: price,
              currentPrice: price,
            },
          ]
        }

        const newBalance = state.user.balance - totalCost
        const newPortfolioValue = newHoldings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0)
        const newTotalPnL = newHoldings.reduce((sum, h) => sum + (h.currentPrice - h.avgPrice) * h.shares, 0)

        set({
          user: {
            ...state.user,
            balance: newBalance,
            holdings: newHoldings,
            portfolioValue: newPortfolioValue,
            totalPnL: newTotalPnL,
            tradesCount: state.user.tradesCount + 1,
          },
        })

        // Check for quest completion
        get().addXP(50) // XP for trading

        // Check first trade quest
        if (state.user.tradesCount === 0) {
          get().completeQuest("first-trade")
          get().earnBadge("first-trade-badge")
        }

        // Check active trader quest
        if (state.user.tradesCount + 1 >= 10) {
          get().completeQuest("active-trader")
        }

        // Check diversification quest
        const sectors = new Set(
          newHoldings.map((h) => {
            const stock = state.stocks.find((s) => s.symbol === h.symbol)
            return stock?.sector
          }),
        )
        if (sectors.size >= 3) {
          get().completeQuest("diversify")
          get().earnBadge("diversified-badge")
        }

        // Check profit quest
        if (newTotalPnL >= 500) {
          get().completeQuest("profit-maker")
          get().earnBadge("profit-badge")
        }
      },

      sellStock: (symbol: string, shares: number, price: number) => {
        const state = get()
        if (!state.user) return

        const holding = state.user.holdings.find((h) => h.symbol === symbol)
        if (!holding || holding.shares < shares) return

        const revenue = shares * price
        const newShares = holding.shares - shares

        let newHoldings: Holding[]
        if (newShares === 0) {
          newHoldings = state.user.holdings.filter((h) => h.symbol !== symbol)
        } else {
          newHoldings = state.user.holdings.map((h) =>
            h.symbol === symbol ? { ...h, shares: newShares, currentPrice: price } : h,
          )
        }

        const newBalance = state.user.balance + revenue
        const newPortfolioValue = newHoldings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0)
        const newTotalPnL = newHoldings.reduce((sum, h) => sum + (h.currentPrice - h.avgPrice) * h.shares, 0)

        set({
          user: {
            ...state.user,
            balance: newBalance,
            holdings: newHoldings,
            portfolioValue: newPortfolioValue,
            totalPnL: newTotalPnL,
            tradesCount: state.user.tradesCount + 1,
          },
        })

        get().addXP(50) // XP for trading
      },

      completeQuest: (questId: string) => {
        const state = get()
        if (!state.user || state.user.completedQuests.includes(questId)) return

        const quest = state.quests.find((q) => q.id === questId)
        if (!quest) return

        set({
          user: {
            ...state.user,
            completedQuests: [...state.user.completedQuests, questId],
          },
          quests: state.quests.map((q) => (q.id === questId ? { ...q, completed: true } : q)),
        })

        get().addXP(quest.xpReward)
      },

      earnBadge: (badgeId: string) => {
        const state = get()
        if (!state.user || state.user.badges.some((b) => b.id === badgeId)) return

        const badge = state.badges.find((b) => b.id === badgeId)
        if (!badge) return

        const earnedBadge = { ...badge, earned: true, earnedAt: new Date() }

        set({
          user: {
            ...state.user,
            badges: [...state.user.badges, earnedBadge],
          },
          badges: state.badges.map((b) => (b.id === badgeId ? earnedBadge : b)),
        })
      },

      addXP: (amount: number) => {
        const state = get()
        if (!state.user) return

        const newXP = state.user.xp + amount
        const newLevel = Math.floor(newXP / 1000) + 1

        if (newLevel > state.user.level && newLevel === 2) {
          get().earnBadge("level-up-badge")
        }

        set({
          user: {
            ...state.user,
            xp: newXP,
            level: newLevel,
          },
        })
      },

      updateStockPrices: () => {
        set({
          stocks: get().stocks.map((stock) => {
            const changePercent = (Math.random() - 0.5) * 0.1 // -5% to +5%
            const newPrice = stock.price * (1 + changePercent)
            const change = newPrice - stock.price

            return {
              ...stock,
              price: Number(newPrice.toFixed(2)),
              change: Number(change.toFixed(2)),
              changePercent: Number((changePercent * 100).toFixed(2)),
            }
          }),
        })

        // Update holdings with new prices
        const state = get()
        if (state.user && state.user.holdings.length > 0) {
          const updatedHoldings = state.user.holdings.map((holding) => {
            const stock = state.stocks.find((s) => s.symbol === holding.symbol)
            return stock ? { ...holding, currentPrice: stock.price } : holding
          })

          const newPortfolioValue = updatedHoldings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0)
          const newTotalPnL = updatedHoldings.reduce((sum, h) => sum + (h.currentPrice - h.avgPrice) * h.shares, 0)

          set({
            user: {
              ...state.user,
              holdings: updatedHoldings,
              portfolioValue: newPortfolioValue,
              totalPnL: newTotalPnL,
            },
          })
        }
      },
    }),
    {
      name: "investquest-storage",
    },
  ),
)
