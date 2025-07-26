import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  balance: number
  xp: number
  level: number
  portfolio: PortfolioItem[]
  completedQuests: string[]
  badges: string[]
  completedModules: string[]
  stats: UserStats
}

interface PortfolioItem {
  symbol: string
  quantity: number
  avgPrice: number
}

interface UserStats {
  totalTrades: number
  totalProfit: number
  largestTrade: number
  completedModules: number
}

interface GameStore {
  user: User | null
  initializeUser: () => void
  buyStock: (symbol: string, quantity: number, price: number) => void
  sellStock: (symbol: string, quantity: number, price: number) => void
  addXP: (amount: number) => void
  completeQuest: (questId: string, xpReward: number) => void
  earnBadge: (badgeId: string) => void
  completeEducationModule: (moduleId: string) => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      user: null,

      initializeUser: () => {
        const existingUser = get().user
        if (!existingUser) {
          set({
            user: {
              id: "user-1",
              name: "Investor",
              balance: 10000,
              xp: 0,
              level: 1,
              portfolio: [],
              completedQuests: [],
              badges: [],
              completedModules: [],
              stats: {
                totalTrades: 0,
                totalProfit: 0,
                largestTrade: 0,
                completedModules: 0,
              },
            },
          })
        }
      },

      buyStock: (symbol: string, quantity: number, price: number) => {
        const user = get().user
        if (!user) return

        const totalCost = price * quantity
        if (totalCost > user.balance) return

        const existingHolding = user.portfolio.find((p) => p.symbol === symbol)

        set({
          user: {
            ...user,
            balance: user.balance - totalCost,
            portfolio: existingHolding
              ? user.portfolio.map((p) =>
                  p.symbol === symbol
                    ? {
                        ...p,
                        quantity: p.quantity + quantity,
                        avgPrice: (p.avgPrice * p.quantity + price * quantity) / (p.quantity + quantity),
                      }
                    : p,
                )
              : [...user.portfolio, { symbol, quantity, avgPrice: price }],
            stats: {
              ...user.stats,
              totalTrades: user.stats.totalTrades + 1,
              largestTrade: Math.max(user.stats.largestTrade, totalCost),
            },
          },
        })
      },

      sellStock: (symbol: string, quantity: number, price: number) => {
        const user = get().user
        if (!user) return

        const holding = user.portfolio.find((p) => p.symbol === symbol)
        if (!holding || holding.quantity < quantity) return

        const totalValue = price * quantity
        const profit = (price - holding.avgPrice) * quantity

        set({
          user: {
            ...user,
            balance: user.balance + totalValue,
            portfolio:
              holding.quantity === quantity
                ? user.portfolio.filter((p) => p.symbol !== symbol)
                : user.portfolio.map((p) => (p.symbol === symbol ? { ...p, quantity: p.quantity - quantity } : p)),
            stats: {
              ...user.stats,
              totalTrades: user.stats.totalTrades + 1,
              totalProfit: user.stats.totalProfit + profit,
              largestTrade: Math.max(user.stats.largestTrade, totalValue),
            },
          },
        })
      },

      addXP: (amount: number) => {
        const user = get().user
        if (!user) return

        const newXP = user.xp + amount
        const newLevel = Math.floor(newXP / 100) + 1

        set({
          user: {
            ...user,
            xp: newXP,
            level: newLevel,
          },
        })
      },

      completeQuest: (questId: string, xpReward: number) => {
        const user = get().user
        if (!user || user.completedQuests.includes(questId)) return

        const newXP = user.xp + xpReward
        const newLevel = Math.floor(newXP / 100) + 1

        set({
          user: {
            ...user,
            xp: newXP,
            level: newLevel,
            completedQuests: [...user.completedQuests, questId],
          },
        })
      },

      earnBadge: (badgeId: string) => {
        const user = get().user
        if (!user || user.badges.includes(badgeId)) return

        set({
          user: {
            ...user,
            badges: [...user.badges, badgeId],
          },
        })
      },

      completeEducationModule: (moduleId: string) => {
        const user = get().user
        if (!user || user.completedModules.includes(moduleId)) return

        set({
          user: {
            ...user,
            completedModules: [...user.completedModules, moduleId],
            stats: {
              ...user.stats,
              completedModules: user.stats.completedModules + 1,
            },
          },
        })
      },
    }),
    {
      name: "investquest-game-store",
    },
  ),
)

// Initialize user on store creation
if (typeof window !== "undefined") {
  useGameStore.getState().initializeUser()
}
