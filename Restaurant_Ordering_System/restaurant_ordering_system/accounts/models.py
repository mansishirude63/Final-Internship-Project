from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    STATUS_CHOICES = (
        ('Customer', 'Customer'),
        ('Staff', 'Staff'),
        ('Admin', 'Admin'),
    )

    email = models.EmailField(unique=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Customer'
    )

    address = models.TextField(
        blank=True,
        null=True
    )


    def __str__(self):
        return f"{self.first_name} {self.last_name}".strip()