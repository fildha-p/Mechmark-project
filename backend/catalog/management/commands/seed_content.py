"""Load the current Mechmark website content into the database.

    python manage.py seed_content

Safe to run more than once: existing records (matched by slug/title) are left untouched,
so edits made in the admin are never overwritten.
"""

from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand

from catalog.models import (
    BlogPost,
    Brochure,
    PhoneNumber,
    Product,
    ProductCategory,
    Service,
    SiteSettings,
    Stat,
    TeamMember,
)

ASSETS_DIR = Path(settings.BASE_DIR).parent / "assets"

SITE = {
    "company_name": "Mechmark Industries",
    "address": "8/620A, Nagalikavu, Puthoor (PO), Omassery, Kozhikode (Dist), Kerala, India - 673582",
    "email": "mechmarks3@gmail.com",
    "whatsapp_number": "919496801821",
    "facebook_url": "https://www.facebook.com/mechmarkpoultry",
    "instagram_url": "https://www.instagram.com/mechmark_industries",
    "hero_title": "Food Processing Machinery, Built in Kerala",
    "hero_text": "Dryers, oil processing units and coconut cutting machines - manufactured in our own "
    "factory and supported across India.",
    "about_title": "Precision in Machinery, Excellence in Quality",
    "about_text": (
        "Mechmark Industries, established in 2010, manufactures food processing machinery from its own "
        "factory at Puthoor, Kozhikode - about 30 km from Calicut city.\n\n"
        "Our dryers, oil processing units and coconut cutting machines help food producers work faster and "
        "more hygienically while preserving the nutritional value of what they make. We provide genuine "
        "service across India and partially worldwide."
    ),
}

PHONES = [
    ("+91 9496 801 821", "Main"),
    ("+91 9496 801 499", ""),
    ("+91 6235 116 306", ""),
]

CATEGORIES = [
    {
        "name": "Dryers",
        "slug": "dryers",
        "series_code": "ELDR / DYR Series",
        "icon": "dryer",
        "show_in_hero": True,
        "summary": "Electric, trayless and firewood tray-type dryers for copra, spices, fruits and other food products.",
        "description": "Quick, hygienic drying with automatic control of temperature, time and moisture exhaust on "
        "electric models, and cost-effective firewood operation on tray-type copra dryers.",
        "features": "Electric: ELDR-3 / 4 / 5 (3-5 trays)\nTrayless BXD-900 / BXD-1500\n"
        "Firewood: 250-500 coconuts per batch\nAuto temperature & moisture control",
        "models": [
            ("Trayless Electric Dryer", "ELDR-BXD-900", "Automatic controlled temperature, time & moisture exhaust", ""),
            ("Trayless Electric Dryer", "ELDR-BXD-1500", "Automatic controlled temperature, time & moisture exhaust", ""),
            ("Multi Purpose Electric Dryer", "ELDR-3-4430-30", "", "Tray capacity: 3\nTray size: 44 x 30 cm"),
            ("Multi Purpose Electric Dryer", "ELDR-4-4430-40", "", "Tray capacity: 4\nTray size: 44 x 30 cm"),
            ("Multi Purpose Electric Dryer", "ELDR-5-6044-80", "", "Tray capacity: 5\nTray size: 60 x 44 cm"),
            ("Firewood Tray Type Dryer", "DYRS-5-7860-250", "", "Trays: 5\nCapacity: 250 coconuts"),
            ("Firewood Tray Type Dryer", "DYRSB-10-6055-350", "", "Trays: 10\nCapacity: 350 coconuts"),
            ("Firewood Tray Type Dryer", "DYR-8-9161-500", "", "Trays: 8\nCapacity: 500 coconuts"),
        ],
    },
    {
        "name": "Copra Cutter",
        "slug": "copra-cutter",
        "series_code": "CTR Series",
        "icon": "copraCutter",
        "show_in_hero": True,
        "summary": "Heavy-duty coconut/copra cutting machine with hopper, belt drive, and rigid frame.",
        "description": "A sturdy copra cutting machine designed for coconut processing units that need consistent "
        "cutting, easy loading, and dependable daily operation.",
        "features": "Wide feed hopper\nRigid painted frame\nBelt driven cutting assembly\nElectric motor setup",
        "models": [("Heavy Copra Cutter", "CTR-202", "Heavy copra cutter - 2 HP", "")],
    },
    {
        "name": "MCO3 Oil Press",
        "slug": "mco3-oil-press",
        "hero_label": "Oil Press",
        "series_code": "MCO Series",
        "icon": "oilPress",
        "show_in_hero": True,
        "summary": "Compact stainless oil processing unit with feed hopper, press chamber, and control panel.",
        "description": "A compact stainless oil processing unit built for controlled pressing, clean product flow, "
        "and straightforward operation in small commercial spaces.",
        "features": "Stainless body\nFeed hopper\nIntegrated controls\nCompact production footprint",
        "models": [
            ("Mini Commercial Automatic Oil Press", "MCO-203", "3 HP", ""),
            ("Mini Commercial Automatic Oil Press", "MCO-103", "2 HP", ""),
        ],
    },
    {
        "name": "Filter Press 10-10",
        "slug": "filter-press-10-10",
        "series_code": "Filter Series",
        "icon": "filterPress",
        "summary": "Manual filter press with plate stack, hand wheel, stainless tray, and collection tank.",
        "description": "A manual filter press for oil filtration workflows, with a clear plate stack layout, "
        "collection tray, hand wheel, and stainless collection tank.",
        "features": "10-10 plate stack\nManual hand wheel\nStainless collection tray\nSeparate collection tank",
        "models": [],
    },
    {
        "name": "Storage Tank",
        "slug": "storage-tank",
        "series_code": "Tank Series",
        "icon": "storageTank",
        "summary": "Stainless storage tank with tall stand, tapered base, and multiple outlet taps.",
        "description": "A stainless storage tank made for clean holding and controlled outlet flow, supported by "
        "a tall stand and tapered bottom section.",
        "features": "Stainless tank body\nTapered base\nMultiple outlet taps\nTall support stand",
        "models": [],
    },
]

