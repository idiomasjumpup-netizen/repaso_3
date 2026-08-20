from django.db import models

class Book(models.Model):
    isbn = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=150)
    stock = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "books"

    def __str__(self):
        return f"{self.isbn} - {self.title}"

class Order(models.Model):
    class Status(models.TextChoices):
        RECEIVED = "RECEIVED", "Recibido"
        PACKING = "PACKING", "Empacando"
        SHIPPED = "SHIPPED", "Enviado"
        DELIVERED = "DELIVERED", "Entregado"
        CANCELLED = "CANCELLED", "Cancelado"

    book = models.ForeignKey(Book, on_delete=models.PROTECT, related_name="orders")
    customer_name = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.RECEIVED
    )
    order_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "orders"

    def __str__(self):
        return f"Pedido {self.id} - {self.customer_name} ({self.status})"
