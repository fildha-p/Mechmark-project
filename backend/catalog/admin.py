from django.contrib import admin
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.html import format_html

from .models import (
    BlogPost,
    Brochure,
    Enquiry,
    PhoneNumber,
    Product,
    ProductCategory,
    Service,
    SiteSettings,
    Stat,
    TeamMember,
)

admin.site.site_header = "Mechmark website admin"
admin.site.site_title = "Mechmark admin"
admin.site.index_title = "Manage website content"


def thumb(field_name, label="Image"):
    """List-column showing a small preview of an image field (or a dash when empty)."""

    def _thumb(self, obj):
        file = getattr(obj, field_name)
        if not file:
            return format_html('<span style="color:#999">{}</span>', "coming soon")
        return format_html('<img src="{}" style="height:44px;width:auto;border-radius:3px" />', file.url)

    _thumb.short_description = label
    return _thumb


class PublishedListMixin:
    list_editable = ("sort_order", "is_published")
    list_filter = ("is_published",)


# ---------------------------------------------------------------------------
# Site settings (single page)
# ---------------------------------------------------------------------------


class PhoneInline(admin.TabularInline):
    model = PhoneNumber
    extra = 0
    fields = ("number", "note", "sort_order", "is_published")


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    inlines = [PhoneInline]
    fieldsets = (
        ("Company", {"fields": ("company_name", "address", "email", "whatsapp_number")}),
        ("Social links", {"fields": ("facebook_url", "instagram_url", "youtube_url")}),
        ("Homepage hero", {"fields": ("opening_animation", "hero_image", "hero_title", "hero_text")}),
        ("About block", {"fields": ("about_title", "about_text", "about_image")}),
        ("Catalogue block", {"fields": ("catalogue_image",)}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        # There is only one settings row: jump straight to its edit page.
        obj = SiteSettings.load()
        return redirect(reverse("admin:catalog_sitesettings_change", args=[obj.pk]))


# ---------------------------------------------------------------------------
# Products
# ---------------------------------------------------------------------------


class ProductInline(admin.StackedInline):
    model = Product
    extra = 0
    fields = (("name", "model_code", "slug"), "summary", "specs", "image", ("sort_order", "is_published"))
    prepopulated_fields = {"slug": ("name",)}
    show_change_link = True


@admin.register(ProductCategory)
class ProductCategoryAdmin(PublishedListMixin, admin.ModelAdmin):
    list_display = ("name", "preview", "series_code", "show_in_hero", "sort_order", "is_published")
    list_editable = ("show_in_hero", "sort_order", "is_published")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "summary", "description")
    inlines = [ProductInline]
    fieldsets = (
        (None, {"fields": ("name", "slug", "series_code", "icon")}),
        ("Content", {"fields": ("summary", "description", "features", "image")}),
        ("Display", {"fields": ("show_in_hero", "hero_label", "sort_order", "is_published")}),
    )
    preview = thumb("image")


@admin.register(Product)
class ProductAdmin(PublishedListMixin, admin.ModelAdmin):
    list_display = ("name", "preview", "model_code", "category", "sort_order", "is_published")
    list_filter = ("category", "is_published")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "model_code", "summary")
    preview = thumb("image")


@admin.register(Brochure)
class BrochureAdmin(PublishedListMixin, admin.ModelAdmin):
    list_display = ("title", "category", "file", "sort_order", "is_published")


# ---------------------------------------------------------------------------
# Homepage sections
# ---------------------------------------------------------------------------


@admin.register(Stat)
class StatAdmin(PublishedListMixin, admin.ModelAdmin):
    list_display = ("value", "label", "sort_order", "is_published")


@admin.register(Service)
class ServiceAdmin(PublishedListMixin, admin.ModelAdmin):
    list_display = ("title", "preview", "sort_order", "is_published")
    preview = thumb("image")


@admin.register(TeamMember)
class TeamMemberAdmin(PublishedListMixin, admin.ModelAdmin):
    list_display = ("name", "preview", "role", "sort_order", "is_published")
    preview = thumb("photo", "Photo")


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "preview", "published_at", "is_featured", "is_published")
    list_editable = ("is_featured", "is_published")
    list_filter = ("is_published", "is_featured")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "excerpt", "body")
    preview = thumb("image")


# ---------------------------------------------------------------------------
# Enquiries inbox
# ---------------------------------------------------------------------------


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "phone_link", "email", "product_interest", "created_at", "is_resolved")
    list_editable = ("is_resolved",)
    list_filter = ("is_resolved", "product_interest", "created_at")
    search_fields = ("name", "phone", "email", "product_interest", "message")
    readonly_fields = ("name", "phone", "email", "product_interest", "message", "created_at")
    actions = ["mark_resolved"]
    date_hierarchy = "created_at"

    def has_add_permission(self, request):
        return False

    @admin.display(description="Phone")
    def phone_link(self, obj):
        return format_html('<a href="tel:{}">{}</a>', obj.phone, obj.phone)

    @admin.action(description="Mark selected enquiries as resolved")
    def mark_resolved(self, request, queryset):
        updated = queryset.update(is_resolved=True)
        self.message_user(request, f"{updated} enquiry(s) marked as resolved.")
