"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useGameStore } from "@/lib/game-store"
import { toast } from "sonner"
import { BookOpen, Play, CheckCircle, Lock, Star } from "lucide-react"

const EDUCATION_MODULES = [
  {
    id: "basics",
    title: "Stock Market Basics",
    description: "Learn the fundamentals of stock trading and market mechanics",
    duration: "15 min",
    xpReward: 50,
    difficulty: "Beginner",
    topics: ["What are stocks?", "How the stock market works", "Types of orders", "Market vs. limit orders"],
    content: `
# Stock Market Basics

## What are Stocks?

Stocks represent ownership shares in a company. When you buy stock, you become a partial owner of that business and have a claim on its assets and earnings.

## How the Stock Market Works

The stock market is a platform where investors buy and sell shares of publicly traded companies. Prices fluctuate based on supply and demand, company performance, and market sentiment.

## Types of Orders

- **Market Order**: Buy or sell immediately at current market price
- **Limit Order**: Buy or sell only at a specific price or better
- **Stop Order**: Triggers a market order when price reaches a certain level

## Key Takeaways

- Stocks represent company ownership
- Prices change based on supply and demand
- Different order types serve different strategies
- Always research before investing
    `,
  },
  {
    id: "analysis",
    title: "Fundamental Analysis",
    description: "Understand how to evaluate companies and their financial health",
    duration: "20 min",
    xpReward: 75,
    difficulty: "Intermediate",
    topics: [
      "Financial statements",
      "Key ratios (P/E, P/B, ROE)",
      "Revenue and profit analysis",
      "Industry comparison",
    ],
    content: `
# Fundamental Analysis

## Financial Statements

Companies publish quarterly and annual reports containing three key financial statements:

- **Income Statement**: Shows revenue, expenses, and profit
- **Balance Sheet**: Lists assets, liabilities, and equity
- **Cash Flow Statement**: Tracks money in and out of the business

## Key Financial Ratios

### Price-to-Earnings (P/E) Ratio
- Formula: Stock Price ÷ Earnings Per Share
- Shows how much investors pay for each dollar of earnings
- Lower P/E may indicate undervalued stock

### Return on Equity (ROE)
- Formula: Net Income ÷ Shareholder Equity
- Measures how efficiently company uses shareholder money
- Higher ROE generally indicates better management

## Analysis Process

1. Review recent financial statements
2. Calculate key ratios
3. Compare to industry averages
4. Assess growth trends
5. Consider competitive position
    `,
  },
  {
    id: "technical",
    title: "Technical Analysis",
    description: "Learn to read charts and identify trading patterns",
    duration: "25 min",
    xpReward: 100,
    difficulty: "Intermediate",
    topics: ["Chart patterns", "Moving averages", "Support and resistance", "Volume analysis"],
    content: `
# Technical Analysis

## Chart Patterns

Technical analysis involves studying price charts to predict future movements. Common patterns include:

- **Head and Shoulders**: Reversal pattern indicating trend change
- **Double Top/Bottom**: Shows potential reversal points
- **Triangles**: Continuation patterns suggesting breakout direction

## Moving Averages

Moving averages smooth out price data to identify trends:

- **Simple Moving Average (SMA)**: Average price over specific period
- **Exponential Moving Average (EMA)**: Gives more weight to recent prices
- **Golden Cross**: When short-term MA crosses above long-term MA (bullish)

## Support and Resistance

- **Support**: Price level where stock tends to stop falling
- **Resistance**: Price level where stock tends to stop rising
- **Breakouts**: When price moves beyond these levels with volume

## Volume Analysis

Volume confirms price movements:
- High volume + price increase = strong bullish signal
- High volume + price decrease = strong bearish signal
- Low volume movements are less reliable
    `,
  },
  {
    id: "risk",
    title: "Risk Management",
    description: "Master portfolio protection and risk assessment strategies",
    duration: "18 min",
    xpReward: 125,
    difficulty: "Advanced",
    topics: ["Diversification strategies", "Position sizing", "Stop-loss orders", "Risk-reward ratios"],
    content: `
# Risk Management

## Diversification

Don't put all eggs in one basket:

- **Sector Diversification**: Spread investments across different industries
- **Geographic Diversification**: Include domestic and international stocks
- **Market Cap Diversification**: Mix large, mid, and small-cap stocks
- **Asset Class Diversification**: Include bonds, REITs, commodities

## Position Sizing

Determine how much to invest in each stock:

- **Equal Weight**: Same dollar amount in each position
- **Risk-Based**: Larger positions in lower-risk stocks
- **Conviction-Based**: Larger positions in highest-confidence picks
- **Never risk more than 5-10% in a single stock**

## Stop-Loss Orders

Automatic sell orders to limit losses:

- **Fixed Percentage**: Sell if stock drops X% from purchase price
- **Trailing Stop**: Adjusts upward as stock price rises
- **Technical Stop**: Based on support levels or chart patterns

## Risk-Reward Ratios

Always consider potential gain vs. potential loss:

- **Minimum 2:1 ratio**: Risk $1 to potentially gain $2
- **Higher ratios for riskier trades**
- **Factor in probability of success**
- **Cut losses quickly, let winners run**
    `,
  },
]

