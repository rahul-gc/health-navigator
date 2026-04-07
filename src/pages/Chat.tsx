import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { streamChat, Msg } from '@/lib/chat-stream';
import DashboardLayout from '@/components/DashboardLayout';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Heart, Loader2, Trash2, Sparkles, MessageCircle, Bot, User } from 'lucide-react';
import { toast } from 'sonner';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Chat() {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<{id: string, title: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversationsList();
  }, [user]);

  const loadConversationsList = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('conversations')
      .select('id, title')
      .order('updated_at', { ascending: false });
    if (data) setConversations(data);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = async (id: string) => {
    setConversationId(id);
    const { data } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });
    if (data) setMessages(data as Msg[]);
  };

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setInput('');
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading || !user) return;

    setInput('');
    const userMsg: Msg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let activeConvId = conversationId;

    // Create conversation if new
    if (!activeConvId) {
      const title = text.slice(0, 60) + (text.length > 60 ? '...' : '');
      const { data } = await supabase
        .from('conversations')
        .insert({ user_id: user.id, title })
        .select('id')
        .single();
      if (data) {
        activeConvId = data.id;
        setConversationId(data.id);
      }
    }

    // Save user message
    if (activeConvId) {
      await supabase.from('messages').insert({
        conversation_id: activeConvId,
        role: 'user',
        content: text,
      });
    }

    let assistantSoFar = '';
    const allMessages = [...messages, userMsg];

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: allMessages,
        profile: profile ? {
          full_name: profile.full_name,
          age: profile.age,
          gender: profile.gender,
          height_cm: profile.height_cm,
          weight_kg: profile.weight_kg,
          bmi: profile.bmi,
          blood_group: profile.blood_group,
          conditions: profile.conditions,
          medications: profile.medications,
          allergies: profile.allergies,
          smoker: profile.smoker,
          drinker: profile.drinker,
          activity_level: profile.activity_level,
          health_goal: profile.health_goal,
        } : undefined,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: async () => {
          setIsLoading(false);
          if (activeConvId && assistantSoFar) {
            await supabase.from('messages').insert({
              conversation_id: activeConvId,
              role: 'assistant',
              content: assistantSoFar,
            });
            // Update conversation timestamp
            await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', activeConvId);
          }
        },
        onError: (msg) => {
          setIsLoading(false);
          toast.error(msg);
        },
      });
    } catch {
      setIsLoading(false);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    t(language, 'askWorsen'),
    t(language, 'askRemedies'),
    t(language, 'askChild'),
  ];

  const showWelcome = messages.length === 0;

  return (
    <DashboardLayout title="Chat with Health Sathi">
      <div className="flex h-[600px] gap-4">
        {/* Left Sidebar - ChatGPT Style */}
        <div className="w-80 bg-gray-900 rounded-lg border border-gray-700 p-4 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleNewChat}
              className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-gray-300" />
            </button>
            <span className="font-semibold text-gray-100">New chat</span>
          </div>
          
          <div className="space-y-2">
            {conversations.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No conversations yet</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group p-3 rounded-lg cursor-pointer transition-all ${
                    conversationId === conv.id 
                      ? 'bg-gray-800 border border-gray-600' 
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span 
                      onClick={() => loadConversation(conv.id)}
                      className="flex-1 text-sm text-gray-200 truncate"
                    >
                      {conv.title}
                    </span>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await supabase.from('conversations').delete().eq('id', conv.id);
                        if (conversationId === conv.id) {
                          handleNewChat();
                        }
                        loadConversationsList();
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-700 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Chat Area - Gemini Style */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Health Assistant</h2>
                <p className="text-xs text-gray-500">AI-powered medical guidance</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
            {showWelcome ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {t(language, 'welcome')}
                </h1>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {profile?.full_name ? `Hello ${profile.full_name.split(' ')[0]}! ` : ''}
                  {t(language, 'welcomeDesc')}
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' 
                          ? 'bg-blue-500' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      }`}>
                        {msg.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-gray-100">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="self-end px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}