from django.db import models

class Menu(models.Model):
    status = [
        ('Starter','Starter'),
        ('Main Course','Main Course'),
        ('Dessert','Dessert'),
        ('Beverage','Beverage')
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50,choices=status)
    price = models.DecimalField(max_digits=8,decimal_places=2)
    is_available = models.BooleanField(default=True) 
    image = models.ImageField(upload_to="menu_images/", blank=True, null=True)

    def __str__(self):
        return self.name