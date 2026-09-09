import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import BlogPost, Enquiry, Product, ProductCategory


def product_to_dict(product):
    return {
        "id": product.id,
        "name": product.name,
        "modelCode": product.model_code,
        "slug": product.slug,
        "summary": product.summary,
        "category": product.category.name,
        "image": product.image.url if product.image else "",
        "brochure": product.brochure.url if product.brochure else "",
        "isFeatured": product.is_featured,
    }


@require_GET
def site_overview(request):
    categories = ProductCategory.objects.prefetch_related("products")
    return JsonResponse(
        {
            "company": {
                "name": "Mechmark Industries",
                "phone": "+91 9496 801 821",
                "email": "mechmarks3@gmail.com",
                "location": "Nagalikavu, Omassery, Calicut, Kerala - 673582",
            },
            "categories": [
                {
                    "id": category.id,
                    "name": category.name,
                    "slug": category.slug,
                    "summary": category.summary,
                    "products": [product_to_dict(product) for product in category.products.all()],
                }
                for category in categories
            ],
        }
    )


@require_GET
def product_list(request):
    products = Product.objects.select_related("category")
    return JsonResponse({"products": [product_to_dict(product) for product in products]})


@require_GET
def post_list(request):
    posts = BlogPost.objects.filter(is_published=True)
    return JsonResponse(
        {
            "posts": [
                {
                    "id": post.id,
                    "title": post.title,
                    "slug": post.slug,
                    "excerpt": post.excerpt,
                    "publishedAt": post.published_at,
                }
                for post in posts
            ]
        }
    )


@csrf_exempt
@require_POST
def create_enquiry(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    required_fields = ["name", "phone", "message"]
    missing_fields = [field for field in required_fields if not payload.get(field)]
    if missing_fields:
        return JsonResponse({"error": "Missing required fields.", "fields": missing_fields}, status=400)

    enquiry = Enquiry.objects.create(
        name=payload["name"],
        phone=payload["phone"],
        email=payload.get("email", ""),
        product_interest=payload.get("productInterest", ""),
        message=payload["message"],
    )
    return JsonResponse({"status": "ok", "enquiryId": enquiry.id}, status=201)
