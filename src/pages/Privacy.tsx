export default function Privacy() {
  return (
    <div className="px-6 py-12 max-w-2xl mx-auto w-full prose dark:prose-invert prose-purple">
      <h1>Privacy Policy</h1>
      <p className="text-text-muted">Last updated: May 5, 2026</p>
      
      <h3>Data Collection</h3>
      <p>
        GhostMail does not collect personal information. We do not ask for your name, phone number, or real email address. The temporary email address provided is randomly generated. 
      </p>

      <h3>Cookies and Local Storage</h3>
      <p>
        We use your browser's local storage solely to remember your temporary email address and session token so that if you accidentally close the tab, you can return to your inbox. We do not use tracking cookies.
      </p>

      <h3>Email Contents</h3>
      <p>
        Emails sent to the generated addresses are stored temporarily on upstream servers (e.g., Guerrilla Mail) and are deleted automatically. We do not read, process, or archive any incoming emails.
      </p>

      <h3>Third-Party Services</h3>
      <p>
        We utilize third-party APIs to provide the temporary email functionality. By using our service, you acknowledge that your usage is subject to the privacy practices of those upstream providers.
      </p>
    </div>
  );
}
