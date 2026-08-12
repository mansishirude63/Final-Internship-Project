from django.db import models
from accounts.models import User
from menu.models import Menu


class Order(models.Model):

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Preparing', 'Preparing'),
        ('Out for Delivery', 'Out for Delivery'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]


    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders"
    )


    address = models.TextField(
    blank=True,
    null=True,
    default=""
)

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Pending"
    )


    order_date = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):
        return f"Order #{self.id}"



class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )


    menu = models.ForeignKey(
        Menu,
        on_delete=models.CASCADE
    )


    quantity = models.PositiveIntegerField()


    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


    def __str__(self):
        return f"{self.menu.name} x {self.quantity}"