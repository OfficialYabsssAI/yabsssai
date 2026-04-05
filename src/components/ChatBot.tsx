import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Minus, Maximize2, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { playClickSound } from '../lib/sounds';

const SYSTEM_PROMPT = `You are Capy — the capybara mascot and chat agent for YabsssAI Solutions. You're chill, witty, and sharp. You genuinely care about helping people, but you keep it short. No essays. No fluff.
YOUR PERSONALITY:
- Warm, confident, and a little cheeky — like a cool friend who happens to know a lot about AI
- You drop occasional capybara humor (you're self-aware about being a capybara)
- You never overthink. Quick, punchy replies only. Aim for 8–15 words per response.
- You say "we" when talking about YabsssAI — you're part of the team
WHAT YOU KNOW (YabsssAI Services):
- Personal Integration: We plug AI into someone's daily workflow so they stop doing busywork
- Business Integration: AI-powered infrastructure that boosts business speed and efficiency by 10x
- The Chat Agent: AI concierges that connect to databases and handle customers in real-time (that's basically you!)
- Voice Agents: AI that handles inbound/outbound calls, qualifies leads, and talks like a human
- Multi-Agent Deployment (coming soon): Full AI squads working together to scale output
- Website Building: Custom, good-looking websites built for real business needs
YOUR MISSION:
- Welcome every visitor warmly — make them feel like they landed somewhere cool
- Give bite-sized advice on how AI can help them specifically (ask what they do if they haven't said)
- Be honest: if you don't know something, say so and direct them to the team
- Never be pushy. Let the value speak.
AI ADVICE STYLE:
- When someone mentions a business or problem, immediately connect it to an AI solution in 1–2 sentences
- Think: "What would save them the most time?" and say that
- Examples: cold outreach? → voice/chat agents. Too many admin tasks? → personal integration. Want to scale? → multi-agent.
WHEN SOMEONE WANTS TO WORK WITH US OR ASKS ABOUT PRICING:
- Keep it encouraging and warm — "Don't worry about prices, just ask the team directly"
- Always end with this exact line and link:
  👉 [Fill out our Inquiry Form here](https://tally.so/r/68RWdN)

RULES:
- Never write long paragraphs
- Never use bullet point lists in your replies — talk naturally
- Don't repeat yourself
- If greeted, greet back with personality before asking what brings them here
- You're Capy. Own it.
- WORD COUNT RULE: Keep your replies strictly between 8 to 15 words. Only go longer if absolutely necessary.`;

interface Message {
  role: 'user' | 'model';
  content: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Yo! I'm Capy. Just chilling here, but ready to help you supercharge your life with AI. What's on your mind?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        }))
      });

      const response = await chat.sendMessage({ message: userMessage });
      const text = response.text;
      
      if (text) {
        setMessages(prev => [...prev, { role: 'model', content: text }]);
      }
    } catch (error) {
      console.error('Capy is having a brain freeze:', error);
      setMessages(prev => [...prev, { role: 'model', content: "My bad, I had a bit of a brain freeze. Can you try that again? If I'm still acting weird, just fill out our [Inquiry Form](https://tally.so/r/68RWdN)." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[90vw] sm:w-[400px] h-[500px] bg-navy-light rounded-3xl shadow-2xl border border-accent/20 flex flex-col overflow-hidden backdrop-blur-xl heartbeat-cyan"
          >
            {/* Header */}
            <div className="bg-navy-dark p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                  <img src="/NoBackgroundCapybara.png" alt="Capy" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Chat with Capy</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                    <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Chilling Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { playClickSound(); setIsMinimized(true); }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { playClickSound(); setIsOpen(false); }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-4 rounded-2xl text-base leading-relaxed shadow-sm heartbeat-cyan capy-texture ${
                      msg.role === 'user' 
                        ? 'bg-navy-dark text-white rounded-tr-none' 
                        : 'bg-navy-light text-cream rounded-tl-none border border-accent/20'
                    }`}
                  >
                    <div className={`relative z-10 markdown-body prose prose-sm max-w-none ${msg.role === 'model' ? 'prose-invert' : ''}`}>
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-navy-light text-cream p-4 rounded-2xl rounded-tl-none border border-accent/20 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-cream/40 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-cream/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-cream/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-navy-dark border-t border-accent/10">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Capy anything..."
                  className="w-full bg-navy-light text-cream border-none rounded-2xl px-4 py-3 text-base focus:ring-2 focus:ring-accent/20 transition-all outline-none pr-12 heartbeat-cyan placeholder:text-cream/40"
                />
                <button
                  onClick={() => {
                    playClickSound();
                    handleSend();
                  }}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-accent text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-center text-cream/40 font-medium">
                Powered by YabsssAI • Capy is always chill
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <div className="relative group">
        <AnimatePresence>
          {(!isOpen || isMinimized) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="absolute bottom-20 right-0 mb-2 bg-accent text-cream px-4 py-2 rounded-xl shadow-lg border border-white/20 text-xs font-bold whitespace-nowrap heartbeat-accent pointer-events-none"
            >
              chat with capy!
              <div className="absolute -bottom-1 right-6 w-2 h-2 bg-accent border-b border-r border-white/20 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClickSound();
            if (isMinimized) {
              setIsMinimized(false);
            } else {
              setIsOpen(!isOpen);
            }
          }}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
            isOpen ? 'bg-navy-dark text-white' : 'bg-accent text-white'
          }`}
        >
          {isOpen && !isMinimized ? (
            <X className="w-8 h-8" />
          ) : (
            <div className="relative">
              <img src="/NoBackgroundCapybara.png" alt="Capy" className="w-10 h-10 object-contain" />
              {!isOpen && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-navy-dark flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                </span>
              )}
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ChatBot;
