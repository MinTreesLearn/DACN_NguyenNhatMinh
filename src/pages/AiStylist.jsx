import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { aiStylistAPI, authAPI } from '../services/api';

const AiStylist = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    if (!user || !user.id) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    // Fetch chat history
    const fetchHistory = async () => {
      try {
        const response = await aiStylistAPI.getHistory(user.id);
        if (response.status === 'success' && response.data) {
          const formattedHistory = response.data.map((chat) => ({
            id: chat.id,
            text: chat.userMessage,
            sender: 'user',
            timestamp: new Date(chat.timestamp),
          }));

          // Add AI responses
          response.data.forEach((chat) => {
            formattedHistory.push({
              id: `ai-${chat.id}`,
              text: chat.aiResponse,
              sender: 'ai',
              timestamp: new Date(chat.timestamp),
              recommendations: chat.recommendations || [],
            });
          });

          // Sort by timestamp
          formattedHistory.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(formattedHistory);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading || !currentUser) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await aiStylistAPI.chat(currentUser.id, inputMessage);

      if (response.status === 'success' && response.data) {
        const aiMessage = {
          id: Date.now() + 1,
          text: response.data.aiResponse || response.data.message || 'I can help you find the perfect outfit!',
          sender: 'ai',
          timestamp: new Date(),
          recommendations: response.data.recommendations || [],
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    'Suggest a casual outfit for weekend',
    'What should I wear for a formal event?',
    'Recommend summer fashion items',
    'Show me trending styles',
  ];

  if (historyLoading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-luxury-gold text-xl">Loading AI Stylist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-luxury-gray/50 backdrop-blur-lg rounded-lg border border-luxury-gold/20 overflow-hidden"
          style={{ height: 'calc(100vh - 12rem)' }}
        >
          {/* Header */}
          <div className="bg-luxury-black/50 p-6 border-b border-luxury-gold/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-luxury-gold/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-luxury-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-playfair text-luxury-gold">AI Fashion Stylist</h1>
                <p className="text-gray-400 text-sm">Your personal style advisor</p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="overflow-y-auto p-6 space-y-4" style={{ height: 'calc(100% - 220px)' }}>
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <h3 className="text-xl text-gray-400 mb-2">Start a conversation</h3>
                <p className="text-gray-500 mb-6">Ask me anything about fashion and style!</p>

                {/* Quick Prompts */}
                <div className="max-w-md mx-auto space-y-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(prompt)}
                      className="block w-full text-left px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-gray-300 hover:border-luxury-gold/40 hover:text-luxury-gold transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        message.sender === 'user'
                          ? 'bg-luxury-gold text-luxury-black'
                          : 'bg-luxury-black/50 text-white border border-luxury-gold/20'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>

                      {/* Product Recommendations */}
                      {message.recommendations && message.recommendations.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-luxury-gold font-semibold text-sm">Recommended Products:</p>
                          {message.recommendations.map((product, idx) => (
                            <div
                              key={idx}
                              className="bg-luxury-gray/50 p-3 rounded cursor-pointer hover:bg-luxury-gray/70 transition-colors"
                              onClick={() => navigate(`/products/${product.id}`)}
                            >
                              <div className="flex items-center space-x-3">
                                {product.imageUrl && (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="font-semibold text-sm">{product.name}</p>
                                  <p className="text-luxury-gold text-sm">${product.price}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-luxury-black/50 text-white border border-luxury-gold/20 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-luxury-black/50 border-t border-luxury-gold/20">
            <div className="flex space-x-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about fashion styles, outfits, or recommendations..."
                className="flex-1 bg-luxury-gray border border-luxury-gold/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold resize-none"
                rows="2"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                className="px-6 bg-luxury-gold text-luxury-black font-semibold rounded-lg hover:bg-luxury-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AiStylist;
