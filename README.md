⚡ Flux
Because bad Wi-Fi shouldn't kill your flow.

We've all been there. You spend 10 minutes crafting the perfect, complex prompt for an AI. You hit "Enter." The Wi-Fi blinks. And it’s gone.

We built Flux (formerly Tether) to fix that. It's a resilient chat workspace that catches your work when the internet fails and organizes your chaotic thought process into clean, recoverable "Chapters."

🛑 The Problem
Chatting with AI is great until you hit a connection snag. Most apps just give you a "Network Error" and delete your text. Plus, scrolling back through 500 messages to find that one code snippet from 3 hours ago is a nightmare.

🛠️ How Flux Fixes It
1. The "Offline Saver" (Smart Recovery)
Flux watches your connection. If you hit send while offline:

It intercepts the failure.

It caches your draft locally.

When you're back online, a green "Recover & Send" button appears. One click, and you're back in the game. No rewriting.

2. Chapters > Infinite Scrolling
Instead of one endless wall of text, Flux lets you see your chat as a Timeline.

Context Jumping: Click a chapter in the sidebar (e.g., "Database Fix") to filter the chat instantly to that moment.

Status Badges: Mark sections as "In Progress" or "Completed" so you know where you left off.

3. The "Super Prompt"
Need to switch to a different AI model? Flux generates a context summary for each chapter. You can copy this "Super Prompt" and paste it into ChatGPT or Claude to restart your session without explaining everything from scratch.

💻 Tech Stack
Frontend: React + Vite (Fast & lightweight)

Styling: Tailwind CSS (Custom dark/light hybrid theme)

Icons: Lucide React

State: Local Storage (for the offline caching magic)

🚀 How to Run It
Clone this repo:

Bash
git clone https://github.com/yourusername/flux.git
cd flux
Install the goods:

Bash
npm install
Run it:

Bash
npm run dev
🎮 Try The Demo
Open the app and try this to see the magic happen:

Go to the "Blockchain Gas Optimization" chat.

Open the Timeline on the left to see the chapters.

Turn off your internet (or use the "Simulate Offline" toggle in the sidebar).

Type a message and hit Enter.

Watch it catch the error.

Turn the internet back on and hit "Recover".

Built with ☕ and code for [Design Blitz].
