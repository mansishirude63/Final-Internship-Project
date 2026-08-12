from django.urls import path

from .views import (
    create_group_order,
    join_group_order,
    get_group_order,
    leave_group_order,
    add_group_cart_item,
    get_group_cart,
    remove_group_cart_item,
)


urlpatterns = [

    # Group
    path(
        "create/",
        create_group_order,
        name="create_group_order"
    ),

    path(
        "join/",
        join_group_order,
        name="join_group_order"
    ),

    path(
        "leave/",
        leave_group_order,
        name="leave_group_order"
    ),

    # Group cart
    path(
        "cart/add/",
        add_group_cart_item,
        name="add_group_cart_item"
    ),

    path(
        "cart/<str:group_code>/",
        get_group_cart,
        name="get_group_cart"
    ),

    path(
        "cart/remove/<int:item_id>/",
        remove_group_cart_item,
        name="remove_group_cart_item"
    ),

    # Group details
    path(
        "<str:group_code>/",
        get_group_order,
        name="get_group_order"
    ),
]