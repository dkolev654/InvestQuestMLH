"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, TrendingUp, Clock, Zap, ChevronRight, Star } from "lucide-react"
import { useGameStore } from "@/lib/game-store"

interface Article {
  id: string
  title: string
  category: "basics" | "intermediate" | "advanced"
  readTime: number
  xpReward: number
  content: string
  keyPoints: string[]
  quiz?: {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }
}

const articles: Article[] = [
  {
    id: "what-is-trading",
    title: "What Does Trading Mean?",
    category: "basics",
    readTime: 3,
    xpReward: 50,
    content: `
Trading is the act of buying and selling stocks (shares of companies) to try to make a profit. When you trade, you're essentially betting on whether a company's stock price will go up or down.

**How Trading Works:**
When you buy a stock, you're purchasing a tiny piece of ownership in that company. If the company does well, more people want to buy its stock, driving the price up. If you sell at this higher price, you make a profit!

**Types of Trading:**
- **Day Trading**: Buying and selling stocks within the same day
- **Swing Trading**: Holding stocks for days or weeks
- **Long-term Investing**: Holding stocks for months or years

**Example:**
Let's say you buy 10 shares of Apple at $150 each (total cost: $1,500). If Apple's stock price rises to $160, your shares are now worth $1,600. If you sell, you make a $100 profit! 🎉

Remember: Trading involves risk. Stock prices can go down as well as up, so you might lose money too.
    `,
    keyPoints: [
      "Trading = buying and selling stocks to make profit",
      "You own a piece of the company when you buy stock",
      "Profit comes from selling at a higher price than you bought",
      "Stock prices can go up OR down - there's always risk",
    ],
    quiz: {
      question: "If you buy 5 shares of Tesla at $200 each and sell them at $220 each, what's your profit?",
      options: ["$20", "$100", "$200", "$1,100"],
      correctAnswer: 1,
      explanation:
        "You bought 5 shares at $200 = $1,000. You sold 5 shares at $220 = $1,100. Profit = $1,100 - $1,000 = $100",
    },
  },
  {
    id: "holding-stocks",
    title: "What Does It Mean to Hold?",
    category: "basics",
    readTime: 4,
    xpReward: 60,
    content: `
"Holding" means keeping your stocks instead of selling them right away. It's like planting a tree and waiting for it to grow! 🌱

**Why Do People Hold Stocks?**
Many successful investors believe in buying good companies and holding them for years. This strategy is called "buy and hold" investing.

**Benefits of Holding:**
- **Compound Growth**: Your money grows over time, and then that growth grows too!
- **Less Stress**: You don't worry about daily price changes
- **Lower Fees**: Fewer trades = fewer transaction costs
- **Tax Benefits**: Long-term investments often have better tax treatment

**The Power of Time:**
Historically, the stock market has gone up over long periods, even though it goes down sometimes in the short term. Patient investors often see better returns.

**Example:**
If you bought $1,000 of Amazon stock in 2010 and held it until 2020, it would be worth over $15,000! That's the power of holding quality stocks. 📈

**When to Hold vs. Sell:**
- Hold when you believe in the company's future
- Hold when you're investing for long-term goals
- Consider selling if the company's fundamentals change badly
- Consider selling if you need the money for something important

**Famous Quote:**
Warren Buffett, one of the world's best investors, says: "Time in the market beats timing the market."
    `,
    keyPoints: [
      "Holding = keeping stocks for a long time instead of selling quickly",
      "Compound growth makes your money grow faster over time",
      "Historical data shows markets tend to go up long-term",
      "Patience often leads to better investment returns",
    ],
    quiz: {
      question: "What is the main benefit of holding stocks for a long time?",
      options: [
        "You can check prices every day",
        "Compound growth and historical market increases",
        "You pay more in fees",
        "Stock prices never go down",
      ],
      correctAnswer: 1,
      explanation:
        "Holding stocks long-term allows compound growth and takes advantage of the market's historical tendency to increase over time.",
    },
  },
  {
    id: "options-trading",
    title: "How Options Trading Works",
    category: "advanced",
    readTime: 8,
    xpReward: 150,
    content: `
Options trading is like making a bet about where a stock price will go, but with a twist - you're not buying the actual stock! 🎯

**What Are Options?**
An option is a contract that gives you the RIGHT (but not the obligation) to buy or sell a stock at a specific price within a certain time period.

**Two Types of Options:**

**1. Call Options** 📞
- You think a stock price will GO UP
- Gives you the right to BUY the stock at a set price
- Example: You buy a call option for Apple with a "strike price" of $150, expiring in 1 month
- If Apple goes to $160, you can buy it for $150 and immediately sell for $160 = $10 profit per share!

**2. Put Options** 📉
- You think a stock price will GO DOWN  
- Gives you the right to SELL the stock at a set price
- Example: You buy a put option for Tesla with a strike price of $200
- If Tesla drops to $180, you can sell it for $200 even though it's only worth $180 = $20 profit per share!

**Key Terms:**
- **Strike Price**: The price you can buy/sell at
- **Expiration Date**: When the option expires
- **Premium**: What you pay to buy the option

**Why Use Options?**
- **Leverage**: Control more shares with less money
- **Hedging**: Protect your existing investments
- **Income**: Sell options to earn premium income

**Example Scenario:**
You think Netflix will announce great news next week. Instead of buying 100 shares for $40,000, you buy a call option for $500 that controls 100 shares. If Netflix goes up $10, you make $1,000 profit (minus the $500 you paid) = $500 profit with much less money at risk!

**⚠️ Important Warnings:**
- Options can expire worthless (you lose 100% of what you paid)
- They're more complex and risky than regular stock trading
- Time works against you - options lose value as expiration approaches
- Most beginners should master regular stock trading first

**Real-World Analogy:**
Think of options like concert tickets. You pay money now for the RIGHT to attend a concert on a specific date. If the concert gets cancelled or you change your mind, you don't have to go, but you lose the money you paid for the ticket.
    `,
    keyPoints: [
      "Options give you the RIGHT to buy/sell stocks at set prices",
      "Call options = betting price goes UP, Put options = betting price goes DOWN",
      "You can lose 100% of what you pay for options",
      "Options are more complex and risky than regular stock trading",
    ],
    quiz: {
      question: "If you buy a call option with a strike price of $100 and the stock goes to $110, what happens?",
      options: [
        "You lose money because the stock went up",
        "You can buy the stock for $100 and potentially profit $10 per share",
        "The option automatically expires",
        "You have to sell your other stocks",
      ],
      correctAnswer: 1,
      explanation:
        "A call option gives you the right to buy at the strike price ($100). If the stock is at $110, you can buy for $100 and immediately sell for $110, making $10 per share profit (minus what you paid for the option).",
    },
  },
  {
    id: "risk-management",
    title: "Managing Investment Risk",
    category: "intermediate",
    readTime: 5,
    xpReward: 80,
    content: `
Risk management is like wearing a seatbelt while driving - it doesn't prevent accidents, but it protects you when things go wrong! 🛡️

**What Is Investment Risk?**
Risk is the possibility that your investments might lose money. ALL investments have some risk, but smart investors learn to manage it.

**Types of Risk:**
- **Market Risk**: The whole market goes down
- **Company Risk**: A specific company has problems
- **Inflation Risk**: Your money loses buying power over time
- **Liquidity Risk**: You can't sell your investment quickly

**Risk Management Strategies:**

**1. Diversification** 🌍
Don't put all your eggs in one basket! Spread your money across:
- Different companies
- Different industries (tech, healthcare, finance)
- Different types of investments (stocks, bonds)

**2. Position Sizing** ⚖️
Never invest more than you can afford to lose in any single stock. A common rule: no more than 5-10% of your portfolio in one company.

**3. Stop-Loss Orders** 🛑
Set automatic sell orders if a stock drops to a certain price. This limits your losses.

**4. Dollar-Cost Averaging** 📅
Instead of investing all your money at once, invest the same amount regularly (like $100 every month). This reduces the impact of market timing.

**5. Emergency Fund First** 💰
Before investing, save 3-6 months of expenses in a savings account. Never invest money you might need soon!

**Risk vs. Reward:**
Generally, higher potential returns come with higher risk. Government bonds are safer but offer lower returns. Stocks are riskier but historically offer higher returns over time.

**The 1% Rule:**
Never risk more than 1% of your total investment money on a single trade. If you have $10,000, don't risk more than $100 on one trade.

**Emotional Risk Management:**
- Don't invest based on fear or greed
- Stick to your plan even when markets are volatile
- Don't check your portfolio every hour!
- Learn from mistakes without beating yourself up

Remember: The goal isn't to eliminate risk (impossible!) but to take smart, calculated risks that you can handle.
    `,
    keyPoints: [
      "All investments have risk - the key is managing it wisely",
      "Diversification spreads risk across different investments",
      "Never invest more than you can afford to lose",
      "Have an emergency fund before you start investing",
    ],
    quiz: {
      question: "What is the main purpose of diversification?",
      options: [
        "To guarantee profits",
        "To spread risk across different investments",
        "To buy as many stocks as possible",
        "To only invest in tech companies",
      ],
      correctAnswer: 1,
      explanation:
        "Diversification spreads your risk across different investments so that if one performs poorly, others might perform well, reducing your overall risk.",
    },
  },
]

