export default function Contact() {
  return (
    <div className="px-6 py-12 max-w-2xl mx-auto w-full animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-text-muted mb-8 text-lg">Have a question or feedback? We'd love to hear from you.</p>

      <div className="glass p-8 rounded-3xl">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Name</label>
            <input type="text" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ghost-accent transition-colors" placeholder="Your name" />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Email</label>
            <input type="email" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ghost-accent transition-colors" placeholder="your@email.com" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Message</label>
            <textarea rows={5} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ghost-accent transition-colors resize-none" placeholder="How can we help?"></textarea>
          </div>

          <button className="w-full bg-ghost-accent hover:bg-ghost-accent/90 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