BROCHURES = [
    ("Multi Purpose Dehydrate Systems", "Multi Purpose Dehydrate Systems.pdf", "dryers"),
    ("Firewood Tray Type Copra Dryer", "firewood tray type copra Dryer.pdf", "dryers"),
    ("Electric Dryer BXD", "Electric Drayer BXD.pdf", "dryers"),
    ("Mini Commercial Oil Processing Unit", "Mini Commercial Oil Processing Unit.pdf", "mco3-oil-press"),
]

STATS = [("12", "States served"), ("1250+", "Happy clients"), ("4600+", "Machines sold"), ("10", "Awards")]

SERVICES = [
    ("Machine selection guidance", "Not sure which dryer or oil unit fits your output? Our team helps you choose "
     "the right capacity for your business.", "Ask an expert"),
    ("Installation & operator support", "We install your machine on site and train your operators so production "
     "starts smoothly from day one.", "Learn more"),
    ("Genuine spare parts", "Original Mechmark parts for a longer and stronger machine life, supplied directly "
     "from our factory.", "Request parts"),
    ("Pan-India service", "Service support across India and partially worldwide, so your production keeps running "
     "with minimal downtime.", "Book service"),
]

TEAM = [
    ("Mohd. Irshad", "CEO & Founder"),
    ("Ansar Ibnu Ali", "General Manager"),
    ("Anshad Mohd", "Operations"),
    ("Shreyas KS", "Marketing Manager"),
]

BLOG = {
    "title": "Coconut Oil Production: Start a Profitable Business with a Small Budget",
    "slug": "coconut-oil-production-small-budget",
    "excerpt": "Coconut oil is a versatile, high-demand product used in cooking, cosmetics and wellness. Here is "
    "how a compact Mechmark oil processing setup can get a small unit running.",
    "external_url": "https://mechmark.in/Start-a-Profitable-Business-with-a-Small-Budget.html",
    "is_featured": True,
}


class Command(BaseCommand):
    help = "Load the current Mechmark website content (skips anything that already exists)."

    def handle(self, *args, **options):
        created = 0

        site = SiteSettings.load()
        if not site.address:  # first run only; never overwrite admin edits
            for field, value in SITE.items():
                setattr(site, field, value)
            site.save()
            created += 1
        if not site.phones.exists():
            for order, (number, note) in enumerate(PHONES):
                PhoneNumber.objects.create(settings=site, number=number, note=note, sort_order=order)
                created += 1

        for order, data in enumerate(CATEGORIES):
            data = dict(data)
            models = data.pop("models")
            category, made = ProductCategory.objects.get_or_create(
                slug=data.pop("slug"), defaults={**data, "sort_order": order}
            )
            created += made
            for m_order, (name, code, summary, specs) in enumerate(models):
                _, made = Product.objects.get_or_create(
                    slug=code.lower(),
                    defaults={
                        "category": category,
                        "name": name,
                        "model_code": code,
                        "summary": summary,
                        "specs": specs,
                        "sort_order": m_order,
                    },
                )
                created += made

        for order, (title, filename, category_slug) in enumerate(BROCHURES):
            if Brochure.objects.filter(title=title).exists():
                continue
            source = ASSETS_DIR / "brochures" / filename
            if not source.exists():
                self.stdout.write(self.style.WARNING(f"Brochure not found, skipped: {source}"))
                continue
            brochure = Brochure(
                title=title,
                sort_order=order,
                category=ProductCategory.objects.filter(slug=category_slug).first(),
            )
            with source.open("rb") as fh:
                clean_name = title.lower().replace(" ", "-") + ".pdf"
                brochure.file.save(clean_name, File(fh), save=True)
            created += 1

        for order, (value, label) in enumerate(STATS):
            _, made = Stat.objects.get_or_create(label=label, defaults={"value": value, "sort_order": order})
            created += made

        for order, (title, text, button) in enumerate(SERVICES):
            _, made = Service.objects.get_or_create(
                title=title, defaults={"text": text, "button_label": button, "sort_order": order}
            )
            created += made

        for order, (name, role) in enumerate(TEAM):
            _, made = TeamMember.objects.get_or_create(name=name, defaults={"role": role, "sort_order": order})
            created += made

        _, made = BlogPost.objects.get_or_create(slug=BLOG["slug"], defaults=BLOG)
        created += made

        self.stdout.write(self.style.SUCCESS(f"Seed complete: {created} item(s) created."))
