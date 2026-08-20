from rest_framework import serializers
from .models import Book, Order

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "isbn", "title", "stock", "is_available", "created_at"]

class OrderSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)
    book_isbn = serializers.CharField(source="book.isbn", read_only=True)

    class Meta:
        model = Order
        fields = ["id", "book", "book_title", "book_isbn", "customer_name", "status", "order_time", "created_at"]