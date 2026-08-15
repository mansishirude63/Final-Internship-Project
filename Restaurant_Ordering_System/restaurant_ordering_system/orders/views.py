from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Order, OrderItem
from .serializers import OrderSerializer

from cart.models import Cart
from delivery.models import Delivery
from accounts.models import User

from group_order.models import (
    GroupOrder,
    GroupCartItem,
    GroupMember
)


# ============================================================
# PLACE ORDER
# ============================================================

@api_view(["POST"])
def place_order(request):

    user_id = request.data.get("user")
    new_address = request.data.get("address")
    group_code = request.data.get("group_code")

    if not user_id:
        return Response(
            {
                "success": False,
                "message": "User id is required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        user = User.objects.get(id=user_id)

        if new_address:
            user.address = new_address
            user.save()

        if not user.address:
            return Response(
                {
                    "success": False,
                    "message": "Address is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ====================================================
        # GROUP ORDER
        # ====================================================

        if group_code:

            try:
                group_order = GroupOrder.objects.get(
                    group_code=group_code.upper()
                )

            except GroupOrder.DoesNotExist:

                return Response(
                    {
                        "success": False,
                        "message": "Group order not found"
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

            if group_order.status in [
                "Completed",
                "Cancelled"
            ]:

                return Response(
                    {
                        "success": False,
                        "message": "This group order is no longer active"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            is_member = GroupMember.objects.filter(
                group_order=group_order,
                user_id=user_id
            ).exists()

            if not is_member:

                return Response(
                    {
                        "success": False,
                        "message": "You are not a member of this group"
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            group_cart_items = GroupCartItem.objects.filter(
                group_order=group_order
            )

            if not group_cart_items.exists():

                return Response(
                    {
                        "success": False,
                        "message": "Group cart is empty"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            total_price = 0

            for item in group_cart_items:

                total_price += (
                    item.menu.price *
                    item.quantity
                )

            delivery_person = User.objects.filter(
                status="Staff"
            ).first()

            if not delivery_person:

                return Response(
                    {
                        "success": False,
                        "message": "No Staff delivery person available"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            order = Order.objects.create(
                user=user,
                address=user.address,
                total_price=total_price
            )

            Delivery.objects.create(
                order=order,
                delivery_address=user.address,
                delivery_person=delivery_person,
                delivery_status="Preparing"
            )

            for item in group_cart_items:

                OrderItem.objects.create(
                    order=order,
                    menu=item.menu,
                    quantity=item.quantity,
                    price=item.menu.price
                )

            group_cart_items.delete()

            group_order.status = "Confirmed"
            group_order.save()

            serializer = OrderSerializer(order)

            return Response(
                {
                    "success": True,
                    "message": "Group order placed successfully",
                    "order": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        # ====================================================
        # NORMAL ORDER
        # ====================================================

        else:

            cart_items = Cart.objects.filter(
                user_id=user_id
            )

            if not cart_items.exists():

                return Response(
                    {
                        "success": False,
                        "message": "Cart is empty"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            total_price = 0

            for item in cart_items:

                total_price += (
                    item.menu.price *
                    item.quantity
                )

            delivery_person = User.objects.filter(
                status="Staff"
            ).first()

            if not delivery_person:

                return Response(
                    {
                        "success": False,
                        "message": "No Staff delivery person available"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            order = Order.objects.create(
                user=user,
                address=user.address,
                total_price=total_price
            )

            Delivery.objects.create(
                order=order,
                delivery_address=user.address,
                delivery_person=delivery_person,
                delivery_status="Preparing"
            )

            for item in cart_items:

                OrderItem.objects.create(
                    order=order,
                    menu=item.menu,
                    quantity=item.quantity,
                    price=item.menu.price
                )

            cart_items.delete()

            serializer = OrderSerializer(order)

            return Response(
                {
                    "success": True,
                    "message": "Order placed successfully",
                    "order": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

    except User.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "User not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    except Exception as e:

        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


# ============================================================
# GET ALL ORDERS
# ============================================================

@api_view(["GET"])
def get_all_orders(request):

    orders = Order.objects.all()

    serializer = OrderSerializer(
        orders,
        many=True
    )

    return Response(
        {
            "success": True,
            "orders": serializer.data
        },
        status=status.HTTP_200_OK
    )


# ============================================================
# GET ORDERS BY USER
# ============================================================

@api_view(["GET"])
def get_user_orders(request, user_id):

    try:

        orders = Order.objects.filter(
            user_id=user_id
        )

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(
            {
                "success": True,
                "orders": serializer.data
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:

        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


# ============================================================
# GET ORDER BY ID
# ============================================================

@api_view(["GET"])
def get_order_by_id(request, order_id):

    try:

        order = Order.objects.get(
            id=order_id
        )

        serializer = OrderSerializer(order)

        return Response(
            {
                "success": True,
                "order": serializer.data
            },
            status=status.HTTP_200_OK
        )

    except Order.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Order not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )


# ============================================================
# UPDATE ORDER
# ============================================================

@api_view(["PUT"])
def update_order(request, order_id):

    try:

        order = Order.objects.get(
            id=order_id
        )

    except Order.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Order not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = OrderSerializer(
        order,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Order updated successfully",
                "order": serializer.data
            },
            status=status.HTTP_200_OK
        )

    return Response(
        {
            "success": False,
            "errors": serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )


# ============================================================
# CANCEL ORDER
# ============================================================

@api_view(["PATCH"])
def cancel_order(request, order_id):

    user_id = request.data.get("user")

    if not user_id:

        return Response(
            {
                "success": False,
                "message": "User id is required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        order = Order.objects.get(
            id=order_id
        )

    except Order.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Order not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Check order ownership

    if order.user_id != int(user_id):

        return Response(
            {
                "success": False,
                "message": "You can cancel only your own order"
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Delivered order cannot be cancelled

    if order.status == "Delivered":

        return Response(
            {
                "success": False,
                "message": "Delivered orders cannot be cancelled"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Already cancelled

    if order.status == "Cancelled":

        return Response(
            {
                "success": False,
                "message": "Order is already cancelled"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Cancel order

    order.status = "Cancelled"
    order.save()

    # Update delivery status too

    try:

        delivery = Delivery.objects.get(
            order=order
        )

        delivery.delivery_status = "Cancelled"
        delivery.save()

    except Delivery.DoesNotExist:

        pass

    serializer = OrderSerializer(order)

    return Response(
        {
            "success": True,
            "message": "Order cancelled successfully",
            "order": serializer.data
        },
        status=status.HTTP_200_OK
    )


# ============================================================
# DELETE ORDER
# ============================================================

@api_view(["DELETE"])
def delete_order(request, order_id):

    try:

        order = Order.objects.get(
            id=order_id
        )

        order.delete()

        return Response(
            {
                "success": True,
                "message": "Order deleted successfully"
            },
            status=status.HTTP_200_OK
        )

    except Order.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Order not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )


# ============================================================
# CONFIRM GROUP ORDER
# ============================================================

@api_view(["POST"])
def confirm_group_order(request):

    group_code = request.data.get("group_code")
    user_id = request.data.get("user")
    new_address = request.data.get("address")

    if not group_code:

        return Response(
            {
                "success": False,
                "message": "Group code is required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user_id:

        return Response(
            {
                "success": False,
                "message": "User id is required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        user = User.objects.get(
            id=user_id
        )

        group_order = GroupOrder.objects.get(
            group_code=group_code.upper()
        )

        is_member = GroupMember.objects.filter(
            group_order=group_order,
            user_id=user_id
        ).exists()

        if not is_member:

            return Response(
                {
                    "success": False,
                    "message": "You are not a member of this group"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if group_order.status in [
            "Completed",
            "Cancelled"
        ]:

            return Response(
                {
                    "success": False,
                    "message": "This group order is no longer active"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        group_cart_items = GroupCartItem.objects.filter(
            group_order=group_order
        )

        if not group_cart_items.exists():

            return Response(
                {
                    "success": False,
                    "message": "Group cart is empty"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_address:

            user.address = new_address
            user.save()

        if not user.address:

            return Response(
                {
                    "success": False,
                    "message": "Address is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        total_price = 0

        for item in group_cart_items:

            total_price += (
                item.menu.price *
                item.quantity
            )

        delivery_person = User.objects.filter(
            status="Staff"
        ).first()

        if not delivery_person:

            return Response(
                {
                    "success": False,
                    "message": "No Staff delivery person available"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        order = Order.objects.create(
            user=user,
            address=user.address,
            total_price=total_price
        )

        Delivery.objects.create(
            order=order,
            delivery_address=user.address,
            delivery_person=delivery_person,
            delivery_status="Preparing"
        )

        for item in group_cart_items:

            OrderItem.objects.create(
                order=order,
                menu=item.menu,
                quantity=item.quantity,
                price=item.menu.price
            )

        group_cart_items.delete()

        group_order.status = "Confirmed"
        group_order.save()

        serializer = OrderSerializer(order)

        return Response(
            {
                "success": True,
                "message": "Group order confirmed successfully",
                "order": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    except User.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "User not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    except GroupOrder.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Group order not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    except Exception as e:

        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )