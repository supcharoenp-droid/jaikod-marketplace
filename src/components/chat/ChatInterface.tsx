/**
 * AI-Powered Chat Component
 * แชทระหว่างผู้ซื้อและผู้ขาย พร้อม AI ช่วยแนะนำคำตอบ
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import {
    suggestResponse,
    getContextualQuickReplies,
    analyzeSentiment,
    type QuickReply,
    type SuggestedResponse,
    type ChatMessage
} from '@/lib/ai-chat-assistant';

interface ChatInterfaceProps {
    productId: string;
    productName: string;
    productPrice: number;
    productStatus: 'available' | 'reserved' | 'sold';
    currentUserId: string;
    currentUserRole: 'buyer' | 'seller';
    otherUserId: string;
    otherUserName: string;
}

export default function ChatInterface({
    productId,
    productName,
    productPrice,
    productStatus,
    currentUserId,
    currentUserRole,
    otherUserId,
    otherUserName
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [showQuickReplies, setShowQuickReplies] = useState(true);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<SuggestedResponse[]>([]);
    const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // โหลด Quick Replies
    useEffect(() => {
        const replies = getContextualQuickReplies(currentUserRole);
        setQuickReplies(replies);
    }, [currentUserRole]);

    // Scroll to bottom เมื่อมีข้อความใหม่
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // วิเคราะห์ข้อความล่าสุดและแนะนำคำตอบ
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];

            // ถ้าข้อความล่าสุดไม่ใช่ของเรา ให้แนะนำคำตอบ
            if (lastMessage.senderId !== currentUserId) {
                const suggested = suggestResponse(
                    lastMessage.message,
                    currentUserRole,
                    {
                        productStatus,
                        productPrice,
                        hasNegotiation: true
                    }
                );
                setSuggestions(suggested);
                setShowSuggestions(suggested.length > 0);
            }
        }
    }, [messages, currentUserId, currentUserRole, productStatus, productPrice]);

    // ส่งข้อความ
    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            senderId: currentUserId,
            senderRole: currentUserRole,
            message: inputText,
            timestamp: new Date(),
            productId
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        setShowSuggestions(false);

        // TODO: ส่งข้อความไปยัง Backend/Firebase
    };

    // ใช้ Quick Reply
    const handleQuickReply = (reply: QuickReply) => {
        setInputText(reply.text);
        setShowQuickReplies(false);
    };

    // ใช้ Suggested Response
    const handleUseSuggestion = (suggestion: SuggestedResponse) => {
        setInputText(suggestion.text);
        setShowSuggestions(false);
    };

    // ใช้ Variation
    const handleUseVariation = (variation: string) => {
        setInputText(variation);
        setShowSuggestions(false);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        {currentUserRole === 'buyer' ? '🛍️' : '🏪'}
                    </div>
                    <div className="flex-1">
                        <h2 className="font-bold">{otherUserName}</h2>
                        <p className="text-sm opacity-90">{productName}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold">฿{productPrice.toLocaleString()}</div>
                        <div className="text-xs opacity-90">
                            {productStatus === 'available' && '✅ พร้อมขาย'}
                            {productStatus === 'reserved' && '⏳ จองแล้ว'}
                            {productStatus === 'sold' && '❌ ขายแล้ว'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    const sentiment = analyzeSentiment(msg.message);

                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'bg-white border border-gray-200'
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs opacity-70">
                                        {msg.timestamp.toLocaleTimeString('th-TH', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    {!isMe && sentiment.sentiment !== 'neutral' && (
                                        <span className="text-xs">
                                            {sentiment.sentiment === 'positive' ? '😊' : '😟'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* AI Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="border-t bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🤖</span>
                        <span className="font-semibold text-sm">AI แนะนำคำตอบ:</span>
                    </div>

                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="mb-3 last:mb-0">
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-200">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                            {suggestion.category}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            ความมั่นใจ: {(suggestion.confidence * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleUseSuggestion(suggestion)}
                                        className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full hover:bg-purple-600 transition-colors"
                                    >
                                        ใช้คำตอบนี้
                                    </button>
                                </div>

                                <p className="text-sm mb-2 whitespace-pre-wrap">{suggestion.text}</p>

                                {suggestion.tips && (
                                    <p className="text-xs text-blue-600 mb-2">{suggestion.tips}</p>
                                )}

                                {suggestion.variations.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 mb-1">ตัวเลือกอื่น:</p>
                                        <div className="space-y-1">
                                            {suggestion.variations.map((variation: string, vIndex: number) => (
                                                <button
                                                    key={vIndex}
                                                    onClick={() => handleUseVariation(variation)}
                                                    className="block w-full text-left text-xs text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-2 py-1 rounded transition-colors"
                                                >
                                                    • {variation}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Replies */}
            {showQuickReplies && quickReplies.length > 0 && (
                <div className="border-t bg-white p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">คำตอบด่วน:</span>
                        <button
                            onClick={() => setShowQuickReplies(false)}
                            className="ml-auto text-xs text-gray-400 hover:text-gray-600"
                        >
                            ซ่อน
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {quickReplies.slice(0, 6).map((reply) => (
                            <button
                                key={reply.id}
                                onClick={() => handleQuickReply(reply)}
                                className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-purple-100 text-sm rounded-full transition-colors border border-gray-200 hover:border-purple-300"
                            >
                                <span>{reply.icon}</span>
                                <span className="text-xs">{reply.text.substring(0, 30)}...</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="border-t bg-white p-4">
                <div className="flex gap-2">
                    {!showQuickReplies && (
                        <button
                            onClick={() => setShowQuickReplies(true)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            title="แสดงคำตอบด่วน"
                        >
                            ⚡
                        </button>
                    )}

                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="พิมพ์ข้อความ (CHAT-INTERFACE-DEBUG)..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ส่ง
                    </button>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <span>💡</span>
                    <span>
                        {currentUserRole === 'seller'
                            ? 'AI จะแนะนำคำตอบมืออาชีพให้คุณอัตโนมัติ'
                            : 'ใช้คำตอบด่วนเพื่อความสะดวก'}
                    </span>
                </div>
            </div>
        </div>
    );
}
