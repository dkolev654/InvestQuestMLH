"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGameStore } from "@/lib/game-store"
import { Award, Star, Trophy, Target, TrendingUp, BookOpen, Zap, Crown } from "lucide-react"

const BADGES = [
  {
    id: "first-trade",
    name: "First Steps",
    description: "Made your first trade",
    icon: TrendingUp,
    rarity: "common",
    requirement: "Complete 1 trade",
  },
  {
    id: "portfolio-starter",
    name: "Portfolio Starter",
    description: "Own 3 different stocks",
    icon: Target,
    rarity: "common",
    requirement: "Own 3 stocks",
  },
  {
    id: "day-trader",
    name: "Day Trader",
    description: "Completed 10 trades",
    icon: Zap,
    rarity: "uncommon",
    requirement: "Complete 10 trades",
  },
  {
    id: "profit-maker",
    name: "Profit Maker",
    description: "Earned $500 in profits",
    icon: Star,
    rarity: "uncommon",
    requirement: "Earn $500 profit",
  },
  {
    id: "scholar",
    name: "Scholar",
    description: "Completed education modules",
    icon: BookOpen,
    rarity: "rare",
    requirement: "Complete 3 modules",
  },
  {
    id: "high-roller",
    name: "High Roller",
    description: "Made a $1000+ trade",
    icon: Crown,
    rarity: "rare",
    requirement: "Single $1000+ trade",
  },
  {
    id: "diversified",
    name: "Diversified",
    description: "Own stocks in 5+ sectors",
    icon: Award,
    rarity: "epic",
    requirement: "Own 5+ sectors",
  },
  {
    id: "millionaire",
    name: "Millionaire",
    description: "Portfolio worth $1M+",
    icon: Trophy,
    rarity: "legendary",
    requirement: "Portfolio $1M+",
  },
]

export function BadgesPanel() {
  const { user } = useGameStore()

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "uncommon":
        return "bg-green-100 text-green-800 border-green-300"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const isBadgeEarned = (badgeId: string) => {
    return user?.badges?.includes(badgeId) || false
  }

  const earnedBadges = BADGES.filter((badge) => isBadgeEarned(badge.id))
  const availableBadges = BADGES.filter((badge) => !isBadgeEarned(badge.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-purple-600" />
          <span>Badges</span>
          <Badge variant="secondary" className="ml-auto">
            {earnedBadges.length}/{BADGES.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {earnedBadges.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Earned Badges</h3>
            <div className="grid grid-cols-2 gap-3">
              {earnedBadges.map((badge) => {
                const Icon = badge.icon
                return (
                  <div key={badge.id} className={`p-3 rounded-lg border-2 ${getRarityColor(badge.rarity)}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{badge.name}</span>
                    </div>
                    <p className="text-xs opacity-80">{badge.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {availableBadges.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Available Badges</h3>
            <div className="space-y-2">
              {availableBadges.slice(0, 4).map((badge) => {
                const Icon = badge.icon
                return (
                  <div
                    key={badge.id}
                    className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 opacity-60"
                  >
                    <div className="p-1 rounded bg-gray-200 dark:bg-gray-700">
                      <Icon className="h-3 w-3 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{badge.name}</p>
                      <p className="text-xs text-gray-500">{badge.requirement}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {badge.rarity}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {earnedBadges.length === 0 && (
          <div className="text-center py-6">
            <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Badges Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Start trading to earn your first badge!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
