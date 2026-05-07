# GhostMail 👻✉️

A premium, responsive, and anonymous temporary email service. Generate disposable email addresses instantly to keep your primary inbox clean and secure from spam.

## Features

* **Instant Address Generation:** Get a secure, fully functional temporary email address with a single click.
* **Live Inbox:** Automatically polls for new messages every 15 seconds.
* **Full-Stack Architecture:** Custom Node/Express proxy backend securely communicates with upstream mail providers (Guerrilla Mail API) while avoiding CORS or 403 IP blocks.
* **Theming:** Clean Light & Dark mode support, with preferences automatically saved to local storage.
* **Session Persistence:** Accidentally closed the tab? Your session metadata (email and `sid_token`) is securely saved in your browser so you don't lose your inbox.
* **Premium UI/UX:** Built with Tailwind CSS and Framer Motion for glassy layers, polished layouts, and seamless micro-interactions.

## Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, React Router v6
* **Backend:** Node.js, Express (via `tsx`)
* **Icons:** Lucide React
* **API / Mail Provider:** [Guerrilla Mail API](https://www.guerrillamail.com/) (Proxied via backend)

## Getting Started

To run GhostMail locally:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *This starts both the Express proxy server and the Vite dev middleware via `server.ts`.*

3. **Build for Production:**
   ```bash
   npm run build
   # Deployed environment handles starting the node server using the `start` script.
   ```

## Project Structure

* `server.ts` - Express backend handling the API proxy logic and static file serving.
* `src/components/Layout.tsx` - The responsive App shell containing theming logic, navigation, and the global footer.
* `src/pages/Home.tsx` - The primary inbox interface, generation logic, and email viewer.
* `src/pages/*` - Static content pages (`FAQ`, `Contact`, `Privacy`, `Terms`).
* `src/index.css` - Global styles, CSS custom properties for Light/Dark modes, and Tailwind imports.

## Privacy & Security

GhostMail operates as a pass-through viewer. Mail contents are pulled dynamically from the upstream API provider. The custom Node middleman server **does not log, read, or archive** the contents of your messages.
