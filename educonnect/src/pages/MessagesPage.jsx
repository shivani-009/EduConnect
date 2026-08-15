import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiSend, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getConversations, getConversation, sendMessage } from '../services/messageService';
import { getTutorById } from '../services/tutorService';

export default function MessagesPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await getConversations();
      setConversations(data);
      const openId = params.get('with');
      if (openId) {
        const match = data.find((c) => c._id === openId);
        if (match) {
          openConversation(match);
        } else {
          // No history yet — fetch the tutor's basic info so we can still
          // show a conversation view and send the first message.
          try {
            const tutor = await getTutorById(openId);
            setActive({ _id: openId, partner: { fullName: tutor.name, avatar: tutor.image } });
            setMessages([]);
          } catch {
            // tutor not found, ignore — user stays on conversation list
          }
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadConversations();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const openConversation = async (conv) => {
    setActive(conv);
    try {
      const data = await getConversation(conv._id);
      setMessages(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load conversation');
    }
  };

  const send = async () => {
    if (!draft.trim() || !active) return;
    const text = draft;
    setDraft('');
    try {
      const msg = await sendMessage(active._id, text);
      setMessages((prev) => [...prev, msg]);
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <FiMessageSquare size={32} className="text-gray-300" />
        <p className="mt-3 text-sm text-gray-400">Log in to view your messages.</p>
        <button onClick={() => navigate('/login')} className="mt-3 text-sm font-semibold text-green-600 dark:text-lime-400">Login →</button>
      </div>
    );
  }

  if (active) {
    return (
      <div className="flex h-[calc(100vh-56px)] flex-col max-w-2xl mx-auto">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800 p-3">
          <button onClick={() => setActive(null)}><FiArrowLeft className="text-gray-600 dark:text-gray-300" /></button>
          <img src={active.partner.avatar} alt={active.partner.fullName} className="h-9 w-9 rounded-full object-cover" />
          <p className="font-semibold text-gray-900 dark:text-white">{active.partner.fullName}</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && <p className="text-center text-xs text-gray-400 mt-6">Say hello 👋</p>}
          {messages.map((m) => (
            <div key={m._id} className={`flex ${m.sender === active._id ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.sender === active._id ? 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-100' : 'gradient-primary text-white'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-gray-100 dark:border-slate-800 p-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-gray-100 dark:bg-slate-800 px-4 py-2 text-sm outline-none text-gray-900 dark:text-white"
          />
          <button onClick={send} className="rounded-full gradient-primary p-2.5 text-white">
            <FiSend size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 pb-6 pt-4 max-w-2xl mx-auto">
      <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
      {loading && <p className="text-sm text-gray-400">Loading…</p>}
      {!loading && conversations.length === 0 && (
        <p className="text-sm text-gray-400">
          No conversations yet. Message a tutor from their profile page to start one.
        </p>
      )}
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-slate-800">
        {conversations.map((c) => (
          <button key={c._id} onClick={() => openConversation(c)} className="flex items-center gap-3 py-3 text-left">
            <img src={c.partner.avatar} alt={c.partner.fullName} className="h-12 w-12 rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.partner.fullName}</p>
              <p className="truncate text-xs text-gray-400">{c.lastMessage}</p>
            </div>
            {c.unread > 0 && <span className="h-2.5 w-2.5 rounded-full bg-green-500" />}
          </button>
        ))}
      </div>
    </div>
  );
}
