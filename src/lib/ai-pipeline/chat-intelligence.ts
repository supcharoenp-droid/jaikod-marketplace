// Simple message interface that works with both lib/chat and realtimeChatService
interface SimpleChatMessage {
    text: string
    sender_id?: string
    senderId?: string
    [key: string]: any
}

// ==========================================
// CONFIGURATION
// ==========================================
// Using gpt-4o-mini for speed and cost-effectiveness in chat
const CHAT_MODEL = 'gpt-4o-mini'

export interface ChatIntelligenceOutput {
    summary: {
        key_points: string[]
        current_status: string
        next_action: string
    }
    lead_analysis: {
        score: number // 0-100
        category: 'Cold' | 'Warm' | 'Hot'
        reason: string
        probability_to_close: number // 0-1
    }
    suggested_replies: string[]
    intent: 'buy' | 'sell' | 'inquire' | 'negotiate' | 'schedule_meetup' | 'chit_chat'
    safety_check: {
        is_safe: boolean
        warning_message?: string
    }
}

const SYSTEM_PROMPT = `
You are 'JaiKod Intelligence', an expert AI Sales Assistant for a Thai C2C Marketplace.
Analyze the conversation history between a Buyer and a Seller.

Your Goal: Help the user (based on their role) close the deal faster and safer.
Language: Response MUST be in Thai (except explicit technical terms).

Output JSON Format strictly:
{
  "summary": {
    "key_points": ["point 1", "point 2"],
    "current_status": "Brief status (e.g. Negotiating Price)",
    "next_action": "Recommended next step"
  },
  "lead_analysis": {
    "score": 0-100,
    "category": "Cold" | "Warm" | "Hot",
    "reason": "Why this score?",
    "probability_to_close": 0.0-1.0
  },
  "suggested_replies": ["Reply option 1", "Reply option 2", "Reply option 3"],
  "intent": "buy" | "sell" | "inquire" | "negotiate" | "schedule_meetup" | "chit_chat",
  "safety_check": {
    "is_safe": boolean,
    "warning_message": "Warning if user tries to go off-platform or suspicious behavior"
  }
}

Rules:
1. If sensitive info (bank account, line id, phone) is shared too early -> Warn user.
2. If negotiation is stuck -> Suggest a compromise.
3. If intent is 'schedule_meetup' -> Suggest specific Safe Zones (e.g. Malls, BTS/MRT).
`

export async function analyzeChatWithAI(
    messages: SimpleChatMessage[],
    userRole: 'buyer' | 'seller',
    productContext?: any
): Promise<ChatIntelligenceOutput> {

    try {
        const conversationText = messages.map(m =>
            `[${m.sender_id === 'me' ? 'Me' : 'Partner'}]: ${m.text}`
        ).join('\n')

        const payload = {
            model: CHAT_MODEL,
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: `
                    My Role: ${userRole}
                    Product: ${productContext?.title || 'Unknown Item'} Price: ${productContext?.price || '?'}
                    
                    Conversation History:
                    ${conversationText}
                    `
                }
            ],
            response_format: { type: 'json_object' },
            max_tokens: 1000,
            temperature: 0.7
        }

        // Call OpenAI API via direct fetch (similar to layer2-intelligence)
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw new Error(`AI API Error: ${response.statusText}`)
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || '{}'

        return JSON.parse(content) as ChatIntelligenceOutput

    } catch (error) {
        console.error('Chat Intelligence Failed:', error)
        // Fallback Mock Data
        return {
            summary: {
                key_points: ['System unavailable'],
                current_status: 'Error',
                next_action: 'Continue manually'
            },
            lead_analysis: {
                score: 50,
                category: 'Warm',
                reason: 'AI Unavailable',
                probability_to_close: 0.5
            },
            suggested_replies: ['สวัสดีครับ', 'สินค้ายังอยู่ไหมครับ'],
            intent: 'inquire',
            safety_check: { is_safe: true }
        }
    }
}
