import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquarePlus, Trash2, LogOut, Heart } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

interface ChatSidebarProps {
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({ activeConversationId, onSelectConversation, onNewChat }: ChatSidebarProps) {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const loadConversations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('conversations')
      .select('id, title, created_at')
      .order('updated_at', { ascending: false });
    if (data) setConversations(data);
  };

  useEffect(() => {
    loadConversations();
  }, [user, activeConversationId]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from('conversations').delete().eq('id', id);
    if (activeConversationId === id) onNewChat();
    loadConversations();
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-lg truncate">{t(language, 'appName')}</span>
        </div>
        <Button onClick={onNewChat} size="sm" className="w-full mt-3 gap-2">
          <MessageSquarePlus className="h-4 w-4" />
          {t(language, 'newChat')}
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t(language, 'conversations')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="flex-1">
              <SidebarMenu>
                {conversations.length === 0 && (
                  <p className="px-4 py-2 text-xs text-muted-foreground">{t(language, 'noConversations')}</p>
                )}
                {conversations.map((conv) => (
                  <SidebarMenuItem key={conv.id}>
                    <SidebarMenuButton
                      isActive={conv.id === activeConversationId}
                      onClick={() => onSelectConversation(conv.id)}
                      className="group justify-between"
                    >
                      <span className="truncate text-sm">{conv.title}</span>
                      <button
                        onClick={(e) => handleDelete(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2">
        <LanguageSwitcher />
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          {t(language, 'logout')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
