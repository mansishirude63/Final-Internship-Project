from django.urls import path
from . import views

urlpatterns = [
    path('add_menu/',views.add_menu, name='add_menu'),
    path('get_menu/',views.get_menu, name='get_menu'),
    path('get_menu_item/<int:menu_id>/',views.get_menu_item, name='get_menu_item'),
    path('update_menu/<int:menu_id>/', views.update_menu, name='update_menu'),
    path('delete_menu/<int:menu_id>/', views.delete_menu, name='delete_menu'),
]
