from django.urls import path

from .views import (
    get_delivery_by_order,
    get_all_deliveries,
    update_delivery
)


urlpatterns = [

    path(
        "get_delivery_by_order/<int:order_id>/",
        get_delivery_by_order,
        name="get_delivery_by_order"
    ),

    path(
        "get_all_deliveries/",
        get_all_deliveries,
        name="get_all_deliveries"
    ),

    path(
        "update_delivery/<int:delivery_id>/",
        update_delivery,
        name="update_delivery"
    ),

]