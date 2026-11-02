import json
import shutil
import tempfile
from io import StringIO

from django.contrib.auth import get_user_model
from django.core import mail
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import Enquiry, ProductCategory, SiteSettings, TeamMember

TEMP_MEDIA = tempfile.mkdtemp(prefix="mechmark-test-media-")


def tearDownModule():
    shutil.rmtree(TEMP_MEDIA, ignore_errors=True)


# 1x1 transparent PNG
PNG = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89"
    b"\x00\x00\x00\rIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82"
)


@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class SiteContentApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_content", stdout=StringIO())

    def get_site(self):
        response = self.client.get(reverse("site-content"))
        self.assertEqual(response.status_code, 200)
        return response.json()

    def test_payload_matches_frontend_shape(self):
        data = self.get_site()
        for key in ("company", "hero", "featured", "productFamilies", "about", "stats", "brochures", "services",
                    "teamMembers"):
            self.assertIn(key, data)
        self.assertEqual(len(data["company"]["phones"]), 3)
        self.assertEqual(data["company"]["phones"][0]["tel"], "+919496801821")
        self.assertEqual(data["company"]["whatsapp"], "https://wa.me/919496801821")
        self.assertEqual([f["slug"] for f in data["productFamilies"]][0], "dryers")
        self.assertEqual(len(data["about"]["paragraphs"]), 2)
        self.assertEqual(data["stats"][0], ["12", "States served"])
        self.assertEqual(len(data["brochures"]), 4)
        self.assertTrue(data["brochures"][0][1].endswith(".pdf"))
        self.assertEqual(data["featured"]["cta"], "Read more")

    def test_empty_media_is_null_for_placeholders(self):
        data = self.get_site()
        self.assertIsNone(data["hero"]["animation"])
        self.assertIsNone(data["productFamilies"][0]["image"])
        self.assertIsNone(data["teamMembers"][0]["image"])

    def test_hero_quick_links_follow_show_in_hero(self):
        labels = [link["label"] for link in self.get_site()["hero"]["quickLinks"]]
        self.assertEqual(labels, ["Dryers", "Copra Cutter", "Oil Press"])

    def test_dryer_models_are_included(self):
        dryers = self.get_site()["productFamilies"][0]
        self.assertEqual(len(dryers["models"]), 8)
        self.assertIn("Trays: 5", dryers["models"][5]["specs"])

    def test_unpublished_items_are_hidden(self):
        ProductCategory.objects.filter(slug="storage-tank").update(is_published=False)
        TeamMember.objects.filter(name="Shreyas KS").update(is_published=False)
        data = self.get_site()
        self.assertNotIn("storage-tank", [f["slug"] for f in data["productFamilies"]])
        self.assertNotIn("Shreyas KS", [t["name"] for t in data["teamMembers"]])

    def test_uploaded_image_is_returned_as_absolute_url(self):
        member = TeamMember.objects.first()
        member.photo = SimpleUploadedFile("face.png", PNG, content_type="image/png")
        member.save()
        url = self.get_site()["teamMembers"][0]["image"]
        self.assertTrue(url.startswith("http://testserver/media/team/"))
        member.photo.delete()

    def test_seed_is_idempotent_and_keeps_admin_edits(self):
        site = SiteSettings.load()
        site.hero_title = "Edited in admin"
        site.save()
        call_command("seed_content", stdout=StringIO())
        self.assertEqual(SiteSettings.load().hero_title, "Edited in admin")
        self.assertEqual(ProductCategory.objects.count(), 5)


@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class SiteSettingsSingletonTests(TestCase):
    def test_only_one_row(self):
        SiteSettings.load()
        SiteSettings(company_name="Second").save()
        self.assertEqual(SiteSettings.objects.count(), 1)
        self.assertEqual(SiteSettings.load().company_name, "Second")


