"""Content models for the Mechmark website.

Everything the public site shows is editable from the Django admin.
Empty image/text fields are fine: the frontend shows "coming soon" placeholders.
"""

from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models

IMAGE_HELP = "JPG, PNG or WebP. Leave empty to show a 'coming soon' placeholder."
MAX_IMAGE_MB = 5
MAX_VIDEO_MB = 40
MAX_PDF_MB = 20


def _check_size(file, megabytes):
    if file and file.size > megabytes * 1024 * 1024:
        raise ValidationError(f"File is too large. Maximum size is {megabytes} MB.")


# Module-level functions so migrations can serialise them.
def validate_image_size(file):
    _check_size(file, MAX_IMAGE_MB)


def validate_video_size(file):
    _check_size(file, MAX_VIDEO_MB)


def validate_pdf_size(file):
    _check_size(file, MAX_PDF_MB)
image_ext = FileExtensionValidator(["jpg", "jpeg", "png", "webp"])
video_ext = FileExtensionValidator(["mp4", "webm"])
pdf_ext = FileExtensionValidator(["pdf"])


def image_field(upload_to, **kwargs):
    return models.ImageField(
        upload_to=upload_to,
        blank=True,
        validators=[image_ext, validate_image_size],
        help_text=kwargs.pop("help_text", IMAGE_HELP),
        **kwargs,
    )


class Ordered(models.Model):
    sort_order = models.PositiveIntegerField(default=0, help_text="Lower numbers appear first.")
    is_published = models.BooleanField(default=True, help_text="Untick to hide from the website.")

    class Meta:
        abstract = True
        ordering = ["sort_order", "id"]


# ---------------------------------------------------------------------------
# Site-wide settings (single row)
# ---------------------------------------------------------------------------


class SiteSettings(models.Model):
    # Company
    company_name = models.CharField(max_length=120, default="Mechmark Industries")
    address = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    whatsapp_number = models.CharField(
        max_length=20, blank=True, help_text="Digits only with country code, e.g. 919496801821"
    )
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)

    # Hero
    opening_animation = models.FileField(
        upload_to="site/",
        blank=True,
        validators=[video_ext, validate_video_size],
        help_text=f"MP4 or WebM, max {MAX_VIDEO_MB} MB. Plays once on the homepage. "
        "Leave empty to show the 'Opening animation - coming soon' placeholder.",
    )
    hero_image = image_field(
        "site/", help_text="Optional still image shown in the hero if there is no animation (and as the video poster)."
    )
    hero_title = models.CharField(max_length=160, default="Food Processing Machinery, Built in Kerala")
    hero_text = models.TextField(blank=True)

    # About block
    about_title = models.CharField(max_length=160, default="Precision in Machinery, Excellence in Quality")
    about_text = models.TextField(blank=True, help_text="Separate paragraphs with a blank line.")
    about_image = image_field("site/")

    # Catalogue block
    catalogue_image = image_field("site/", help_text="Image or video thumbnail beside the brochure list.")

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def __str__(self):
        return "Site settings"

    def save(self, *args, **kwargs):
        self.pk = 1  # enforce a single row
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass  # never delete the settings row

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class PhoneNumber(Ordered):
    settings = models.ForeignKey(SiteSettings, on_delete=models.CASCADE, related_name="phones")
    number = models.CharField(max_length=30, help_text="As displayed, e.g. +91 9496 801 821")
    note = models.CharField(max_length=40, blank=True, help_text="Optional label, e.g. Main")

    class Meta(Ordered.Meta):
        verbose_name = "Phone number"

    def __str__(self):
        return self.number

    @property
    def tel(self):
        return "".join(ch for ch in self.number if ch.isdigit() or ch == "+")


# ---------------------------------------------------------------------------
# Products
# ---------------------------------------------------------------------------


