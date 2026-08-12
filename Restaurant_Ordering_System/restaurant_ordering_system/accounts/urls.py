from django.urls import path
from . import views

urlpatterns = [
    path('register_user/',views.register_user, name='register_user'),
    path('login_user/', views.login_user, name='login_user'),
    path('get_all_Users/',views.get_all_Users, name='get_all_Users'),
    path('get_user_by_Id/<int:user_id>/',views.get_user_by_Id, name='get_user_by_Id'),
    path('update_User/<int:user_id>/', views.update_User, name='update_User'),
    path('delete_User/<int:user_id>/', views.delete_User, name='delete_User'),
]
