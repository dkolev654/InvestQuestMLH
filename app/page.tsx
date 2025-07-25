"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Trophy, BookOpen, DollarSign, Target, Star } from "lucide-react"
import TradingInterface from "@/components/trading-interface"
import Portfolio from "@/components/portfolio"
import QuestsPanel from "@/components/quests-panel"
import BadgesPanel from "@/components/badges-panel"
import { useGameStore } from "@/lib/game-store"
import EducationCenter from "@/components/education-center"
import AIChatAssistant from "@/components/ai-chat-assistant"

export default function InvestQuest() {
  const { user, initializeUser } = useGameStore()

  useEffect(() => {
    initializeUser()
  }, [initializeUser])

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const getXPProgress = () => {
    const currentLevelXP = user.level * 1000
    const nextLevelXP = (user.level + 1) * 1000
    return ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InvestQuest
              </h1>
              <p className="text-gray-600 mt-1">Learn investing through gamified trading</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">${user.balance.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Available Balance</div>
            </div>
          </div>

          {/* User Stats */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Welcome back, Trader!</h2>
                    <p className="opacity-90">
                      Level {user.level} • {user.xp} XP
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90 mb-2">Progress to Level {user.level + 1}</div>
                  <Progress value={getXPProgress()} className="w-32 bg-white/20" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-sm text-gray-500">Portfolio Value</div>
                  <div className="font-bold">${user.portfolioValue.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-500">Total P&L</div>
                  <div className={`font-bold ${user.totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {user.totalPnL >= 0 ? "+" : ""}${user.totalPnL.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-sm text-gray-500">Badges Earned</div>
                  <div className="font-bold">{user.badges.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-sm text-gray-500">Quests Completed</div>
                  <div className="font-bold">{user.completedQuests.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="trade">Trade</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="learn">Learn</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Daily Tip</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm">
                      💡 <strong>Did you know?</strong> Diversification means spreading your investments across
                      different companies and sectors to reduce risk. Don't put all your eggs in one basket!
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Market Trends
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Start New Quest
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Trophy className="w-4 h-4 mr-2" />
                    Check Leaderboard
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Portfolio />
              </div>
              <div>
                <QuestsPanel />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trade">
            <TradingInterface />
          </TabsContent>

          <TabsContent value="portfolio">
            <Portfolio />
          </TabsContent>

          <TabsContent value="learn">
            <QuestsPanel />
          </TabsContent>

          <TabsContent value="badges">
            <BadgesPanel />
          </TabsContent>

          <TabsContent value="education">
            <EducationCenter />
          </TabsContent>
        </Tabs>

        {/* AI Chat Assistant */}
        <AIChatAssistant />
      </div>
    </div>
  )
}
