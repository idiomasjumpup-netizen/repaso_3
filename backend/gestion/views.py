from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from datetime import datetime, timedelta
from .models import Book, Order
from .serializers import BookSerializer, OrderSerializer
from .permissions import IsAdminOrReadOnly
from .mongo import db

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by("id")
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["isbn", "title"]
    ordering_fields = ["id", "isbn", "title", "stock"]

    def get_permissions(self):
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related("book").all().order_by("-id")
    serializer_class = OrderSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["book", "status"]
    search_fields = ["customer_name", "status", "book__title", "book__isbn"]
    ordering_fields = ["id", "customer_name", "status", "order_time", "created_at"]

    def get_permissions(self):
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()

    def perform_create(self, serializer):
        order = serializer.save()
        # Integración automática: Al crear Order en SQL, registrar una guía en shipping_labels (Mongo)
        try:
            db["shipping_labels"].insert_one({
                "order_id": order.id,
                "carrier": "SERVIENTREGA",
                "tracking_number": f"TRK-{order.id:06d}",
                "address": f"Dirección de cliente {order.customer_name}",
                "estimated_delivery": datetime.utcnow() + timedelta(days=3),
                "created_at": datetime.utcnow()
            })
        except Exception as e:
            print(f"Error registrando guía de envío inicial en Mongo: {e}")