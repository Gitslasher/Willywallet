// Gemini API integration

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Using gemini-1.5-pro as gemini-pro has been deprecated
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

if (!GEMINI_API_KEY) {
  console.warn('⚠️ Missing VITE_GEMINI_API_KEY environment variable. Gemini API features will not work.');
}

/**
 * Generate a response using Gemini API with user's financial data
 * @param {string} userMessage - The user's message
 * @param {Object} userData - User's financial data (transactions, budgets, goals)
 * @returns {Promise<string>} - The AI response
 */
export const generateGeminiResponse = async (userMessage, userData) => {
  if (!GEMINI_API_KEY) {
    return "I'm sorry, but the Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your environment variables.";
  }

  try {
    // Format user data for context
    const context = formatUserDataForContext(userData);

    // Create the prompt with user data context
    const systemPrompt = `You are a helpful financial assistant for a personal finance app called Monarch Money. 
You have access to the user's financial data and should provide helpful, accurate, and actionable advice.

User's Financial Data:
${context}

Instructions:
- Be concise and helpful
- Use specific numbers from the user's data when relevant
- Provide actionable suggestions
- Be friendly and supportive
- If asked about data you don't have, say so politely
- Focus on budgets, goals, transactions, and spending patterns

User's question: ${userMessage}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error("Unexpected response format from Gemini API");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return `I'm sorry, I encountered an error: ${error.message}. Please try again later.`;
  }
};

/**
 * Format user data into a readable context string for the AI
 */
function formatUserDataForContext(userData) {
  const { transactions, budgets, goals, summary } = userData;

  let context = "";

  // Summary statistics
  if (summary) {
    context += `Financial Summary:
- Total Income: $${summary.totalIncome.toLocaleString()}
- Total Expenses: $${summary.totalExpenses.toLocaleString()}
- Net Worth: $${summary.netWorth.toLocaleString()}
- Number of Transactions: ${summary.transactionCount}

`;
  }

  // Recent transactions
  if (transactions && transactions.length > 0) {
    const recentTransactions = transactions.slice(0, 10);
    context += `Recent Transactions (last 10):
${recentTransactions.map(t => 
  `- ${t.merchant}: ${t.amount < 0 ? '-' : '+'}$${Math.abs(t.amount).toLocaleString()} (${t.category}) on ${t.date}`
).join('\n')}

`;
  }

  // Budgets
  if (budgets && budgets.length > 0) {
    context += `Budgets:
${budgets.map(b => 
  `- ${b.name}: Spent $${b.spent.toLocaleString()} of $${b.budget.toLocaleString()} (${b.percentage}%)${b.overBudget ? ' - OVER BUDGET' : ''} - $${b.remaining.toLocaleString()} remaining`
).join('\n')}

`;
  }

  // Goals
  if (goals && goals.length > 0) {
    context += `Savings Goals:
${goals.map(g => 
  `- ${g.name}: Saved $${g.saved.toLocaleString()} of $${g.target.toLocaleString()} (${g.percentage}%) - $${g.remaining.toLocaleString()} remaining - Due: ${g.dueDate}`
).join('\n')}

`;
  }

  return context || "No financial data available.";
}

