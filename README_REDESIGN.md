# Mechmark React + Django Redesign

- `frontend/` – React/Vite website (JCB-style layout).
- `backend/` – Django API + admin panel. The client edits all website content at `/admin/`.
- `assets/` – original static site assets (brochures, logo).

## How content flows

The React site loads everything from `GET /api/site/` (company details, hero, products,
brochures, stats, services, team, featured blog post). Anything left empty in the admin shows a
"coming soon" placeholder. If the API is unreachable, the site falls back to
`frontend/src/content.js`, so it never renders blank.

The contact form posts to `POST /api/enquiries/`. Enquiries are saved in the admin
(Catalog → Enquiries) and, if email is configured, sent to `ENQUIRY_NOTIFY_EMAILS`.

## Run locally (two terminals)

**Backend**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_content   # loads current site content + brochures (safe to re-run)
python manage.py createsuperuser
python manage.py runserver
```

Admin: http://127.0.0.1:8000/admin/

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Site: http://127.0.0.1:5173/ (Vite proxies `/api` and `/media` to Django on port 8000).

## Tests

```bash
cd backend
python manage.py test catalog
```

## What the client can edit in the admin

| Admin section | Controls on the site |
| --- | --- |
| Site settings | Company name, address, email, WhatsApp, phone numbers, social links, hero title/text, **opening animation (MP4/WebM)**, hero/about/catalogue images |
| Product families | The "Select your product" tiles and product pages: name, icon, description, features, image, hero quick-link buttons |
| Product models | Individual machines listed on each product page (model code, specs, image) |
| Brochures | PDF downloads |
| Stats / Services / Team members | Those homepage sections (photo empty → initials) |
| Blog posts | Featured story block (tick "is featured") |
| Enquiries | Form submissions inbox; tick "resolved" when handled |

Every list has **sort order** and **is published** so items can be reordered or hidden without deleting.

## Production

See `backend/.env.example` for the environment variables (secret key, hosts, CORS, email).
Set `VITE_API_URL` on the frontend host to the backend URL.
