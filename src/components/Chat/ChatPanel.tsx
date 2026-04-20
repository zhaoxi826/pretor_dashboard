import { useState } from 'react';

import { MessageSquare, Activity, Terminal, ChevronRight } from 'lucide-react';
import apiClient from '../../api/client';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  eventId?: string;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I am Pretor Assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Assuming a token might be needed, apiClient should handle it if set
      const response = await apiClient.post('/api/v1/adapter/client', {
        message: userMessage.text
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: typeof response.data.message === 'string' && response.data.message.includes('-')
              ? "Task has been created." // It's an event ID
              : response.data.message || "I received your message.",
        eventId: typeof response.data.message === 'string' && response.data.message.includes('-') ? response.data.message : undefined,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // If we got an event_id, we could potentially open a websocket to listen to its stream
      if (aiMessage.eventId) {
        console.log(`Open WS to track event: ${aiMessage.eventId}`);
        // Implement WS tracking if needed
      }

    } catch (error) {
      console.error("Error sending message", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Sorry, I encountered an error communicating with the server.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="h-14 border-b border-slate-200 bg-white flex items-center px-6 shadow-sm z-10">
        <MessageSquare size={18} className="text-blue-600 mr-3" />
        <h1 className="font-semibold text-slate-800">Pretor Assistant</h1>
      </div>

      {/* Chat History */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="flex justify-center">
          <span className="text-xs text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full">Today</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-white border border-blue-100 flex items-center justify-center mr-3 mt-1 shadow-sm flex-shrink-0">
                <Activity size={16} className="text-blue-600" />
              </div>
            )}
            <div className={`${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm'} p-4 max-w-[80%] shadow-sm`}>
              <p className="text-sm leading-relaxed mb-3">{msg.text}</p>
              {msg.eventId && (
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center text-sm">
                  <Terminal size={16} className="text-slate-400 mr-2" />
                  <span className="font-mono text-slate-600 text-xs">Task ID: {msg.eventId}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="w-8 h-8 rounded-full bg-white border border-blue-100 flex items-center justify-center mr-3 mt-1 shadow-sm flex-shrink-0">
                <Activity size={16} className="text-blue-600 animate-spin" />
              </div>
              <div className="bg-white border border-slate-100 text-slate-700 p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                 <span className="flex space-x-1">
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                 </span>
              </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Pretor to do something..."
            className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex mt-2 space-x-3 px-2">
          <span className="text-[10px] text-slate-400 cursor-pointer hover:text-blue-500">Run diagnostics</span>
          <span className="text-[10px] text-slate-400 cursor-pointer hover:text-blue-500">View recent errors</span>
        </div>
      </div>
    </div>
  );
}
