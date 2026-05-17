## Day 1 — 2026-05-07

**Hours worked:** 2

**What I did:** Set up the Next.js project with TypeScript and Tailwind. 
Built the landing page with hero section and CTA button. Pushed to 
GitHub and deployed to Vercel — site is live.

**What I learned:** How Next.js App Router works, Tailwind utility 
classes in JSX, and the full git workflow from init to push.

**Blockers / what I'm stuck on:** Minor terminal path issue at the 
start, fixed by switching to VS Code integrated terminal.

**Plan for tomorrow:** Build the spend input form covering all required 
AI tools with plan selection, seat count and monthly spend fields.


## Day 2 — 2026-05-10

**Hours worked:** 3

**What I did:** Built the audit input form where users enter their AI 
tools, plans and seats. Built the results page that calculates savings 
by comparing current spend against real reseller prices from platforms 
like GamsGo. Connected both pages using localStorage and Next.js router.

**What I learned:** How useState manages form data in React, how 
localStorage passes data between pages, how to calculate and display 
savings dynamically.

**Blockers / what I'm stuck on:** Results folder was named incorrectly 
causing a 404 — fixed by renaming and restarting the dev server.

**Plan for tomorrow:** Add email capture, shareable report link and 
connect Supabase database.


## Day 3 — 2026-05-18

**Hours worked:** 3

**What I did:** Set up Supabase database, created audits table, 
connected it to the app. Built email capture popup on results page. 
Each audit now gets saved to database and generates a unique 
shareable link that anyone can open.

**What I learned:** How Supabase works as a database, how dynamic 
routing works in Next.js using [id] folders, how to fetch specific 
data from a database using a unique ID.

**Blockers / what I'm stuck on:** Results folder was initially named 
wrong causing 404. Fixed by renaming it.

**Plan for tomorrow:** Write all required documents — README, GTM, 
ECONOMICS. Do user interviews.