import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, user, context } = await request.json()

    // Simple AI responses based on keywords and context
    const responses = {
      portfolio: generatePortfolioAdvice(user, context),
      analysis: generateAnalysisAdvice(message),
      strategy: generateStrategyAdvice(message),
      risk: generateRiskAdvice(message),
      general: generateGeneralAdvice(message),
    }

    let response = responses.general

    // Determine response type based on message content
    if (message.toLowerCase().includes("portfolio") || message.toLowerCase().includes("holdings")) {
      response = responses.portfolio
    } else if (message.toLowerCase().includes("analyze") || message.toLowerCase().includes("analysis")) {
      response = responses.analysis
    } else if (message.toLowerCase().includes("strategy") || message.toLowerCase().includes("invest")) {
      response = responses.strategy
    } else if (message.toLowerCase().includes("risk") || message.toLowerCase().includes("safe")) {
      response = responses.risk
    }

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}

function generatePortfolioAdvice(user: any, context: any) {
  const portfolio = context.portfolio || []
  const balance = context.balance || 0

  if (portfolio.length === 0) {
    return `I see you haven't started building your portfolio yet! With your current balance of $${balance.toLocaleString()}, here are some beginner-friendly suggestions:

1. **Start with diversification** - Consider investing in different sectors like technology, healthcare, and consumer goods
2. **Blue-chip stocks** - Look at established companies like Apple (AAPL), Microsoft (MSFT), or Johnson & Johnson (JNJ)
3. **Dollar-cost averaging** - Invest a fixed amount regularly rather than all at once
4. **Keep some cash** - Maintain 10-20% of your portfolio in cash for opportunities

Remember, this is a simulation, so it's a great place to practice different strategies risk-free!`
  }

  const totalValue = portfolio.reduce((sum: number, holding: any) => sum + holding.quantity * holding.avgPrice, 0)
  const sectors = [...new Set(portfolio.map((p: any) => p.sector))].length

  return `Looking at your current portfolio:

**Portfolio Summary:**
- Total Holdings: ${portfolio.length} stocks
- Estimated Value: $${totalValue.toLocaleString()}
- Available Cash: $${balance.toLocaleString()}
- Sector Diversification: ${sectors} sectors

**Recommendations:**
${portfolio.length < 5 ? "• Consider adding more stocks for better diversification" : "• Good diversification with " + portfolio.length + " holdings"}
${balance > totalValue * 0.1 ? "• You have good cash reserves for new opportunities" : "• Consider keeping more cash for market opportunities"}
${sectors < 3 ? "• Try investing in different sectors to reduce risk" : "• Excellent sector diversification!"}

Would you like specific stock recommendations or portfolio rebalancing advice?`
}

function generateAnalysisAdvice(message: string) {
  return `Great question about analysis! Here are key factors to consider when analyzing stocks:

**Fundamental Analysis:**
• **Financial Health** - Look at revenue growth, profit margins, and debt levels
• **Valuation Metrics** - P/E ratio, P/B ratio, and PEG ratio
• **Competitive Position** - Market share and competitive advantages
• **Management Quality** - Track record and strategic vision

**Technical Analysis:**
• **Price Trends** - Moving averages and trend lines
• **Volume Patterns** - High volume confirms price movements
• **Support/Resistance** - Key price levels to watch
• **Chart Patterns** - Head & shoulders, triangles, etc.

**Key Questions to Ask:**
1. Is the company growing its revenue and profits?
2. How does it compare to competitors?
3. Is the stock price reasonable for its earnings?
4. What are the major risks and opportunities?

Would you like me to explain any of these concepts in more detail?`
}

function generateStrategyAdvice(message: string) {
  return `Excellent question about investment strategies! Here are some proven approaches:

**For Beginners:**
• **Buy and Hold** - Invest in quality companies for the long term
• **Dollar-Cost Averaging** - Invest fixed amounts regularly
• **Index Fund Approach** - Diversify across the entire market
• **Blue Chip Focus** - Start with established, stable companies

**Intermediate Strategies:**
• **Value Investing** - Buy undervalued stocks with strong fundamentals
• **Growth Investing** - Focus on companies with high growth potential
• **Dividend Investing** - Build income through dividend-paying stocks
• **Sector Rotation** - Move between sectors based on economic cycles

**Advanced Strategies:**
• **Momentum Trading** - Follow price trends and market momentum
• **Contrarian Investing** - Buy when others are selling
• **Options Strategies** - Use derivatives for hedging or income
• **Technical Analysis** - Trade based on chart patterns

**Key Principles:**
✓ Diversify across sectors and company sizes
✓ Never invest more than you can afford to lose
✓ Do your research before buying
✓ Have a clear exit strategy

Which strategy interests you most?`
}

function generateRiskAdvice(message: string) {
  return `Risk management is crucial for successful investing! Here's how to protect your portfolio:

**Types of Investment Risk:**
• **Market Risk** - Overall market declines
• **Company Risk** - Individual company problems
• **Sector Risk** - Industry-specific issues
• **Liquidity Risk** - Difficulty selling when needed

**Risk Management Strategies:**
1. **Diversification** - Don't put all eggs in one basket
   - Spread across different stocks, sectors, and asset classes
   - Consider company sizes (large, mid, small cap)

2. **Position Sizing** - Never risk too much on one trade
   - Limit individual positions to 5-10% of portfolio
   - Larger positions only for highest conviction plays

3. **Stop-Loss Orders** - Limit downside automatically
   - Set stops 10-20% below purchase price
   - Trailing stops can lock in gains

4. **Cash Reserves** - Keep some powder dry
   - Maintain 10-20% in cash for opportunities
   - Provides flexibility during market volatility

**Risk Assessment Questions:**
• How much can you afford to lose?
• What's your investment timeline?
• How will you react to a 20% portfolio decline?
• Do you understand what you're investing in?

Remember: Higher potential returns usually mean higher risk. The key is finding the right balance for your situation!`
}

function generateGeneralAdvice(message: string) {
  const responses = [
    `That's a great question! As your AI investment advisor, I'm here to help you navigate the stock market. 

Here are some key principles to keep in mind:
• **Education First** - Understanding what you're investing in is crucial
• **Start Small** - Begin with amounts you're comfortable potentially losing
• **Think Long-term** - The stock market rewards patience
• **Stay Disciplined** - Stick to your strategy, don't let emotions drive decisions

What specific aspect of investing would you like to explore further?`,

    `I'm glad you're taking an active interest in learning about investing! 

Some fundamental concepts every investor should understand:
• **Risk vs. Return** - Higher potential gains usually come with higher risk
• **Compound Interest** - Your money can grow exponentially over time
• **Market Volatility** - Prices go up and down, that's normal
• **Diversification** - Spreading risk across different investments

Is there a particular topic you'd like me to dive deeper into?`,

    `Excellent question! The stock market can seem complex, but it's really about companies and their value.

Key things to remember:
• **Companies Issue Stocks** - You're buying ownership in real businesses
• **Price Reflects Expectations** - Stock prices are based on future potential
• **Research Pays Off** - Understanding companies helps make better decisions
• **Patience is Key** - Good investments often take time to pay off

What would you like to learn more about? I can explain specific concepts, analyze strategies, or help with your portfolio!`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}
