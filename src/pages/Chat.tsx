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
import { Send, Heart, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Chat() {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      <div className="flex h-[calc(100vh-180px)] min-h-[400px] gap-4">
        {/* Chat Sidebar - Conversation History */}
        <SidebarProvider>
          <div className="w-64 shrink-0 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <ChatSidebar
              activeConversationId={conversationId}
              onSelectConversation={loadConversation}
              onNewChat={handleNewChat}
            />
          </div>
        </SidebarProvider>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
            {showWelcome ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center max-w-lg mx-auto">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 mb-6">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold mb-3 text-gray-900">{t(language, 'welcome')}</h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-2">
                  {profile?.full_name ? `Hello ${profile.full_name.split(' ')[0]}! ` : ''}
                  {t(language, 'welcomeDesc')}
                </p>
                {profile && (
                  <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg mb-4">
                    Your personalized AI health companion knows your profile and will provide tailored guidance.
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {suggestions.map((s) => (
                    <Button key={s} variant="outline" size="sm" onClick={() => handleSuggestion(s)} className="text-xs">
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} role={msg.role} content={msg.content} />
                ))}
                {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                  <div className="flex gap-3 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <Heart className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t(language, 'loading')}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {!showWelcome && messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && !isLoading && (
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestions.map((s) => (
                  <Button key={s} variant="outline" size="sm" onClick={() => handleSuggestion(s)} className="text-xs">
                    {s}
                  </Button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t(language, 'typeMessage')}
                className="min-h-[44px] max-h-[120px] resize-none flex-1 bg-white border-gray-300"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="shrink-0 h-[44px] w-[44px] bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}