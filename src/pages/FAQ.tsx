import { Ghost } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: "What is GhostMail?",
      a: "GhostMail is a free, temporary, and anonymous email service. It allows you to receive emails without exposing your real email address to spam and marketing lists."
    },
    {
      q: "How long do emails stay in my inbox?",
      a: "Emails are kept temporarily. Depending on server load, they are wiped periodically (usually within an hour or two). Do not use this service for important accounts."
    },
    {
      q: "Can I send emails using GhostMail?",
      a: "No. GhostMail is a receive-only service to prevent abuse and spam."
    },
    {
      q: "Are my emails private?",
      a: "Since the inbox is tied to a specific session token or address, only you possess the keys in your current browser session. However, because it's a temporary disposal service, please do not use it for sensitive data."
    }
  ];

  return (
    <div className="px-6 py-12 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
         <div className="p-2 bg-ghost-accent/20 rounded-xl">
           <Ghost className="w-8 h-8 text-ghost-accent" />
         </div>
         <h1 className="text-4xl font-bold">FAQ</h1>
      </div>
      <p className="text-text-muted mb-8 text-lg">Frequently Asked Questions about GhostMail.</p>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-2 text-text-main">{faq.q}</h3>
            <p className="text-text-muted leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
