"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Lock } from "lucide-react"
import { useGameStore } from "@/lib/game-store"

export default function BadgesPanel() {
  const { badges, user } = useGameStore()

  if (!user) return null

  const earnedBadges = user.badges
  const availableBadges = badges.filter((badge) => !earnedBadges.some((earned) => earned.id === badge.id))

  return (
    <div className="space-y-6">
      {/* Earned Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Earned Badges</span>
          </CardTitle>
          <CardDescription>Your achievements and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          {earnedBadges.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No badges earned yet</p>
              <p className="text-sm">Complete quests to earn your first badge!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl">{badge.icon}</span>
                    <div>
                      <h4 className="font-semibold">{badge.name}</h4>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                    </div>
                  </div>
                  {badge.earnedAt && (
                    <div className="text-xs text-gray-500">
                      Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-gray-400" />
            <span>Available Badges</span>
          </CardTitle>
          <CardDescription>Badges you can earn by completing quests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableBadges.map((badge) => (
              <div key={badge.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-75">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl grayscale">{badge.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-700">{badge.name}</h4>
                    <p className="text-sm text-gray-500">{badge.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Not Earned
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badge Progress Tips */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 How to Earn Badges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="text-lg">🛒</span>
            <div>
              <p className="font-medium">First Trade Badge</p>
              <p className="text-sm text-gray-600">Make your first stock purchase</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-lg">🌍</span>
            <div>
              <p className="font-medium">Diversified Investor Badge</p>
              <p className="text-sm text-gray-600">Own stocks from 3+ different sectors</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-lg">💸</span>
            <div>
              <p className="font-medium">Profit Master Badge</p>
              <p className="text-sm text-gray-600">Achieve $500+ in total profits</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-lg">⭐</span>
            <div>
              <p className="font-medium">Level Up Badge</p>
              <p className="text-sm text-gray-600">Reach Level 2 by earning XP</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
