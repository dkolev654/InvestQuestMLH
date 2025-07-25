"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Target, BookOpen, TrendingUp, Award } from "lucide-react"
import { useGameStore } from "@/lib/game-store"

export default function QuestsPanel() {
  const { quests, user, completeQuest } = useGameStore()

  if (!user) return null

  const getQuestProgress = (quest: any) => {
    switch (quest.id) {
      case "first-trade":
        return user.tradesCount > 0 ? 100 : 0
      case "diversify":
        const sectors = new Set(
          user.holdings.map((h) => {
            // This would need to be properly implemented with stock data
            return "sector"
          }),
        )
        return Math.min((sectors.size / 3) * 100, 100)
      case "profit-maker":
        return Math.min((user.totalPnL / 500) * 100, 100)
      case "active-trader":
        return Math.min((user.tradesCount / 10) * 100, 100)
      default:
        return 0
    }
  }

  const getQuestIcon = (type: string) => {
    switch (type) {
      case "trade":
        return <TrendingUp className="w-5 h-5" />
      case "learn":
        return <BookOpen className="w-5 h-5" />
      case "portfolio":
        return <Target className="w-5 h-5" />
      default:
        return <Circle className="w-5 h-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5" />
          <span>Learning Quests</span>
        </CardTitle>
        <CardDescription>Complete quests to earn XP and unlock new features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {quests.map((quest) => {
          const progress = getQuestProgress(quest)
          const isCompleted = user.completedQuests.includes(quest.id)

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-lg border ${
                isCompleted ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {isCompleted ? <CheckCircle className="w-5 h-5 text-green-600" /> : getQuestIcon(quest.type)}
                  <div>
                    <h4 className="font-semibold">{quest.title}</h4>
                    <p className="text-sm text-gray-600">{quest.description}</p>
                  </div>
                </div>
                <Badge variant={isCompleted ? "default" : "secondary"}>{quest.xpReward} XP</Badge>
              </div>

              {!isCompleted && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {isCompleted && (
                <div className="flex items-center space-x-2 text-green-600">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">Quest Completed!</span>
                </div>
              )}
            </div>
          )
        })}

        {/* Learning Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>💡 Learning Tip</span>
          </h4>
          <p className="text-sm text-gray-700">
            <strong>What is diversification?</strong> It means spreading your investments across different companies and
            sectors. This helps reduce risk because if one stock goes down, others might go up!
          </p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold mb-2">🎯 Quick Quiz</h4>
          <p className="text-sm text-gray-700 mb-3">What does it mean when a stock price goes up?</p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start text-left bg-transparent">
              A) The company is losing money
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-left bg-transparent">
              B) More people want to buy than sell
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-left bg-transparent">
              C) The company is closing down
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