class ProductCategory(Ordered):
    """A product family shown as a tile in 'Select your product' (e.g. Dryers, Copra Cutter)."""

    ICON_CHOICES = [
        ("dryer", "Dryer"),
        ("copraCutter", "Copra cutter"),
        ("oilPress", "Oil press"),
        ("filterPress", "Filter press"),
        ("storageTank", "Storage tank"),
        ("generic", "Generic machine"),
    ]

    name = models.CharField(max_length=160)
    slug = models.SlugField(unique=True, help_text="Used in the page address. Avoid changing once live.")
    series_code = models.CharField(max_length=80, blank=True, help_text="e.g. CTR Series")
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="generic")
    summary = models.TextField(blank=True, help_text="One or two sentences.")
    description = models.TextField(blank=True, help_text="Longer description for the product page.")
    features = models.TextField(blank=True, help_text="One feature per line (up to 4 show on the product page).")
    image = image_field("products/")
    show_in_hero = models.BooleanField(default=False, help_text="Show as a yellow quick-link button under the hero.")
    hero_label = models.CharField(max_length=40, blank=True, help_text="Short button label, defaults to the name.")

    class Meta(Ordered.Meta):
        verbose_name = "Product family"
        verbose_name_plural = "Product families"

    def __str__(self):
        return self.name

    @property
    def feature_list(self):
        return [line.strip(" -•\t") for line in self.features.splitlines() if line.strip()]


class Product(Ordered):
    """An individual machine model within a family (e.g. ELDR-BXD-900)."""

    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=180)
    model_code = models.CharField(max_length=120, blank=True)
    slug = models.SlugField(unique=True)
    summary = models.TextField(blank=True)
    specs = models.TextField(blank=True, help_text="One spec per line, e.g. 'Trays: 5'.")
    image = image_field("products/")
    is_featured = models.BooleanField(default=False)

    class Meta(Ordered.Meta):
        verbose_name = "Product model"
        verbose_name_plural = "Product models"

    def __str__(self):
        return f"{self.model_code} - {self.name}" if self.model_code else self.name

    @property
    def spec_list(self):
        return [line.strip() for line in self.specs.splitlines() if line.strip()]


class Brochure(Ordered):
    title = models.CharField(max_length=160)
    file = models.FileField(upload_to="brochures/", validators=[pdf_ext, validate_pdf_size])
    category = models.ForeignKey(
        ProductCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="brochures"
    )

    class Meta(Ordered.Meta):
        pass

    def __str__(self):
        return self.title


# ---------------------------------------------------------------------------
# Homepage sections
# ---------------------------------------------------------------------------


class Stat(Ordered):
    value = models.CharField(max_length=20, help_text="e.g. 1250+")
    label = models.CharField(max_length=60, help_text="e.g. Happy clients")

    class Meta(Ordered.Meta):
        pass

    def __str__(self):
        return f"{self.value} {self.label}"


class Service(Ordered):
    title = models.CharField(max_length=120)
    text = models.TextField(blank=True)
    image = image_field("services/")
    button_label = models.CharField(max_length=40, default="Learn more")

    class Meta(Ordered.Meta):
        pass

    def __str__(self):
        return self.title


class TeamMember(Ordered):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120)
    photo = image_field("team/", help_text="Square photo works best. Leave empty to show initials.")

    class Meta(Ordered.Meta):
        pass

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    title = models.CharField(max_length=220)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField()
    body = models.TextField(blank=True)
    image = image_field("blog/")
    external_url = models.URLField(blank=True, help_text="Optional: link to an existing article instead of the body.")
    published_at = models.DateField(null=True, blank=True)
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False, help_text="Show this post in the homepage feature block.")

    class Meta:
        ordering = ["-published_at", "title"]

    def __str__(self):
        return self.title


# ---------------------------------------------------------------------------
# Enquiries (submitted from the website form)
# ---------------------------------------------------------------------------


class Enquiry(models.Model):
    name = models.CharField(max_length=140)
    phone = models.CharField(max_length=40)
    email = models.EmailField(blank=True)
    product_interest = models.CharField(max_length=180, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "enquiries"

    def __str__(self):
        return f"{self.name} - {self.product_interest or 'General enquiry'}"
