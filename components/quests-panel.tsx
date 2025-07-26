"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useGameStore } from "@/lib/game-store"
import { Trophy, Target, TrendingUp, BookOpen, Star, Zap } from "lucide-react"

const QUESTS = [
  {
    id: "first-trade",
    title: "First Trade",
    description: "Make your first stock purchase",
    icon: TrendingUp,
    xpReward: 50,
    target: 1,
    type: "trades",
  },
  {
    id: "portfolio-builder",
    title: "Portfolio Builder",
    description: "Own 5 different stocks",
    icon: Target,
    xpReward: 100,
    target: 5,
    type: "unique_stocks",
  },
  {
    id: "day-trader",
    title: "Day Trader",
    description: "Complete 10 trades",
    icon: Zap,
    xpReward: 200,
    target: 10,
    type: "trades",
  },
  {
    id: "profit-maker",
    title: "Profit Maker",
    description: "Achieve $500 in total gains",
    icon: Star,
    xpReward: 300,
    target: 500,
    type: "profit",
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Complete 3 education modules",
    icon: BookOpen,
    xpReward: 150,
    target: 3,
    type: "education",
  },
  {
    id: "high-roller",
    title: "High Roller",
    description: "Make a single trade worth $1000+",
    icon: Trophy,
    xpReward: 250,
    target: 1000,
    type: "single_trade",
  },
]

export function QuestsPanel() {
  const { user, completeQuest } = useGameStore()

  const getQuestProgress = (quest: (typeof QUESTS)[0]) => {
    if (!user) return 0

    switch (quest.type) {
      case "trades":
        return user.stats?.totalTrades || 0
      case "unique_stocks":
        return user.portfolio?.length || 0
      case "profit":
        return Math.max(0, user.stats?.totalProfit || 0)
      case "education":
        return user.stats?.completedModules || 0
      case "single_trade":
        return user.stats?.largestTrade || 0
      default:
        return 0
    }
  }

  const isQuestCompleted = (questId: string) => {
    return user?.completedQuests?.includes(questId) || false
  }

  const handleQuestComplete = (quest: (typeof QUESTS)[0]) => {
    if (!isQuestCompleted(quest.id) && getQuestProgress(quest) >= quest.target) {
      completeQuest(quest.id, quest.xpReward)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <span>Active Quests</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {QUESTS.map((quest) => {
          const progress = getQuestProgress(quest)
          const isCompleted = isQuestCompleted(quest.id)
          const progressPercent = Math.min((progress / quest.target) * 100, 100)
          const Icon = quest.icon

          return (
            <div
              key={quest.id}
              className={`p-4 border rounded-lg transition-all ${
                isCompleted
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    isCompleted
                      ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{quest.title}</h3>
                    {isCompleted ? (
                      <Badge variant="default" className="bg-green-600">
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline">{quest.xpReward} XP</Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">{quest.description}</p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>
                        {quest.type === "profit" || quest.type === "single_trade"
                          ? `$${progress.toFixed(0)} / $${quest.target}`
                          : `${progress} / ${quest.target}`}
                      </span>
                    </div>
                    <Progress value={progressPercent} className={`h-2 ${isCompleted ? "bg-green-200" : ""}`} />
                  </div>

                  {!isCompleted && progress >= quest.target && (
                    <button
                      onClick={() => handleQuestComplete(quest)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Claim Reward →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
