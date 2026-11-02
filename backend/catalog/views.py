import json
import logging

from django.conf import settings as django_settings
from django.core.cache import cache
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import (
    BlogPost,
    Brochure,
    Enquiry,
    Product,
    ProductCategory,
    Service,
    SiteSettings,
    Stat,
    TeamMember,
)

logger = logging.getLogger(__name__)


def media_url(request, file):
    """Absolute URL for an uploaded file, or None when empty (frontend shows a placeholder)."""
    if not file:
        return None
    return request.build_absolute_uri(file.url)


def paragraphs(text):
    return [p.strip() for p in (text or "").replace("\r\n", "\n").split("\n\n") if p.strip()]


def product_to_dict(request, product):
    return {
        "name": product.name,
        "modelCode": product.model_code,
        "slug": product.slug,
        "summary": product.summary,
        "specs": product.spec_list,
        "image": media_url(request, product.image),
    }


def category_to_dict(request, category):
    return {
        "title": category.name,
        "slug": category.slug,
        "code": category.series_code,
        "icon": category.icon,
        "summary": category.summary,
        "detail": category.description,
        "features": category.feature_list,
        "image": media_url(request, category.image),
        "models": [product_to_dict(request, p) for p in category.products.all() if p.is_published],
    }


@require_GET
def site_content(request):
    """Everything the homepage needs, in the same shape as frontend/src/content.js."""
    site = SiteSettings.load()
    phones = site.phones.filter(is_published=True)
    categories = ProductCategory.objects.filter(is_published=True).prefetch_related("products")
    featured = (
        BlogPost.objects.filter(is_published=True, is_featured=True).first()
        or BlogPost.objects.filter(is_published=True).first()
    )

    data = {
        "company": {
            "name": site.company_name,
            "address": site.address,
            "email": site.email,
            "whatsapp": f"https://wa.me/{site.whatsapp_number}" if site.whatsapp_number else None,
            "phones": [{"label": p.number, "tel": p.tel, "note": p.note} for p in phones],
            "social": {
                "facebook": site.facebook_url or None,
                "instagram": site.instagram_url or None,
                "youtube": site.youtube_url or None,
            },
        },
        "hero": {
            "title": site.hero_title,
            "text": site.hero_text,
            "animation": media_url(request, site.opening_animation),
            "image": media_url(request, site.hero_image),
            "quickLinks": [
                {"label": c.hero_label or c.name, "href": f"#{c.slug}"} for c in categories if c.show_in_hero
            ],
        },
        "featured": None,
        "productFamilies": [category_to_dict(request, c) for c in categories],
        "about": {
            "eyebrow": "About Mechmark",
            "title": site.about_title,
            "paragraphs": paragraphs(site.about_text),
            "image": media_url(request, site.about_image),
            "cta": {"label": "Talk to our team", "href": "#contact"},
        },
        "stats": [[s.value, s.label] for s in Stat.objects.filter(is_published=True)],
        "brochures": [
            [b.title, media_url(request, b.file)] for b in Brochure.objects.filter(is_published=True) if b.file
        ],
        "catalogueImage": media_url(request, site.catalogue_image),
        "services": [
            {
                "title": s.title,
                "text": s.text,
                "image": media_url(request, s.image),
                "href": "#contact",
                "cta": s.button_label,
            }
            for s in Service.objects.filter(is_published=True)
        ],
        "teamMembers": [
            {"name": t.name, "role": t.role, "image": media_url(request, t.photo)}
            for t in TeamMember.objects.filter(is_published=True)
        ],
    }

    if featured:
        data["featured"] = {
            "eyebrow": "From the Mechmark blog",
            "title": featured.title,
            "text": featured.excerpt,
            "image": media_url(request, featured.image),
            "href": featured.external_url or f"#blog/{featured.slug}",
            "cta": "Read more",
        }

    response = JsonResponse(data)
    response["Cache-Control"] = "public, max-age=60"
    return response


@require_GET
def product_list(request):
    products = Product.objects.filter(is_published=True).select_related("category")
    return JsonResponse({"products": [product_to_dict(request, p) for p in products]})


@require_GET
def post_list(request):
    posts = BlogPost.objects.filter(is_published=True)
    return JsonResponse(
        {
            "posts": [
                {
                    "title": post.title,
                    "slug": post.slug,
                    "excerpt": post.excerpt,
                    "image": media_url(request, post.image),
                    "url": post.external_url or None,
                    "publishedAt": post.published_at,
                }
                for post in posts
            ]
        }
    )


ENQUIRY_LIMITS = {"name": 140, "phone": 40, "email": 254, "productInterest": 180, "message": 3000}
RATE_LIMIT_PER_HOUR = 10


def client_ip(request):
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    return forwarded.split(",")[0].strip() if forwarded else request.META.get("REMOTE_ADDR", "")


@csrf_exempt  # public JSON endpoint called cross-origin from the React site; no session auth involved
@require_POST
def create_enquiry(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
        if not isinstance(payload, dict):
            raise ValueError
    except (UnicodeDecodeError, ValueError):
        return JsonResponse({"error": "Invalid request."}, status=400)

    # Honeypot: bots fill hidden fields, people don't.
    if payload.get("website"):
        return JsonResponse({"status": "ok"}, status=201)

    rate_key = f"enquiry-rate:{client_ip(request)}"
    attempts = cache.get(rate_key, 0)
    if attempts >= RATE_LIMIT_PER_HOUR:
        return JsonResponse({"error": "Too many enquiries. Please call or WhatsApp us instead."}, status=429)

    clean = {key: str(payload.get(key, "")).strip()[:limit] for key, limit in ENQUIRY_LIMITS.items()}
    missing = [field for field in ("name", "phone") if not clean[field]]
    if missing:
        return JsonResponse({"error": "Please fill in your name and phone number.", "fields": missing}, status=400)
    if sum(ch.isdigit() for ch in clean["phone"]) < 7:
        return JsonResponse({"error": "Please enter a valid phone number.", "fields": ["phone"]}, status=400)

    enquiry = Enquiry.objects.create(
        name=clean["name"],
        phone=clean["phone"],
        email=clean["email"],
        product_interest=clean["productInterest"],
        message=clean["message"],
    )
    cache.set(rate_key, attempts + 1, 3600)

    recipients = django_settings.ENQUIRY_NOTIFY_EMAILS
    if recipients:
        try:
            send_mail(
                subject=f"New website enquiry: {enquiry.name} ({enquiry.product_interest or 'General'})",
                message=(
                    f"Name: {enquiry.name}\nPhone: {enquiry.phone}\nEmail: {enquiry.email or '-'}\n"
                    f"Product: {enquiry.product_interest or '-'}\n\n{enquiry.message or '(no message)'}\n"
                ),
                from_email=None,
                recipient_list=recipients,
            )
        except Exception:  # never lose an enquiry because email failed; it is saved in the admin
            logger.exception("Enquiry %s saved but notification email failed", enquiry.pk)

    return JsonResponse({"status": "ok"}, status=201)