@override_settings(ENQUIRY_NOTIFY_EMAILS=["owner@example.com"], MEDIA_ROOT=TEMP_MEDIA)
class EnquiryApiTests(TestCase):
    url = "/api/enquiries/"

    def setUp(self):
        cache.clear()

    def post(self, payload, **extra):
        return self.client.post(self.url, data=json.dumps(payload), content_type="application/json", **extra)

    def test_valid_enquiry_is_saved_and_emailed(self):
        response = self.post({"name": "Ravi", "phone": "+91 98765 43210", "productInterest": "Dryers",
                              "message": "Need a 5 tray dryer"})
        self.assertEqual(response.status_code, 201)
        enquiry = Enquiry.objects.get()
        self.assertEqual(enquiry.product_interest, "Dryers")
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Ravi", mail.outbox[0].subject)

    def test_message_is_optional(self):
        self.assertEqual(self.post({"name": "Ravi", "phone": "9876543210"}).status_code, 201)

    def test_missing_name_or_phone_rejected(self):
        response = self.post({"name": "", "phone": ""})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["fields"], ["name", "phone"])
        self.assertEqual(Enquiry.objects.count(), 0)

    def test_bad_phone_rejected(self):
        self.assertEqual(self.post({"name": "A", "phone": "abc"}).status_code, 400)

    def test_invalid_json_rejected(self):
        response = self.client.post(self.url, data="not json", content_type="application/json")
        self.assertEqual(response.status_code, 400)
        response = self.client.post(self.url, data="[1,2]", content_type="application/json")
        self.assertEqual(response.status_code, 400)

    def test_long_fields_are_truncated(self):
        self.post({"name": "x" * 500, "phone": "9876543210", "message": "y" * 10000})
        enquiry = Enquiry.objects.get()
        self.assertEqual(len(enquiry.name), 140)
        self.assertEqual(len(enquiry.message), 3000)

    def test_honeypot_silently_drops_bots(self):
        response = self.post({"name": "Bot", "phone": "9876543210", "website": "http://spam"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Enquiry.objects.count(), 0)

    def test_rate_limit(self):
        for _ in range(10):
            self.assertEqual(self.post({"name": "A", "phone": "9876543210"}).status_code, 201)
        self.assertEqual(self.post({"name": "A", "phone": "9876543210"}).status_code, 429)

    def test_get_not_allowed(self):
        self.assertEqual(self.client.get(self.url).status_code, 405)

    def test_cors_header_for_frontend_origin(self):
        response = self.post({"name": "A", "phone": "9876543210"}, HTTP_ORIGIN="http://127.0.0.1:5173")
        self.assertEqual(response["Access-Control-Allow-Origin"], "http://127.0.0.1:5173")


@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class AdminPagesTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_content", stdout=StringIO())
        cls.user = get_user_model().objects.create_superuser("admin", "a@example.com", "pass-12345")

    def setUp(self):
        self.client.force_login(self.user)

    def test_index_and_branding(self):
        response = self.client.get("/admin/")
        self.assertContains(response, "Website admin")
        self.assertContains(response, "How this works")

    def test_site_settings_goes_straight_to_edit_page(self):
        response = self.client.get("/admin/catalog/sitesettings/")
        self.assertRedirects(response, "/admin/catalog/sitesettings/1/change/")
        self.assertContains(self.client.get("/admin/catalog/sitesettings/1/change/"), "Opening animation")

    def test_every_changelist_and_add_page_loads(self):
        for model in ("productcategory", "product", "brochure", "stat", "service", "teammember", "blogpost",
                      "enquiry"):
            self.assertEqual(self.client.get(f"/admin/catalog/{model}/").status_code, 200, model)
        for model in ("productcategory", "product", "stat", "service", "teammember", "blogpost"):
            self.assertEqual(self.client.get(f"/admin/catalog/{model}/add/").status_code, 200, model)
        category = ProductCategory.objects.get(slug="dryers")
        self.assertEqual(self.client.get(f"/admin/catalog/productcategory/{category.pk}/change/").status_code, 200)

    def test_enquiries_cannot_be_added_manually(self):
        self.assertEqual(self.client.get("/admin/catalog/enquiry/add/").status_code, 403)

    def test_wrong_file_type_rejected(self):
        category = ProductCategory.objects.get(slug="copra-cutter")
        field = category._meta.get_field("image")
        with self.assertRaises(Exception):
            field.run_validators(SimpleUploadedFile("evil.exe", b"MZ"))
