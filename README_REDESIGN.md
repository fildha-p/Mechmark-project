# Mechmark React + Django Redesign

This folder keeps the original static website and adds a new rebuild direction:

- `frontend/` contains the React/Vite first design slice.
- `backend/` contains the Django API skeleton for products, categories, blogs, and enquiries.
- Existing Mechmark assets are reused from `assets/` so the redesign starts with real product imagery.

## Reference Direction

The attached JCB screenshot is being used as a layout and motion reference only:

- strong dark industrial theme
- bold first-viewport product image
- opening/reveal animation on the hero
- offer/product selection flow
- product support and catalogue blocks
- compact footer/contact conversion

The first Mechmark hero now has a placeholder product reveal animation that can later be replaced with the final product animation.

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## Run Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The backend API starts under `/api/`.
