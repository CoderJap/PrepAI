// app/api/chat/assistant/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    console.log("Chat request received");
    const { message, conversationHistory } = await req.json();

    console.log("User message:", message);

    // Build conversation context from history
    const context =
      conversationHistory
        ?.slice(-6) // Last 6 messages for context
        ?.map(
          (msg: any) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
        )
        .join("\n") || "";

    const systemPrompt = `You are a highly knowledgeable and friendly AI career coach and assistant. You specialize in:

- Interview preparation and practice
- Resume writing and optimization
- Career guidance and planning
- Job search strategies
- Salary negotiation
- Professional development
- Workplace advice
- Industry insights
- Technical skills development

Your personality:
- Friendly, encouraging, and supportive
- Professional but conversational
- Provide specific, actionable advice
- Use examples and practical tips
- Ask clarifying questions when helpful
- Be genuinely helpful with any career-related topic
- Also assist with general questions when relevant

Guidelines:
- Give detailed, helpful responses
- Be encouraging and build confidence
- Provide specific examples and tips
- Ask follow-up questions when appropriate
- If someone seems stressed about interviews or job search, be extra supportive
- For technical questions, provide clear explanations
- For general life questions, be helpful and supportive

Previous conversation context:
${context}

Current user message: ${message}

Respond naturally and helpfully:`;

    // Use the correct model name - try gemini-1.5-flash first (faster and free)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(systemPrompt);
    const response = await result.response.text();

    console.log("AI response generated");
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat failed:", error);

    // Enhanced fallback responses
    const lowerMessage = message.toLowerCase();
    let fallbackResponse;

    if (lowerMessage.includes("interview")) {
      fallbackResponse =
        "I'd be happy to help with interview preparation! Here are some key strategies:\n\n1. **Research thoroughly** - Study the company, role, and recent news\n2. **Practice STAR method** - Situation, Task, Action, Result for behavioral questions\n3. **Prepare examples** - Have 3-4 specific achievements ready to discuss\n4. **Ask thoughtful questions** - Show genuine interest in the role and company\n5. **Mock interviews** - Practice with friends or record yourself\n\nWhat specific aspect of interview prep would you like to focus on?";
    } else if (lowerMessage.includes("resume")) {
      fallbackResponse =
        "Here are the key elements for an outstanding resume:\n\n1. **ATS-friendly format** - Simple, clean layout that systems can read\n2. **Quantifiable achievements** - Use numbers, percentages, and metrics\n3. **Tailored keywords** - Match terms from the job description\n4. **Strong summary** - 2-3 lines highlighting your value proposition\n5. **Action verbs** - Start bullet points with impactful verbs\n6. **Relevance** - Focus on experience most relevant to target roles\n\nWhat specific part of your resume needs work?";
    } else if (
      lowerMessage.includes("career") ||
      lowerMessage.includes("job search")
    ) {
      fallbackResponse =
        "Career development is a journey! Here's how to approach it strategically:\n\n1. **Self-assessment** - Identify your skills, interests, and values\n2. **Market research** - Explore growing industries and roles\n3. **Skill building** - Invest in learning high-demand skills\n4. **Networking** - Build relationships in your target field\n5. **Personal brand** - Develop your online presence (LinkedIn, portfolio)\n6. **Goal setting** - Create short and long-term career objectives\n\nWhat stage of your career journey are you in right now?";
    } else if (
      lowerMessage.includes("salary") ||
      lowerMessage.includes("negotiat")
    ) {
      fallbackResponse =
        "Salary negotiation can feel intimidating, but here's how to approach it confidently:\n\n1. **Research market rates** - Use sites like Glassdoor, PayScale, levels.fyi\n2. **Document your value** - List your achievements and impact\n3. **Consider total compensation** - Benefits, equity, PTO, etc.\n4. **Practice your pitch** - Role-play the conversation\n5. **Time it right** - Usually after an offer, not during initial interviews\n6. **Be collaborative** - Frame it as finding a win-win solution\n\nAre you preparing for a specific negotiation?";
    } else if (
      lowerMessage.includes("anxiety") ||
      lowerMessage.includes("nervous") ||
      lowerMessage.includes("stress")
    ) {
      fallbackResponse =
        "It's completely normal to feel anxious about career challenges! Here are some strategies to help:\n\n1. **Preparation builds confidence** - The more you prepare, the less anxious you'll feel\n2. **Practice relaxation techniques** - Deep breathing, visualization\n3. **Reframe your mindset** - View interviews as conversations, not interrogations\n4. **Focus on what you can control** - Your preparation, attitude, and responses\n5. **Get support** - Talk to friends, mentors, or career counselors\n6. **Remember your worth** - You have valuable skills and experience\n\nWhat specific situation is causing you the most stress right now?";
    } else {
      fallbackResponse =
        "I'm here to help with your career and professional development! I can assist with:\n\n• Interview preparation and practice\n• Resume writing and optimization\n• Career planning and transitions\n• Job search strategies\n• Salary negotiation\n• Professional networking\n• Skill development\n• Workplace challenges\n\nI'm also happy to help with general questions and provide support. What would you like to talk about?";
    }

    return NextResponse.json({ response: fallbackResponse });
  }
}
