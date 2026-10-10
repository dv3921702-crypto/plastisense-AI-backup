# PlastiSense AI

A production-oriented, responsive environmental intelligence prototype for Mumbai. The application includes a polished landing page, multilingual dashboard, image analysis workflow, satellite comparison, pollution mapping, AI assistant, analytics, recycling guidance, cleanup operations, reporting, and backend authentication.

## Run

```powershell
python app.py
```

Open http://localhost:8000.

The application runs in demo mode without external API credentials. Create a personal account through the existing sign-up form; there is no shared demo login. Plastic leakage forecasts accept 24-, 48-, and 72-hour periods, but return an explicit unavailable status until verified ward-level rainfall, tide, and current plastic-load sources are configured; demo measurements are not substituted. The What-If Simulator treats baseline leakage and intervention efficiency as user-provided estimates: prevented plastic = baseline × efficiency / 100, remaining leakage = baseline − prevented plastic, and reduction percentage = prevented / baseline × 100 (when baseline is above zero). Intervention types are labels only because no intervention-specific performance evidence/model or verified monetary valuation method is configured; estimated benefit and benefit/cost ratio are therefore unavailable. Image-based brand audit, report verification, and open-ended AI chat require `GEMINI_API_KEY`; these endpoints report unavailable when the provider is not configured instead of returning fabricated results. Local account profiles and uploaded avatars are stored in `plastisense_users.sqlite3` and are intended for demonstration use only.

The AI Assistant uses the Gemini API (`gemini-2.5-flash`) through the server-side `GEMINI_API_KEY`; the key is sent only in a request header and is never included in browser code or returned to the client. When the key is absent or the provider request fails, both chat interfaces show “AI Assistant is temporarily unavailable. Please try again.” There is no hardcoded-response fallback.

The assistant accepts English, Tamil, Telugu, Kannada, Malayalam, and Hindi text/voice input. It asks Gemini to answer in the language detected from the question and uses the selected interface language only as a fallback when the question is ambiguous. Speech recognition and speech synthesis still depend on browser/OS language support. Android layouts use safe-area spacing and touch-sized controls; dark ocean surfaces retain the existing theme with restrained neumorphic shadows, and reduced-motion preferences are respected. A user-supplied profile image is available as an optional avatar; it is never preselected automatically.

Brand Audit submits images to Gemini Vision only when `GEMINI_API_KEY` is configured. It persists only brand details returned by the model, keeps unsupported counts/confidence unavailable, and builds filtered source summaries from saved analysis records; image identification is not proof of legal responsibility.

Auto Verification uses Gemini Vision model assessments for image quality, environmental relevance, and evidence completeness when configured. Its score is the documented weighted calculation (quality 35%, relevance confidence 40%, completeness 20%, submitted-location presence 5%) and is omitted when required model assessments are unavailable. Exact file matches are duplicates; a 64-bit browser difference-hash distance of 6 or less is only a similar-image flag requiring human review, not proof of duplication. Human verification remains pending and AI output is not legal or official approval.

## Production integration

- Replace the local SQLite authentication store with Firebase Authentication or an equivalent managed provider for production.
- Move API calls behind secure server-side routes and never expose provider secrets in frontend code.
- Use Firestore security rules, server-side upload validation, rate limiting, storage encryption, audit events, and CSRF/session controls.
- Configure Google Maps, weather, tidal, and AI vision through environment variables.
- Set `GEMINI_API_KEY` to enable the AI assistant, visible-brand image audit, and image-based report verification. Do not expose provider keys in frontend code.
- Configure `PLASTISENSE_SECRET` with a strong random value before deployment.

## Security notes

The existing sign-in and account-creation forms authenticate against the local SQLite user store. Account creation requires a name, country, selected gender/avatar style, one of the listed occupations, a valid email address, and a password of at least 12 characters using at least three character classes (lowercase, uppercase, number, symbol); duplicate emails are rejected. Profile fields are stored with the account, and registration displays the profile returned by the backend. Users can select one of six illustrated, non-identifying avatars, the optional supplied image, or upload a PNG, JPEG, or WebP profile image up to 2 MB; uploaded image bytes are stored against the signed-in user's own database record. Email verification is not required or configured. Passwords are stored only as PBKDF2-HMAC-SHA256 hashes with unique random salts; existing accounts using the earlier fixed salt are rehashed after a successful sign-in. Sessions use random, server-side, 24-hour in-memory IDs delivered only in `HttpOnly; SameSite=Strict` cookies. Set `COOKIE_SECURE=1` when TLS terminates before this server (or use HTTPS directly) to add the `Secure` cookie attribute. No session token is returned to or stored by the frontend. Forgot Password is unavailable because no reset-token service or email delivery is configured. Login errors do not disclose whether an email is registered, and failed sign-ins are rate-limited. The implementation remains a demonstration system, not a substitute for a production authentication provider, managed database, file storage, audit service, or map API key management.

## Test

```powershell
python -m py_compile app.py
```
