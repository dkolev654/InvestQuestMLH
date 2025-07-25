import { type NextRequest, NextResponse } from "next/server"

// Note: In a real implementation, you would use the actual Gemini API
// For this demo, we'll simulate responses based on common investing questions

const INVESTMENT_RESPONSES = {
  "stocks and bonds": `Great question! Here's the key difference:

**Stocks** 📈
- You own a piece of a company
- Higher potential returns but more risky
- Value goes up and down with company performance
- Example: Buying Apple stock makes you a tiny owner of Apple

**Bonds** 🏦
- You're lending money to a company or government
- Lower returns but more stable
- They pay you interest over time
- Example: Government bonds are very safe but grow slowly

Think of stocks like planting a tree (could grow huge or die) and bonds like a savings account (steady but slow growth)!`,

  overvalued: `Good question! Here are signs a stock might be overvalued:

**Key Indicators:**
- **P/E Ratio**: If it's much higher than similar companies
- **Hype vs Reality**: Stock price based on excitement, not actual profits
- **Rapid Price Increases**: Going up too fast without good news

**Example**: If a company's stock doubled but their profits stayed the same, it might be overvalued.

**What to do**: Research the company's actual performance, not just the stock price. Look at revenue, profits, and future plans!`,

  "dollar-cost averaging": `Dollar-cost averaging is a smart strategy! 🎯

**How it works:**
- Invest the same amount regularly (like $100 every month)
- Sometimes you buy when prices are high, sometimes when they're low
- Over time, you get an average price

**Benefits:**
- Reduces impact of market timing
- Less stressful than trying to "time the market"
- Builds good investing habits

**Example**: Instead of investing $1,200 all at once, invest $100 every month for a year. This way you don't worry about picking the "perfect" time!`,

  "individual stocks vs etfs": `Great question! Both have pros and cons:

**Individual Stocks** 🎯
- Higher potential returns if you pick winners
- More control over your investments
- Requires more research and time
- Higher risk (one bad company can hurt you)

**ETFs (Exchange-Traded Funds)** 🌍
- Instant diversification (owns many stocks)
- Lower risk because it's spread out
- Less research needed
- Lower potential returns than picking great individual stocks

**My recommendation for beginners**: Start with ETFs to learn, then gradually add individual stocks as you gain experience!`,

  "how much invest": `Smart question! Here's a beginner-friendly approach:

**The 50/30/20 Rule:**
- 50% for needs (rent, food, etc.)
- 30% for wants (entertainment, etc.)
- 20% for savings and investing

**Emergency Fund First**: Save 3-6 months of expenses before investing

**Start Small**: Even $25-50/month is great for learning!

**Never invest money you need soon**: Only invest money you won't need for at least 5 years.

Remember: It's better to start small and learn than to wait for the "perfect" amount! 🚀`,

  "pe ratio": `P/E ratio is super important! Let me break it down:

**P/E = Price-to-Earnings Ratio**
- P = Current stock price
- E = Company's earnings (profit) per share

**What it means:**
- Shows how much investors are willing to pay for $1 of company earnings
- Lower P/E might mean the stock is cheaper
- Higher P/E might mean investors expect big growth

**Example**: If a stock costs $100 and the company earns $5 per share, P/E = 20. You're paying $20 for every $1 of earnings.

**Rule of thumb**: Compare P/E ratios within the same industry, not across different types of companies!`,

  dividends: `Dividends are like getting paid to own stocks! 💰

**What are dividends:**
- Regular payments companies make to shareholders
- Usually paid quarterly (every 3 months)
- Not all companies pay dividends

**Example**: If you own 100 shares of a company that pays $1 per share annually, you get $100 per year!

**Types of companies that pay dividends:**
- Mature, stable companies (like Coca-Cola)
- Utilities and banks often pay good dividends

**Dividend Yield**: Annual dividend ÷ stock price
- 3-5% is considered good
- Be careful of yields above 8% (might be risky)

**Pro tip**: You can reinvest dividends to buy more shares automatically!`,

  "long-term strategy": `Long-term investing is the way to go! Here's why:

**Best Long-term Strategies:**

**1. Buy and Hold** 📈
- Buy quality companies and hold for years
- Historically, markets go up over long periods
- Less stress, fewer fees

**2. Dollar-Cost Averaging**
- Invest regularly regardless of market conditions
- Smooths out market volatility

**3. Diversification**
- Don't put all eggs in one basket
- Mix of stocks, sectors, maybe some bonds

**4. Focus on Quality**
- Companies with strong profits and good management
- Think: "Would I want to own this business for 10 years?"

**Warren Buffett's advice**: "Time in the market beats timing the market!"

The key is patience and consistency! 🎯`,
}

function findBestResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Check for key phrases and return appropriate responses
  if (lowerMessage.includes("stock") && lowerMessage.includes("bond")) {
    return INVESTMENT_RESPONSES["stocks and bonds"]
  }
  if (lowerMessage.includes("overvalued") || lowerMessage.includes("expensive")) {
    return INVESTMENT_RESPONSES["overvalued"]
  }
  if (lowerMessage.includes("dollar") && lowerMessage.includes("cost")) {
    return INVESTMENT_RESPONSES["dollar-cost averaging"]
  }
  if (lowerMessage.includes("etf") || (lowerMessage.includes("individual") && lowerMessage.includes("stock"))) {
    return INVESTMENT_RESPONSES["individual stocks vs etfs"]
  }
  if (lowerMessage.includes("how much") && lowerMessage.includes("invest")) {
    return INVESTMENT_RESPONSES["how much invest"]
  }
  if (lowerMessage.includes("p/e") || lowerMessage.includes("price to earnings")) {
    return INVESTMENT_RESPONSES["pe ratio"]
  }
  if (lowerMessage.includes("dividend")) {
    return INVESTMENT_RESPONSES["dividends"]
  }
  if (lowerMessage.includes("long-term") || lowerMessage.includes("strategy")) {
    return INVESTMENT_RESPONSES["long-term strategy"]
  }

  // Default responses for common topics
  if (lowerMessage.includes("risk")) {
    return `Risk management is crucial! 🛡️

**Key principles:**
- Never invest more than you can afford to lose
- Diversify across different stocks and sectors
- Have an emergency fund before investing
- Start with less risky investments as a beginner

Remember: Higher potential returns usually come with higher risk. The key is finding the right balance for your situation!`
  }

  if (lowerMessage.includes("start") || lowerMessage.includes("beginner")) {
    return `Welcome to investing! 🎉 Here's how to start:

**Step 1**: Build an emergency fund (3-6 months expenses)
**Step 2**: Start with broad market ETFs (like S&P 500)
**Step 3**: Learn by doing - start small!
**Step 4**: Gradually add individual stocks as you learn

**Best beginner resources:**
- Read company annual reports
- Follow reputable financial news
- Practice with simulators (like this one!)

You're already on the right track by learning here! Keep asking questions! 🚀`
  }

  if (lowerMessage.includes("market") && lowerMessage.includes("crash")) {
    return `Market crashes are scary but normal! 📉➡️📈

**Historical fact**: The market has always recovered from crashes over time.

**What to do during crashes:**
- Don't panic sell (you lock in losses)
- Consider it a "sale" - good companies at lower prices
- Keep investing regularly (dollar-cost averaging)
- Focus on long-term goals

**Famous quote**: "Be fearful when others are greedy, and greedy when others are fearful" - Warren Buffett

Crashes are actually opportunities for long-term investors! 💪`
  }

  // Generic helpful response
  return `That's a great question! 🤔 

I'm here to help you learn about investing. I can explain concepts like:
- Stock basics and how trading works
- Risk management and diversification  
- Different investment strategies
- How to analyze companies
- Market terminology

Feel free to ask me anything specific about investing, stocks, or building wealth. What would you like to learn more about?

**Tip**: The more specific your question, the better I can help! 🎯`
}

export async function POST(request: NextRequest) {
  try {
    const { message, userContext } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // In a real implementation, you would call the Gemini API here
    // For now, we'll use our predefined responses
    const response = findBestResponse(message)

    // Add some personalization based on user context
    let personalizedResponse = response
    if (userContext?.level > 1) {
      personalizedResponse += `\n\n*Great job reaching Level ${userContext.level}! You're making excellent progress! 🌟*`
    }

    return NextResponse.json({
      response: personalizedResponse,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
