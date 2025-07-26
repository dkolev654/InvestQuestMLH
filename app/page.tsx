"use client"

import { useState } from "react"
import { TradingInterface } from "@/components/trading-interface"
import { Portfolio } from "@/components/portfolio"
import { QuestsPanel } from "@/components/quests-panel"
import { BadgesPanel } from "@/components/badges-panel"
import { EducationCenter } from "@/components/education-center"
import { AIChatAssistant } from "@/components/ai-chat-assistant"
import { DuckCharacter } from "@/components/duck-character"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGameStore } from "@/lib/game-store"
import { TrendingUp, Trophy, BookOpen, MessageCircle, User, Coins } from "lucide-react"

export default function InvestQuestApp() {
  const { user } = useGameStore()
  const [activeTab, setActiveTab] = useState("trading")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <DuckCharacter size="sm" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">InvestQuest</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learn investing through gaming</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Card className="px-4 py-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{user?.name || "Investor"}</span>
                </div>
              </Card>

              <Card className="px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">Level {user?.level || 1}</span>
                </div>
              </Card>

              <Card className="px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-green-600" />
                  <span className="font-medium">${(user?.balance || 10000).toLocaleString()}</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="trading" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trading</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Quests</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">AI Chat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <TradingInterface />
              </div>
              <div className="space-y-6">
                <BadgesPanel />
                <QuestsPanel />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Portfolio />
          </TabsContent>

          <TabsContent value="quests" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <QuestsPanel />
              </div>
              <div>
                <BadgesPanel />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <EducationCenter />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <AIChatAssistant />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DuckCharacter size="xs" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2024 InvestQuest. Learn investing through gamified trading simulation.
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              Powered by Alpha Vantage API
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  )
}
