import React, { useState, useEffect, useRef } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatProps {
  sessionId: string;
}

export function ChatComponent({ sessionId }: ChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) return;
    
    const q = query(
      collection(db, `chats/${sessionId}/messages`),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).reverse();
      setMessages(msgs);
    });
    
    return () => unsubscribe();
  }, [sessionId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || !sessionId) return;
    
    const msg = newMessage.trim();
    setNewMessage('');
    
    try {
      await addDoc(collection(db, `chats/${sessionId}/messages`), {
        text: msg,
        userId: user.uid,
        userName: user.displayName || 'Jogador',
        userPhoto: user.photoURL || '',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!user || !sessionId) return null;

  return (
    <div className="absolute bottom-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden"
          >
            <div className="bg-black/50 p-3 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-xbox-green" />
                Chat da Sessão
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white text-xl leading-none">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.length === 0 ? (
                <p className="text-text-dim text-xs text-center my-auto">Nenhuma mensagem ainda. Diga olá!</p>
              ) : (
                messages.map(msg => {
                  const isMe = msg.userId === user.uid;
                  return (
                    <div key={msg.id} className={`flex gap-2 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
                      <img src={msg.userPhoto || "https://ui-avatars.com/api/?name=User"} className="w-6 h-6 rounded-full mt-auto flex-shrink-0" referrerPolicy="no-referrer" />
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-white/50 mb-0.5 px-1">{msg.userName}</span>
                        <div className={`px-3 py-2 rounded-2xl text-sm ${isMe ? 'bg-xbox-green text-white rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-3 bg-black/50 border-t border-white/10 flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Mensagem..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white outline-none focus:border-xbox-green transition-all"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="bg-xbox-green hover:bg-emerald-600 disabled:opacity-50 text-white p-2 rounded-full transition-all flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-xbox-green hover:bg-emerald-600 text-white p-4 rounded-full shadow-[0_0_15px_rgba(16,124,16,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center relative group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-10 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Chat da Sessão</span>
        </button>
      )}
    </div>
  );
}
