from rest_framework import serializers
from .models import Cart

class CartSerializer(serializers.ModelSerializer):
    menu_name = serializers.CharField(source="menu.name", read_only=True)
    menu_price = serializers.DecimalField(
        source="menu.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    menu_image = serializers.ImageField(source="menu.image", read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            "id",
            "user",
            "menu",
            "menu_name",
            "menu_price",
            "menu_image",
            "quantity",
            "total_price",
            "added_at",
        ]
        read_only_fields = ["user"]

    def get_total_price(self, obj):
        return obj.menu.price * obj.quantity