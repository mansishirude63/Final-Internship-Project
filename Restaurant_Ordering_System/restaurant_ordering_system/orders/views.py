
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

    # Present only for group orders
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

        # ====================================================
        # GET USER
        # ====================================================

        user = User.objects.get(
            id=user_id
        )


        # ====================================================
        # UPDATE ADDRESS
        # ====================================================

        if new_address:

            user.address = new_address
            user.save()


        # ====================================================
        # CHECK ADDRESS
        # ====================================================

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

            # ------------------------------------------------
            # GET GROUP
            # ------------------------------------------------

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


            # ------------------------------------------------
            # CHECK GROUP STATUS
            # ------------------------------------------------

            if group_order.status in [
                "Completed",
                "Cancelled"
            ]:

                return Response(
                    {
                        "success": False,
                        "message":
                            "This group order is no longer active"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ------------------------------------------------
            # CHECK GROUP MEMBER
            # ------------------------------------------------

            is_member = GroupMember.objects.filter(
                group_order=group_order,
                user_id=user_id
            ).exists()


            if not is_member:

                return Response(
                    {
                        "success": False,
                        "message":
                            "You are not a member of this group"
                    },
                    status=status.HTTP_403_FORBIDDEN
                )


            # ------------------------------------------------
            # GET GROUP CART
            # ------------------------------------------------

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


            # ------------------------------------------------
            # CALCULATE TOTAL
            # ------------------------------------------------

            total_price = 0


            for item in group_cart_items:

                total_price += (
                    item.menu.price *
                    item.quantity
                )


            # ------------------------------------------------
            # FIND DELIVERY PERSON
            # ------------------------------------------------

            delivery_person = User.objects.filter(
                status="Staff"
            ).first()


            if not delivery_person:

                return Response(
                    {
                        "success": False,
                        "message":
                            "No Staff delivery person available"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ------------------------------------------------
            # CREATE ORDER
            # ------------------------------------------------

            order = Order.objects.create(

                user=user,

                address=user.address,

                total_price=total_price

            )


            # ------------------------------------------------
            # CREATE DELIVERY
            # ------------------------------------------------

            Delivery.objects.create(

                order=order,

                delivery_address=user.address,

                delivery_person=delivery_person,

                delivery_status="Preparing"

            )


            # ------------------------------------------------
            # CREATE ORDER ITEMS
            # ------------------------------------------------

            for item in group_cart_items:

                OrderItem.objects.create(

                    order=order,

                    menu=item.menu,

                    quantity=item.quantity,

                    price=item.menu.price

                )


            # ------------------------------------------------
            # CLEAR GROUP CART
            # ------------------------------------------------

            group_cart_items.delete()


            # ------------------------------------------------
            # UPDATE GROUP STATUS
            # ------------------------------------------------

            group_order.status = "Confirmed"

            group_order.save()


            # ------------------------------------------------
            # RESPONSE
            # ------------------------------------------------

            serializer = OrderSerializer(
                order
            )


            return Response(
                {
                    "success": True,

                    "message":
                        "Group order placed successfully",

                    "order":
                        serializer.data
                },
                status=status.HTTP_201_CREATED
            )


        # ====================================================
        # NORMAL ORDER
        # ====================================================

        else:

            # ------------------------------------------------
            # GET NORMAL CART
            # ------------------------------------------------

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


            # ------------------------------------------------
            # CALCULATE TOTAL
            # ------------------------------------------------

            total_price = 0


            for item in cart_items:

                total_price += (
                    item.menu.price *
                    item.quantity
                )


            # ------------------------------------------------
            # FIND DELIVERY PERSON
            # ------------------------------------------------

            delivery_person = User.objects.filter(
                status="Staff"
            ).first()


            if not delivery_person:

                return Response(
                    {
                        "success": False,
                        "message":
                            "No Staff delivery person available"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ------------------------------------------------
            # CREATE ORDER
            # ------------------------------------------------

            order = Order.objects.create(

                user=user,

                address=user.address,

                total_price=total_price

            )


            # ------------------------------------------------
            # CREATE DELIVERY
            # ------------------------------------------------

            Delivery.objects.create(

                order=order,

                delivery_address=user.address,

                delivery_person=delivery_person,

                delivery_status="Preparing"

            )


            # ------------------------------------------------
            # CREATE ORDER ITEMS
            # ------------------------------------------------

            for item in cart_items:

                OrderItem.objects.create(

                    order=order,

                    menu=item.menu,

                    quantity=item.quantity,

                    price=item.menu.price

                )


            # ------------------------------------------------
            # CLEAR NORMAL CART
            # ------------------------------------------------

            cart_items.delete()


            # ------------------------------------------------
            # RESPONSE
            # ------------------------------------------------

            serializer = OrderSerializer(
                order
            )


            return Response(
                {
                    "success": True,

                    "message":
                        "Order placed successfully",

                    "order":
                        serializer.data
                },
                status=status.HTTP_201_CREATED
            )


    # ========================================================
    # USER NOT FOUND
    # ========================================================

    except User.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "User not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )


    # ========================================================
    # OTHER ERROR
    # ========================================================

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

        serializer = OrderSerializer(
            order
        )

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
                "message":
                    "Order updated successfully",
                "order":
                    serializer.data
            },
            status=status.HTTP_200_OK
        )


    return Response(
        {
            "success": False,
            "errors":
                serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
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
                "message":
                    "Order deleted successfully"
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
#
# Kept for your existing API.
#
# Your new flow uses:
#
# GroupCart
#     ↓
# AddOrder
#     ↓
# place_order()
#     ↓
# Payment
#     ↓
# Delivery
#
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


        # Check member
        is_member = GroupMember.objects.filter(
            group_order=group_order,
            user_id=user_id
        ).exists()


        if not is_member:

            return Response(
                {
                    "success": False,
                    "message":
                        "You are not a member of this group"
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
                    "message":
                        "This group order is no longer active"
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
                    "message":
                        "No Staff delivery person available"
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


        serializer = OrderSerializer(
            order
        )


        return Response(
            {
                "success": True,

                "message":
                    "Group order confirmed successfully",

                "order":
                    serializer.data
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
