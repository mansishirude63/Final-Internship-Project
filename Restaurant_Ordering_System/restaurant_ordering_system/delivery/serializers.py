from rest_framework import serializers
from .models import Delivery


class DeliverySerializer(serializers.ModelSerializer):

    delivery_person_name = serializers.SerializerMethodField()

    class Meta:
        model = Delivery
        fields = [
            "id",
            "order",
            "delivery_address",
            "delivery_person",
            "delivery_person_name",
            "delivery_status",
        ]

    def get_delivery_person_name(self, obj):

        if obj.delivery_person:
            full_name = (
                f"{obj.delivery_person.first_name} "
                f"{obj.delivery_person.last_name}"
            ).strip()

            if full_name:
                return full_name

            return obj.delivery_person.username

        return "Not Assigned"