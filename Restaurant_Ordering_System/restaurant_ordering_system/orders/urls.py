from django.urls import path
from . import views


urlpatterns = [

    path(
        'place_order/',
        views.place_order,
        name='place_order'
    ),

    path(
        'get_all_orders/',
        views.get_all_orders,
        name='get_all_orders'
    ),

    path(
        'get_user_orders/<int:user_id>/',
        views.get_user_orders,
        name='get_user_orders'
    ),

    path(
        'get_order_by_id/<int:order_id>/',
        views.get_order_by_id,
        name='get_order_by_id'
    ),

    path(
        'update_order/<int:order_id>/',
        views.update_order,
        name='update_order'
    ),

    path(
        'delete_order/<int:order_id>/',
        views.delete_order,
        name='delete_order'
    ),

    path(
        'confirm_group_order/',
        views.confirm_group_order,
        name='confirm_group_order'
    ),
]