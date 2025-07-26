"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useGameStore } from "@/lib/game-store"
import { DuckCharacter } from "./duck-character"
import { Send, MessageCircle, Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI investment advisor. I can help you understand stocks, analyze your portfolio, answer investment questions, and provide market insights. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useGameStore()

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          user: user,
          context: {
            portfolio: user?.portfolio || [],
            balance: user?.balance || 0,
            level: user?.level || 1,
            xp: user?.xp || 0,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "I'm sorry, I couldn't process your request right now. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedQuestions = [
    "What stocks should I consider for my portfolio?",
    "How do I analyze a company's financial health?",
    "What's the difference between growth and value investing?",
    "How much should I diversify my portfolio?",
    "When should I sell a stock?",
    "What are the risks of day trading?",
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <span>AI Investment Advisor</span>
            <Badge variant="secondary" className="ml-auto">
              Powered by AI
            </Badge>
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Get personalized investment advice and market insights</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[500px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="flex items-center space-x-2 mb-2">
                            <DuckCharacter size="xs" />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">AI Advisor</span>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <DuckCharacter size="xs" />
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about investing..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-2 text-xs bg-transparent"
                  onClick={() => setInput(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* User Context */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Level:</span>
                <span className="font-semibold">{user?.level || 1}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Balance:</span>
                <span className="font-semibold">${(user?.balance || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Holdings:</span>
                <span className="font-semibold">{user?.portfolio?.length || 0} stocks</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Trades:</span>
                <span className="font-semibold">{user?.stats?.totalTrades || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li>• Ask about specific stocks you're interested in</li>
                <li>• Request portfolio analysis and suggestions</li>
                <li>• Learn about different investment strategies</li>
                <li>• Get explanations of financial terms</li>
                <li>• Ask for market trend insights</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