export default function EducationCenter() {
  const { user, addXP } = useGameStore()
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [readArticles, setReadArticles] = useState<string[]>([])
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({})
  const [showQuizResult, setShowQuizResult] = useState<{ [key: string]: boolean }>({})

  const handleReadArticle = (article: Article) => {
    if (!readArticles.includes(article.id)) {
      setReadArticles([...readArticles, article.id])
      addXP(article.xpReward)
    }
  }

  const handleQuizAnswer = (articleId: string, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [articleId]: answerIndex })
    setShowQuizResult({ ...showQuizResult, [articleId]: true })

    const article = articles.find((a) => a.id === articleId)
    if (article?.quiz && answerIndex === article.quiz.correctAnswer) {
      addXP(25) // Bonus XP for correct answer
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basics":
        return <BookOpen className="w-4 h-4" />
      case "intermediate":
        return <TrendingUp className="w-4 h-4" />
      case "advanced":
        return <Zap className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basics":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-blue-100 text-blue-800"
      case "advanced":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="mb-4">
          ← Back to Education Center
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className={getCategoryColor(selectedArticle.category)}>
                    {getCategoryIcon(selectedArticle.category)}
                    <span className="ml-1 capitalize">{selectedArticle.category}</span>
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedArticle.readTime} min read
                  </div>
                  <div className="flex items-center text-sm text-blue-600">
                    <Star className="w-4 h-4 mr-1" />
                    {selectedArticle.xpReward} XP
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Article Content */}
            <div className="prose max-w-none">
              {selectedArticle.content.split("\n").map((paragraph, index) => {
                if (paragraph.trim() === "") return null

                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <h3 key={index} className="text-lg font-semibold mt-6 mb-3">
                      {paragraph.replace(/\*\*/g, "")}
                    </h3>
                  )
                }

                return (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
                  </p>
                )
              })}
            </div>

            {/* Key Points */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">🔑 Key Takeaways</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedArticle.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quiz */}
            {selectedArticle.quiz && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-lg">🧠 Test Your Knowledge</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-medium">{selectedArticle.quiz.question}</p>

                  <div className="space-y-2">
                    {selectedArticle.quiz.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={
                          showQuizResult[selectedArticle.id]
                            ? index === selectedArticle.quiz!.correctAnswer
                              ? "default"
                              : quizAnswers[selectedArticle.id] === index
                                ? "destructive"
                                : "outline"
                            : "outline"
                        }
                        className="w-full justify-start text-left"
                        onClick={() => handleQuizAnswer(selectedArticle.id, index)}
                        disabled={showQuizResult[selectedArticle.id]}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>

                  {showQuizResult[selectedArticle.id] && (
                    <div
                      className={`p-4 rounded-lg ${
                        quizAnswers[selectedArticle.id] === selectedArticle.quiz.correctAnswer
                          ? "bg-green-100 border border-green-200"
                          : "bg-red-100 border border-red-200"
                      }`}
                    >
                      <p className="font-medium mb-2">
                        {quizAnswers[selectedArticle.id] === selectedArticle.quiz.correctAnswer
                          ? "🎉 Correct! +25 XP"
                          : "❌ Not quite right"}
                      </p>
                      <p className="text-sm">{selectedArticle.quiz.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Mark as Read Button */}
            <div className="text-center">
              <Button
                onClick={() => handleReadArticle(selectedArticle)}
                disabled={readArticles.includes(selectedArticle.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                {readArticles.includes(selectedArticle.id)
                  ? "✅ Article Completed"
                  : `Complete Article (+${selectedArticle.xpReward} XP)`}
              </Button>
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
            <BookOpen className="w-6 h-6" />
            <span>Education Center</span>
          </CardTitle>
          <CardDescription>
            Learn investing fundamentals and earn XP! Read articles and take quizzes to level up your knowledge.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Articles</TabsTrigger>
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={getCategoryColor(article.category)}>
                      {getCategoryIcon(article.category)}
                      <span className="ml-1 capitalize">{article.category}</span>
                    </Badge>
                    {readArticles.includes(article.id) && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        ✅ Read
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.readTime} min
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {article.xpReward} XP
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.content.split("\n")[1]?.substring(0, 150)}...
                  </p>

                  <Button onClick={() => setSelectedArticle(article)} className="w-full" variant="outline">
                    Read Article
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {["basics", "intermediate", "advanced"].map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles
                .filter((article) => article.category === category)
                .map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className={getCategoryColor(article.category)}>
                          {getCategoryIcon(article.category)}
                          <span className="ml-1 capitalize">{article.category}</span>
                        </Badge>
                        {readArticles.includes(article.id) && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            ✅ Read
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold mb-2">{article.title}</h3>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {article.readTime} min
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          {article.xpReward} XP
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.content.split("\n")[1]?.substring(0, 150)}...
                      </p>

                      <Button onClick={() => setSelectedArticle(article)} className="w-full" variant="outline">
                        Read Article
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
