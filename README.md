# CareAura — Simple Elderly Care Companion (Vanilla JS)

CareAura is a small, mobile-style web app prototyping a caregiving assistant. It includes:
- Demo login with client-side OTP (for development only)
- Reminder creation, local persistence, and minute-level notification
- SOS/panic button that logs an alert and visual feedback
- Caregiver activity feed & simple messaging (local)
- Simulated health metrics (heart rate, steps, sleep, fall detection)
- Responsive, phone-like UI with bottom navigation icons

## Files
- `login.html`, `login.js` — demo OTP & login
- `app.html`, `script.js` — main app UI & logic
- `style.css` — styles
- `README.md`

## How to run locally
1. Put all files into a single folder.
2. Open `login.html` in your browser (double-click or `File → Open`).
3. Enter a name and a 10-digit mobile number. The demo OTP will appear in the browser console (DevTools).
4. Verify OTP → you will be redirected to `app.html`.
5. Add reminders, press SOS, send quick messages — data persists in `localStorage`.

## Notes & Next steps
- **Security**: OTP is client-side for demo. For production, implement a server that sends/validates OTPs.
- **Sync**: This uses `localStorage` only — consider adding a backend (Node + DB) to allow caregivers to view alerts from other devices.
- **Push notifications**: Use Web Push / service worker to allow reminders when the app isn't open.
- **Improvements**: analytics, export/import of reminders, multi-language support, accessibility improvements.

## Deploy
- Push the folder to GitHub, then import the repository into Vercel (static site). Vercel will serve `login.html` as entry.
