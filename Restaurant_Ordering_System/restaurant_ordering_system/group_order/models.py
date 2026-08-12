from django.db import models
from django.conf import settings
import uuid

from menu.models import Menu


class GroupOrder(models.Model):

    STATUS_CHOICES = [
        ("Waiting", "Waiting"),
        ("Ordering", "Ordering"),
        ("Confirmed", "Confirmed"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    group_code = models.CharField(
        max_length=10,
        unique=True,
        editable=False
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_group_orders"
    )

    budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Waiting"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def save(self, *args, **kwargs):

        if not self.group_code:
            self.group_code = uuid.uuid4().hex[:8].upper()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.group_code} - {self.created_by.username}"

    STATUS_CHOICES = [
        ("Waiting", "Waiting"),
        ("Ordering", "Ordering"),
        ("Confirmed", "Confirmed"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    group_code = models.CharField(
        max_length=10,
        unique=True,
        editable=False
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_group_orders"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Waiting"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        if not self.group_code:
            self.group_code = uuid.uuid4().hex[:8].upper()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.group_code} - {self.created_by.username}"


class GroupMember(models.Model):

    group_order = models.ForeignKey(
        GroupOrder,
        on_delete=models.CASCADE,
        related_name="members"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="group_memberships"
    )

    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["group_order", "user"],
                name="unique_group_member"
            )
        ]

    def __str__(self):
        return f"{self.user.username} - {self.group_order.group_code}"


class GroupCartItem(models.Model):

    group_order = models.ForeignKey(
        GroupOrder,
        on_delete=models.CASCADE,
        related_name="cart_items"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="group_cart_items"
    )

    menu = models.ForeignKey(
        Menu,
        on_delete=models.CASCADE,
        related_name="group_cart_items"
    )

    quantity = models.PositiveIntegerField(default=1)

    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.menu.name} - "
            f"{self.group_order.group_code}"
        )