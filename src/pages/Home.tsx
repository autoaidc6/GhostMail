import { useState, useEffect, useCallback } from 'react';
import { 
  Mail, 
  Copy, 
  Check, 
  RefreshCcw, 
  Plus, 
  Inbox, 
  ChevronRight, 
  RefreshCw,
  Clock,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmailMessage {
  id: string; // Guerrilla uses string mail_id
  from: string;
  subject: string;
  date: string;
  excerpt: string;
}

interface FullMessage extends EmailMessage {
  body: string;
}

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [sid, setSid] = useState<string>('');
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<FullMessage | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateEmail = useCallback(async () => {
    try {
      setError(null);
      const resp = await fetch('/api/mail?action=genEmail');
      const data = await resp.json();
      if (data.email_addr) {
        setEmail(data.email_addr);
        setSid(data.sid_token);
        setMessages([]);
        setSelectedMessage(null);
        localStorage.setItem('ghostmail_address', data.email_addr);
        localStorage.setItem('ghostmail_sid', data.sid_token);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      console.error('Failed to generate email:', err);
      setError('Connection failed. Please try again.');
    }
  }, []);

  const fetchMessages = useCallback(async (token: string) => {
    if (!token) return;
    setIsRefreshing(true);
    setError(null);
    try {
      const resp = await fetch(`/api/mail?action=getMessages&sid=${token}`);
      const data = await resp.json();
      if (data.list) {
        const mappedList: EmailMessage[] = data.list.map((m: any) => ({
          id: m.mail_id,
          from: m.mail_from,
          subject: m.mail_subject,
          date: m.mail_date || new Date().toLocaleTimeString(),
          excerpt: m.mail_excerpt
        }));
        setMessages(mappedList);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const viewMessage = async (id: string) => {
    try {
      const resp = await fetch(`/api/mail?action=readMessage&sid=${sid}&id=${id}`);
      const data = await resp.json();
      setSelectedMessage({
        id: data.mail_id,
        from: data.mail_from,
        subject: data.mail_subject,
        date: data.mail_date || '',
        excerpt: '',
        body: data.mail_body
      });
    } catch (err) {
      console.error('Failed to read message:', err);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('ghostmail_address');
    const savedSid = localStorage.getItem('ghostmail_sid');
    if (savedEmail && savedSid) {
      setEmail(savedEmail);
      setSid(savedSid);
    } else {
      generateEmail();
    }
  }, [generateEmail]);

  useEffect(() => {
    if (sid) {
      fetchMessages(sid);
      const interval = setInterval(() => fetchMessages(sid), 15000); 
      return () => clearInterval(interval);
    }
  }, [sid, fetchMessages]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
      <main className="flex-1 px-6 pb-12 max-w-2xl mx-auto w-full flex flex-col gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-8 space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main">
            Your Secret <span className="text-ghost-accent">Ghost</span> Inbox is Ready.
          </h1>
          <p className="text-text-muted text-sm md:text-base max-w-md mx-auto">
            Disposable email address to protect your identity and stay away from spam.
          </p>
        </motion.div>

        {/* Generator Card */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className="glass p-8 rounded-3xl glow-purple relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Mail className="w-32 h-32" />
          </div>

          <div className="space-y-6 relative">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-ghost-accent/80 ml-1">
                Your Generated Address
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={email}
                  className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-lg font-medium outline-none focus:border-ghost-accent/50 transition-colors cursor-default text-text-main"
                />
                <button 
                  onClick={copyToClipboard}
                  className="bg-ghost-accent hover:bg-ghost-accent/80 text-white px-5 py-4 sm:py-0 rounded-2xl transition-all active:scale-95 flex items-center justify-center relative group"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Tooltip */}
                  {copied && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-black text-black dark:text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl">
                      Copied!
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button 
                onClick={() => generateEmail()}
                className="flex items-center justify-center gap-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 transition-all text-sm font-semibold active:scale-95 text-text-main"
              >
                <Plus className="w-4 h-4" />
                New Address
              </button>
              <button 
                onClick={() => fetchMessages(sid)}
                disabled={isRefreshing}
                className="flex items-center justify-center gap-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 transition-all text-sm font-semibold active:scale-95 group text-text-main"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-ghost-accent' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                Refresh Inbox
              </button>
            </div>
          </div>
        </motion.div>

        {/* Inbox Section */}
        <section className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-500 text-xs flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-ghost-accent" />
              <h2 className="font-bold text-lg text-text-main">Inbox</h2>
            </div>
            <span className="text-xs bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg text-text-muted font-mono tracking-tighter">
              {messages.length} Messages
            </span>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-3xl p-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="bg-black/5 dark:bg-white/5 p-4 rounded-full">
                    <Clock className="w-8 h-8 text-text-muted opacity-50" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-text-main">Waiting for messages...</p>
                    <p className="text-sm text-text-muted max-w-[200px]">Any emails sent to {email} will appear here instantly.</p>
                  </div>
                </motion.div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => viewMessage(msg.id)}
                    className="glass p-5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-4 overflow-hidden">
                      <div className="p-3 bg-ghost-accent/10 rounded-xl group-hover:bg-ghost-accent/20 transition-colors shrink-0">
                        <User className="w-5 h-5 text-ghost-accent" />
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <p className="font-bold text-sm truncate text-text-main uppercase tracking-tight">{msg.from}</p>
                        <p className="text-text-muted text-xs truncate max-w-[180px] md:max-w-xs">{msg.subject}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-[10px] text-text-muted font-mono">{msg.date.split(' ')[1] || msg.date}</span>
                      <ChevronRight className="w-4 h-4 text-black/20 dark:text-white/20 group-hover:text-ghost-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
        
        {/* Message Modal */}
        <AnimatePresence>
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedMessage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-[#1e1e1e] border border-black/10 dark:border-white/10 max-w-2xl w-full max-h-[85vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-black/5 dark:bg-white/5">
                  <div className="space-y-1 overflow-hidden">
                    <h3 className="font-bold truncate pr-4 text-text-main tracking-tight">{selectedMessage.subject}</h3>
                    <p className="text-xs text-ghost-accent flex items-center gap-1.5 truncate">
                      <User className="w-3 h-3" />
                      {selectedMessage.from}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl transition-colors text-text-main"
                  >
                    <RefreshCcw className="w-5 h-5 rotate-45" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-[#1a1a1a]">
                  <div 
                    className="text-text-main whitespace-pre-wrap text-sm leading-relaxed message-body overflow-x-hidden"
                    dangerouslySetInnerHTML={{ __html: selectedMessage.body }}
                  />
                </div>
                <div className="p-4 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex justify-end">
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="px-8 py-2.5 bg-ghost-accent hover:bg-ghost-accent/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-ghost-accent/20 active:scale-95 transition-all"
                  >
                    Close Mail
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
  );
}
