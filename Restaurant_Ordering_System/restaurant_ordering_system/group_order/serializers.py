from rest_framework import serializers

from .models import (
    GroupOrder,
    GroupMember,
    GroupCartItem
)


# ================================
# GROUP MEMBER SERIALIZER
# ================================

class GroupMemberSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    class Meta:

        model = GroupMember

        fields = [
            "id",
            "user",
            "username",
            "joined_at"
        ]


# ================================
# GROUP ORDER SERIALIZER
# ================================

class GroupOrderSerializer(serializers.ModelSerializer):

    created_by_username = serializers.CharField(
        source="created_by.username",
        read_only=True
    )

    members = GroupMemberSerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = GroupOrder

        fields = [
            "id",
            "group_code",
            "created_by",
            "created_by_username",
            "status",
            "members",
            "created_at"
        ]


# ================================
# GROUP CART SERIALIZER
# ================================

class GroupCartItemSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    menu_name = serializers.CharField(
        source="menu.name",
        read_only=True
    )

    menu_price = serializers.DecimalField(
        source="menu.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    menu_image = serializers.ImageField(
        source="menu.image",
        read_only=True
    )

    total_price = serializers.SerializerMethodField()

    class Meta:

        model = GroupCartItem

        fields = [
            "id",
            "group_order",
            "user",
            "username",
            "menu",
            "menu_name",
            "menu_price",
            "menu_image",
            "quantity",
            "total_price",
            "added_at"
        ]

    def get_total_price(self, obj):

        return obj.menu.price * obj.quantity