export function EducationCenter() {
  const [selectedModule, setSelectedModule] = useState<(typeof EDUCATION_MODULES)[0] | null>(null)
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const { user, addXP, completeEducationModule } = useGameStore()

  const isModuleCompleted = (moduleId: string) => {
    return user?.completedModules?.includes(moduleId) || false
  }

  const isModuleUnlocked = (moduleIndex: number) => {
    if (moduleIndex === 0) return true
    return isModuleCompleted(EDUCATION_MODULES[moduleIndex - 1].id)
  }

  const handleCompleteModule = (module: (typeof EDUCATION_MODULES)[0]) => {
    if (!isModuleCompleted(module.id)) {
      completeEducationModule(module.id)
      addXP(module.xpReward)
      toast.success(`Module completed! +${module.xpReward} XP earned`)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (selectedModule) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={() => setSelectedModule(null)}>
                  ← Back
                </Button>
                <div>
                  <CardTitle>{selectedModule.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getDifficultyColor(selectedModule.difficulty)}>{selectedModule.difficulty}</Badge>
                    <Badge variant="outline">{selectedModule.duration}</Badge>
                    <Badge variant="secondary">{selectedModule.xpReward} XP</Badge>
                  </div>
                </div>
              </div>
              {isModuleCompleted(selectedModule.id) && <CheckCircle className="h-6 w-6 text-green-600" />}
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-line text-sm leading-relaxed">{selectedModule.content}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Module Topics</h3>
                <ul className="space-y-1">
                  {selectedModule.topics.map((topic, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                {!isModuleCompleted(selectedModule.id) ? (
                  <Button onClick={() => handleCompleteModule(selectedModule)} className="flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span>Complete Module</span>
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Completed</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span>Education Center</span>
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Master investing fundamentals through interactive learning modules
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EDUCATION_MODULES.map((module, index) => {
          const isCompleted = isModuleCompleted(module.id)
          const isUnlocked = isModuleUnlocked(index)

          return (
            <Card
              key={module.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                !isUnlocked ? "opacity-50" : ""
              } ${isCompleted ? "ring-2 ring-green-200" : ""}`}
              onClick={() => isUnlocked && setSelectedModule(module)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {!isUnlocked ? (
                      <Lock className="h-8 w-8 text-gray-400" />
                    ) : isCompleted ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <Play className="h-8 w-8 text-blue-600" />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{module.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getDifficultyColor(module.difficulty)}>{module.difficulty}</Badge>
                        <Badge variant="outline">{module.duration}</Badge>
                      </div>
                    </div>
                  </div>
                  {isCompleted && (
                    <Badge variant="default" className="bg-green-600">
                      Completed
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">{module.description}</p>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Topics Covered:</h4>
                    <ul className="space-y-1">
                      {module.topics.slice(0, 3).map((topic, topicIndex) => (
                        <li
                          key={topicIndex}
                          className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2"
                        >
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          <span>{topic}</span>
                        </li>
                      ))}
                      {module.topics.length > 3 && (
                        <li className="text-sm text-gray-500 italic">+{module.topics.length - 3} more topics</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">{module.xpReward} XP</span>
                    </div>
                    {isUnlocked ? (
                      <Button size="sm" variant={isCompleted ? "outline" : "default"}>
                        {isCompleted ? "Review" : "Start Learning"}
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Locked
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Modules Completed</span>
              <span className="text-sm text-gray-600">
                {user?.completedModules?.length || 0} / {EDUCATION_MODULES.length}
              </span>
            </div>
            <Progress
              value={((user?.completedModules?.length || 0) / EDUCATION_MODULES.length) * 100}
              className="h-2"
            />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{user?.completedModules?.length || 0}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {EDUCATION_MODULES.reduce(
                    (sum, module) => (user?.completedModules?.includes(module.id) ? sum + module.xpReward : sum),
                    0,
                  )}
                </p>
                <p className="text-sm text-gray-600">XP Earned</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {EDUCATION_MODULES.filter((_, index) => isModuleUnlocked(index)).length}
                </p>
                <p className="text-sm text-gray-600">Unlocked</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
