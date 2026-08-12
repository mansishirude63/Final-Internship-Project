
from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    # Customer name
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "user_name",
            "address",
            "total_price",
            "status",
            "order_date",
            "items",
        ]

    def get_user_name(self, obj):

        if obj.user:

            full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()

            if full_name:
                return full_name

            return obj.user.username

        return "Unknown"
