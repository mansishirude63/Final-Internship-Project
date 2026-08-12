from django.db import models
from accounts.models import User
from orders.models import Order


class Delivery(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)

    delivery_address = models.TextField()

    delivery_person = models.ForeignKey(
    User,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="deliveries"
)
    delivery_status = models.CharField(
        max_length=50,
        choices=[
            ("Preparing", "Preparing"),
            ("Out for Delivery", "Out for Delivery"),
            ("Delivered", "Delivered"),
        ],
        default="Preparing"
    )

    def __str__(self):
        return f"Delivery for Order {self.order.id}"