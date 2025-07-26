"use client"

import { useState, useEffect } from "react"

interface DuckCharacterProps {
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
}

export function DuckCharacter({ size = "md", className = "" }: DuckCharacterProps) {
  const [isWinking, setIsWinking] = useState(false)

  useEffect(() => {
    const winkInterval = setInterval(
      () => {
        setIsWinking(true)
        setTimeout(() => setIsWinking(false), 200)
      },
      Math.random() * 3000 + 3000,
    ) // Random interval between 3-6 seconds

    return () => clearInterval(winkInterval)
  }, [])

  const sizeClasses = {
    xs: "w-8 h-8",
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  return (
    <div className={`${sizeClasses[size]} ${className} flex-shrink-0`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Duck Body */}
        <ellipse cx="50" cy="65" rx="25" ry="20" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />

        {/* Duck Head */}
        <circle cx="50" cy="35" r="18" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />

        {/* Top Hat */}
        <rect x="42" y="12" width="16" height="12" fill="#1a1a1a" rx="1" />
        <ellipse cx="50" cy="24" rx="12" ry="3" fill="#1a1a1a" />
        <rect x="46" y="20" width="8" height="2" fill="#333" />

        {/* Monocle */}
        <circle cx="45" cy="32" r="6" fill="none" stroke="#C0C0C0" strokeWidth="1.5" />
        <circle cx="45" cy="32" r="4" fill="rgba(255,255,255,0.3)" />
        <line x1="39" y1="32" x2="35" y2="30" stroke="#C0C0C0" strokeWidth="1" />

        {/* Eyes */}
        <circle cx="45" cy="32" r="2" fill="#000" />
        {isWinking ? (
          <path d="M 53 30 Q 57 32 53 34" stroke="#000" strokeWidth="1.5" fill="none" />
        ) : (
          <circle cx="55" cy="32" r="2" fill="#000" />
        )}

        {/* Beak */}
        <polygon points="50,38 46,42 54,42" fill="#FFA500" stroke="#FF8C00" strokeWidth="0.5" />

        {/* Bow Tie */}
        <polygon points="45,48 50,45 55,48 55,52 50,55 45,52" fill="#8B0000" />
        <rect x="48" y="47" width="4" height="6" fill="#A0522D" />

        {/* Tuxedo Shirt */}
        <rect x="42" y="52" width="16" height="18" fill="#FFFFFF" rx="2" />
        <rect x="44" y="54" width="12" height="14" fill="#000000" rx="1" />

        {/* Shirt Buttons */}
        <circle cx="50" cy="58" r="1" fill="#FFFFFF" />
        <circle cx="50" cy="63" r="1" fill="#FFFFFF" />

        {/* Wings */}
        <ellipse cx="30" cy="60" rx="8" ry="12" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
        <ellipse cx="70" cy="60" rx="8" ry="12" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />

        {/* Feet */}
        <ellipse cx="45" cy="85" rx="4" ry="2" fill="#FFA500" />
        <ellipse cx="55" cy="85" rx="4" ry="2" fill="#FFA500" />
      </svg>
    </div>
  )
}
