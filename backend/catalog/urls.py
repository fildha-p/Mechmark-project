from django.urls import path

from . import views

urlpatterns = [
    path("site/", views.site_content, name="site-content"),
    path("products/", views.product_list, name="product-list"),
    path("posts/", views.post_list, name="post-list"),
    path("enquiries/", views.create_enquiry, name="create-enquiry"),
]
