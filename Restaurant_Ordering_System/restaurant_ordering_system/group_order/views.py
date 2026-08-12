
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import (
    GroupOrder,
    GroupMember,
    GroupCartItem
)

from .serializers import (
    GroupOrderSerializer,
    GroupMemberSerializer,
    GroupCartItemSerializer
)

from menu.models import Menu


# ============================================================
# CREATE GROUP ORDER
# ============================================================

@api_view(["POST"])
def create_group_order(request):

    user_id = request.data.get("user")
    budget = request.data.get("budget")

    if not user_id:
        return Response(
            {
                "error": "User ID is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate budget
    if budget is not None:

        try:

            budget = float(budget)

            if budget <= 0:

                return Response(
                    {
                        "error":
                            "Budget must be greater than 0."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        except ValueError:

            return Response(
                {
                    "error": "Invalid budget."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    group_order = GroupOrder.objects.create(
        created_by_id=user_id,
        budget=budget,
        status="Ordering"
    )

    GroupMember.objects.create(
        group_order=group_order,
        user_id=user_id
    )

    serializer = GroupOrderSerializer(
        group_order
    )

    return Response(
        serializer.data,
        status=status.HTTP_201_CREATED
    )


# ============================================================
# JOIN GROUP ORDER
# ============================================================

@api_view(["POST"])
def join_group_order(request):

    group_code = request.data.get("group_code")
    user_id = request.data.get("user")

    if not group_code or not user_id:

        return Response(
            {
                "error":
                    "Group code and user ID are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        group_order = GroupOrder.objects.get(
            group_code=group_code.upper()
        )

    except GroupOrder.DoesNotExist:

        return Response(
            {
                "error":
                    "Group order not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )


    if group_order.status in [
        "Completed",
        "Cancelled"
    ]:

        return Response(
            {
                "error":
                    "This group order is no longer active."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    member, created = GroupMember.objects.get_or_create(
        group_order=group_order,
        user_id=user_id
    )


    if not created:

        return Response(
            {
                "message":
                    "You are already a member of this group."
            },
            status=status.HTTP_200_OK
        )


    serializer = GroupMemberSerializer(
        member
    )

    return Response(
        {
            "message":
                "Successfully joined the group.",
            "member":
                serializer.data
        },
        status=status.HTTP_201_CREATED
    )


# ============================================================
# GET GROUP ORDER
# ============================================================

@api_view(["GET"])
def get_group_order(request, group_code):

    try:

        group_order = GroupOrder.objects.get(
            group_code=group_code.upper()
        )

    except GroupOrder.DoesNotExist:

        return Response(
            {
                "error":
                    "Group order not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )


    serializer = GroupOrderSerializer(
        group_order
    )

    return Response(
        serializer.data
    )


# ============================================================
# LEAVE GROUP ORDER
# ============================================================

@api_view(["POST"])
def leave_group_order(request):

    group_code = request.data.get("group_code")
    user_id = request.data.get("user")

    if not group_code or not user_id:

        return Response(
            {
                "error":
                    "Group code and user ID are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    try:

        group_order = GroupOrder.objects.get(
            group_code=group_code.upper()
        )

    except GroupOrder.DoesNotExist:

        return Response(
            {
                "error":
                    "Group order not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )


    try:

        member = GroupMember.objects.get(
            group_order=group_order,
            user_id=user_id
        )

    except GroupMember.DoesNotExist:

        return Response(
            {
                "error":
                    "You are not a member of this group."
            },
            status=status.HTTP_404_NOT_FOUND
        )


    member.delete()


    return Response(
        {
            "message":
                "You left the group successfully."
        },
        status=status.HTTP_200_OK
    )


# ============================================================
# ADD ITEM TO GROUP CART
# ============================================================

@api_view(["POST"])
def add_group_cart_item(request):

    group_code = request.data.get("group_code")
    user_id = request.data.get("user")
    menu_id = request.data.get("menu")
    quantity = request.data.get("quantity", 1)


    if not group_code or not user_id or not menu_id:

        return Response(
            {
                "error":
                    "Group code, user and menu are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    try:

        group_order = GroupOrder.objects.get(
            group_code=group_code.upper()
        )

    except GroupOrder.DoesNotExist:

        return Response(
            {
                "error":
                    "Group order not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )


    # Check if user belongs to group
    if not GroupMember.objects.filter(
        group_order=group_order,
        user_id=user_id
    ).exists():

        return Response(
            {
                "error":
                    "You are not a member of this group."
            },
            status=status.HTTP_403_FORBIDDEN
        )


    # Check menu item
    try:

        menu = Menu.objects.get(
            id=menu_id
        )

    except Menu.DoesNotExist:

        return Response(
            {
                "error":
                    "Menu item not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )


    # Add or update item
    cart_item, created = GroupCartItem.objects.get_or_create(
        group_order=group_order,
        user_id=user_id,
        menu=menu,
        defaults={
            "quantity": quantity
        }
    )


    if not created:

        cart_item.quantity += int(quantity)
        cart_item.save()


    serializer = GroupCartItemSerializer(
        cart_item,
        context={
            "request": request
        }
    )


    return Response(
        serializer.data,
        status=status.HTTP_201_CREATED
    )


# ============================================================
# GET GROUP CART
# ============================================================

@api_view(["GET"])
def get_group_cart(request, group_code):

    try:

        group_order = GroupOrder.objects.get(
            group_code=group_code.upper()
        )

    except GroupOrder.DoesNotExist:

        return Response(
            {
                "error":
                    "Group order not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )


    serializer = GroupCartItemSerializer(
        group_order.cart_items.all(),
        many=True,
        context={
            "request": request
        }
    )


    return Response(
        {
            "group_code":
                group_order.group_code,

            "items":
                serializer.data
        }
    )


# ============================================================
# REMOVE GROUP CART ITEM
# ============================================================

@api_view(["DELETE"])
def remove_group_cart_item(request, item_id):

    try:

        item = GroupCartItem.objects.get(
            id=item_id
        )

    except GroupCartItem.DoesNotExist:

        return Response(
            {
                "error":
                    "Cart item not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )


    item.delete()


    return Response(
        {
            "message":
                "Item removed successfully."
        },
        status=status.HTTP_200_OK
    )
