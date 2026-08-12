
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Delivery
from .serializers import DeliverySerializer


# ==========================================
# Get Delivery By Order ID
# ==========================================

@api_view(["GET"])
def get_delivery_by_order(request, order_id):

    try:

        delivery = Delivery.objects.select_related(
            "order",
            "delivery_person"
        ).get(
            order_id=order_id
        )

        serializer = DeliverySerializer(
            delivery
        )

        return Response(
            {
                "success": True,
                "delivery": serializer.data
            },
            status=status.HTTP_200_OK
        )

    except Delivery.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Delivery not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )


# ==========================================
# Get All Deliveries
# ==========================================

@api_view(["GET"])
def get_all_deliveries(request):

    deliveries = Delivery.objects.select_related(
        "order",
        "delivery_person"
    ).all()

    serializer = DeliverySerializer(
        deliveries,
        many=True
    )

    return Response(
        {
            "success": True,
            "deliveries": serializer.data
        },
        status=status.HTTP_200_OK
    )


# ==========================================
# Update Delivery
# ==========================================

@api_view(["PUT"])
def update_delivery(request, delivery_id):

    try:

        delivery = Delivery.objects.select_related(
            "order"
        ).get(
            id=delivery_id
        )

    except Delivery.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Delivery not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )


    # Get delivery status from Admin
    new_status = request.data.get(
        "delivery_status"
    )


    # Check status
    if not new_status:

        return Response(
            {
                "success": False,
                "message": "Delivery status is required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # Allowed delivery statuses
    allowed_statuses = [
        "Preparing",
        "Out for Delivery",
        "Delivered"
    ]


    if new_status not in allowed_statuses:

        return Response(
            {
                "success": False,
                "message": "Invalid delivery status"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ==========================================
    # Update Delivery Status
    # ==========================================

    delivery.delivery_status = new_status
    delivery.save()


    # ==========================================
    # Update Related Order Status
    # ==========================================

    order = delivery.order

    order.status = new_status
    order.save()


    # Get latest data from database
    delivery.refresh_from_db()
    order.refresh_from_db()


    # Serialize delivery
    serializer = DeliverySerializer(
        delivery
    )


    return Response(
        {
            "success": True,

            "message": "Delivery status updated successfully",

            "delivery": serializer.data,

            "order_status": order.status
        },
        status=status.HTTP_200_OK
    )

