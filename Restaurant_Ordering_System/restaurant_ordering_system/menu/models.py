from django.db import models

class Menu(models.Model):
    status = [
        ('Starter', 'Starter'),
        ('Main Course', 'Main Course'),
        ('Dessert', 'Dessert'),
        ('Beverage', 'Beverage')
    ]

    food_types = [
        ('Veg', 'Veg'),
        ('Non-Veg', 'Non-Veg')
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=status)

    # NEW
    food_type = models.CharField(
        max_length=10,
        choices=food_types,
        default='Veg'
    )

    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_available = models.BooleanField(default=True)
    image = models.ImageField(
        upload_to="menu_images/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.name