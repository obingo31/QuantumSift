'use client'

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Search, Shield, AlertTriangle } from 'lucide-react';
import { Message, BugBounty } from './types';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
  bounties: BugBounty[];
}

export default function ChatInterface({ bounties }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [{
      id: 'welcome',
      content: "Hello! I'm your security assistant. You can ask me about:\n• Bug bounties\n• Security patterns\n• Vulnerability types\n• Best practices",
      role: 'assistant',
      timestamp: new Date().toISOString()
    }];
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Search in bounties
    const relevantBounties = bounties.filter(bounty => 
      bounty.title.toLowerCase().includes(input) ||
      bounty.description.toLowerCase().includes(input) ||
      bounty.platform.toLowerCase().includes(input)
    );

    // Feature-specific responses
    if (input.includes('help') || input.includes('feature')) {
      return `I can help you with:
• Searching bug bounties
• Understanding security patterns
• Analyzing vulnerabilities
• Suggesting best practices
• Finding similar issues

Just ask me anything related to smart contract security!`;
    }

    if (input.includes('clear') || input.includes('reset')) {
      setMessages([{
        id: 'welcome',
        content: "Chat history cleared! How can I help you?",
        role: 'assistant',
        timestamp: new Date().toISOString()
      }]);
      return "Chat history cleared! How can I help you?";
    }

    if (input.includes('vulnerability') || input.includes('attack')) {
      return `Common smart contract vulnerabilities include:
• Reentrancy attacks
• Integer overflow/underflow
• Access control issues
• Front-running
• Logic errors
• Oracle manipulation

Would you like to learn more about any specific vulnerability?`;
    }

    if (relevantBounties.length > 0) {
      return `I found ${relevantBounties.length} relevant bounties:
${relevantBounties.map(bounty => `
🔍 ${bounty.title}
✨ Platform: ${bounty.platform}
⚠️ Severity: ${bounty.severity}
📝 ${bounty.description}
`).join('\n')}`;
    }

    // Default response
    return `I couldn't find specific bounties matching your query. You can:
• Try different search terms
• Ask about specific vulnerabilities
• Request security best practices
• Search by platform or severity`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput(''); // Clear input immediately after submission
    setIsLoading(true);

    // Simulate bot thinking
    await new Promise(resolve => setTimeout(resolve, 1000));

    const botResponse: Message = {
      id: crypto.randomUUID(),
      content: generateBotResponse(userMessage.content),
      role: 'assistant',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, botResponse]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2">
        <Bot className="w-6 h-6 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Security Assistant</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[600px]">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                    <Bot className="w-4 h-4" />
                    Assistant
                  </div>
                )}
                <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about security, bounties, or vulnerabilities..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              !input.trim() || isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors duration-200`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setInput('Show me recent vulnerabilities')}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full flex items-center gap-1"
          >
            <AlertTriangle className="w-4 h-4" />
            Recent Vulnerabilities
          </button>
          <button
            onClick={() => setInput('Search critical bounties')}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full flex items-center gap-1"
          >
            <Search className="w-4 h-4" />
            Critical Bounties
          </button>
          <button
            onClick={() => setInput('Security best practices')}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full flex items-center gap-1"
          >
            <Shield className="w-4 h-4" />
            Best Practices
          </button>
        </div>
      </div>
    </div>
  );
}
