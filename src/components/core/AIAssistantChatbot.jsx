import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Sparkles, 
  User as UserIcon, 
  RefreshCw, 
  FileText, 
  AlertTriangle, 
  TrendingUp,
  Bookmark,
  X,
  Minimize2,
  Maximize2
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// Robust text extraction function
const safeText = (value, defaultText = "") => {
  if (value === null || value === undefined) return defaultText;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    if (value.summary && typeof value.summary === 'string') return value.summary;
    if (value.text && typeof value.text === 'string') return value.text;
    if (value.content && typeof value.content === 'string') return value.content;
    if (value.analysis && typeof value.analysis === 'string') return value.analysis;
    if (value.rationale && typeof value.rationale === 'string') return value.rationale;
    if (value.response && typeof value.response === 'string') return value.response;
    if (value.message && typeof value.message === 'string') return value.message;
    
    // Try to extract the first string value from the object
    for (const key in value) {
      if (typeof value[key] === 'string') return value[key];
    }
    
    try {
      return JSON.stringify(value);
    } catch (e) {
      return defaultText;
    }
  }
  return String(value);
};

export default function AIAssistantChatbot({ isOpen, onToggle }) {
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contextData, setContextData] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollAreaRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen && !contextData) {
      loadInitialContext();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current && isOpen) {
      setTimeout(() => {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }, 100);
    }
  }, [conversation, isOpen]);

  const loadInitialContext = async () => {
    try {
      const user = await User.me();
      
      // Load user context data
      const [userPrefs, watchlistData, recentAlerts, recentAssets] = await Promise.all([
        base44.entities.UserPreference.filter({ created_by: user.email }),
        base44.entities.TickerSnapshot.list('-last_updated', 10),
        base44.entities.Alert.list('-created_date', 10),
        base44.entities.ResearchAsset.list('-created_date', 5)
      ]);

      setContextData({
        userPrefs: userPrefs[0] || {},
        watchlist: watchlistData,
        recentAlerts: recentAlerts,
        recentAssets: recentAssets,
        user: user
      });
    } catch (error) {
      console.error('Error loading context:', error);
    }
  };

  const buildContextPrompt = (userQuestion) => {
    if (!contextData) return userQuestion;

    const contextInfo = `
VIREON CONTEXT DATA (for your reference):

User Profile:
- Email: ${contextData.user?.email}
- Watchlist Tickers: ${contextData.userPrefs?.watchlist_tickers?.join(', ') || 'None set'}
- Preferred Sectors: ${contextData.userPrefs?.preferred_sectors?.join(', ') || 'Not specified'}

Recent Market Data:
${contextData.watchlist?.slice(0, 5).map(ticker => 
  `- ${ticker.ticker}: $${ticker.current_price} (${ticker.change_percent > 0 ? '+' : ''}${ticker.change_percent}%)`
).join('\n') || '- No recent ticker data'}

Recent Alerts (Last 5):
${contextData.recentAlerts?.slice(0, 5).map(alert => 
  `- ${alert.alert_type}: ${alert.content?.substring(0, 80)}...`
).join('\n') || '- No recent alerts'}

Recent Research Assets:
${contextData.recentAssets?.slice(0, 3).map(asset => 
  `- ${asset.title}: ${asset.ai_summary?.substring(0, 60)}...`
).join('\n') || '- No recent research'}

USER QUESTION: ${userQuestion}

---
You are Vireon's Alpha Assistant, a sophisticated financial AI assistant. Respond as a professional institutional analyst would - concise, data-driven, and actionable. Reference the context data above when relevant, but don't repeat it verbatim. Use markdown formatting for clarity. Always cite your data sources when possible.
`;

    return contextInfo;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      role: "user", 
      content: input,
      timestamp: new Date().toISOString(),
      actions: []
    };
    
    setConversation(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const contextualPrompt = buildContextPrompt(currentInput);
      const response = await InvokeLLM({
        prompt: contextualPrompt,
        add_context_from_internet: true
      });

      // Use safeText to handle any response format
      const content = safeText(response, "Sorry, I could not process the response.");

      const aiMessage = { 
        role: "ai", 
        content: content,
        timestamp: new Date().toISOString(),
        actions: generateActionButtons(content, currentInput)
      };
      
      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { 
        role: "ai", 
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
        actions: []
      };
      setConversation(prev => [...prev, errorMessage]);
      console.error("Error calling AI:", error);
    }

    setIsLoading(false);
  };

  const generateActionButtons = (aiResponse, userQuestion) => {
    const actions = [];
    
    // Always offer to save to vault
    actions.push({
      label: "Save to Vault",
      icon: FileText,
      action: () => saveToVault(aiResponse, userQuestion)
    });

    // Check for tickers mentioned and offer watchlist add
    const tickerMatches = aiResponse.match(/\$?[A-Z]{1,5}(?:\s|$|\.|\,)/g);
    if (tickerMatches) {
      actions.push({
        label: "Add to Watchlist",
        icon: TrendingUp,
        action: () => addToWatchlist(tickerMatches)
      });
    }

    // Check for urgent/alert keywords
    if (aiResponse.toLowerCase().includes('alert') || aiResponse.toLowerCase().includes('risk') || aiResponse.toLowerCase().includes('breaking')) {
      actions.push({
        label: "Create Alert",
        icon: AlertTriangle,
        action: () => createAlert(aiResponse)
      });
    }

    return actions;
  };

  const saveToVault = async (content, question) => {
    try {
      await base44.entities.ResearchAsset.create({
        title: `AI Chat: ${question.substring(0, 50)}...`,
        content: content,
        asset_type: 'Chat Log',
        source: 'Alpha Assistant',
        ai_summary: content.substring(0, 200) + '...'
      });
      
      // Add success feedback
      setConversation(prev => [...prev, {
        role: "system",
        content: "✅ Conversation saved to Research Vault",
        timestamp: new Date().toISOString(),
        actions: []
      }]);
    } catch (error) {
      console.error('Error saving to vault:', error);
    }
  };

  const addToWatchlist = async (tickers) => {
    try {
      if (!contextData?.userPrefs?.id) return;
      
      const cleanTickers = tickers.map(t => t.replace(/[^A-Z]/g, '')).filter(t => t.length > 0);
      const existingTickers = contextData.userPrefs.watchlist_tickers || [];
      const newTickers = [...new Set([...existingTickers, ...cleanTickers])];
      
      await base44.entities.UserPreference.update(contextData.userPrefs.id, {
        watchlist_tickers: newTickers
      });
      
      setConversation(prev => [...prev, {
        role: "system",
        content: `✅ Added ${cleanTickers.join(', ')} to your watchlist`,
        timestamp: new Date().toISOString(),
        actions: []
      }]);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const createAlert = async (content) => {
    try {
      await base44.entities.Alert.create({
        content: content.substring(0, 500),
        alert_type: 'Sentiment',
        priority: 'High',
        status: 'New'
      });
      
      setConversation(prev => [...prev, {
        role: "system",
        content: "✅ Alert created successfully",
        timestamp: new Date().toISOString(),
        actions: []
      }]);
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const quickPrompts = [
    "What's the market sentiment today?",
    "Show me my watchlist risks",
    "Recent Fed-related news",
    "Tech sector outlook"
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed bottom-4 right-4 z-50 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 text-sm">Alpha Assistant</h3>
              <p className="text-xs text-gray-400">Your AI research partner</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-8 h-8 text-gray-400 hover:text-gray-200"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="w-8 h-8 text-gray-400 hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Chat Area */}
            <ScrollArea className="flex-1 h-[440px] p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {conversation.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-200 mb-2">How can I help you today?</h4>
                    <p className="text-xs text-gray-400 mb-4">Ask me about your portfolio, market trends, or any financial question</p>
                    
                    <div className="space-y-1">
                      {quickPrompts.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => setInput(prompt)}
                          className="w-full text-left justify-start text-xs text-gray-300 hover:bg-gray-700 h-8"
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {conversation.map((msg, index) => (
                  <div key={index} className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : ''}`}>
                    {msg.role === 'ai' && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[280px] text-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-2xl px-3 py-2' 
                        : msg.role === 'system'
                        ? 'bg-green-900/30 text-green-300 rounded-lg px-2 py-1 text-xs'
                        : 'bg-gray-700 text-gray-100 rounded-2xl px-3 py-2'
                    }`}>
                      {msg.role === 'system' ? (
                        <span>{msg.content}</span>
                      ) : (
                        <>
                          <ReactMarkdown className="prose prose-sm prose-invert max-w-none text-xs leading-relaxed">
                            {msg.content}
                          </ReactMarkdown>
                          
                          {msg.actions && msg.actions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-600">
                              {msg.actions.map((action, idx) => (
                                <Button
                                  key={idx}
                                  variant="ghost"
                                  size="sm"
                                  onClick={action.action}
                                  className="bg-gray-600/50 hover:bg-gray-600 text-gray-200 text-xs h-6 px-2"
                                >
                                  <action.icon className="w-3 h-3 mr-1" />
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                      
                      <div className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                    
                    {msg.role === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 mt-1">
                        <UserIcon className="w-3 h-3 text-gray-300" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-700 rounded-2xl px-3 py-2 flex items-center gap-2">
                      <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                      <span className="text-gray-300 text-xs">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input Area */}
            <div className="p-4 border-t border-gray-700">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask about your portfolio, market trends..."
                  className="pr-12 min-h-[40px] max-h-[80px] bg-gray-700 border-gray-600 text-gray-100 text-sm resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white border-0 w-8 h-8 p-0"
                  size="icon"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Press Enter to send • Shift+Enter for new line</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}