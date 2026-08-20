from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, OrderViewSet
from .publishers_views import publishers_list_create, publishers_detail
from .shipping_labels_views import shipping_labels_list_create, shipping_labels_detail

router = DefaultRouter()
router.register(r"books", BookViewSet, basename="books")
router.register(r"orders", OrderViewSet, basename="orders")

urlpatterns = [
    # Mongo endpoints
    path("publishers/", publishers_list_create),
    path("publishers/<str:id>/", publishers_detail),
    path("shipping-labels/", shipping_labels_list_create),
    path("shipping-labels/<str:id>/", shipping_labels_detail),
]
urlpatterns += router.urls