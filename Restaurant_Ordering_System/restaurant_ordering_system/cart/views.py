from rest_framework import viewsets, status
from rest_framework.response import Response

from accounts.models import User
from menu.models import Menu
from .models import Cart
from .serializers import CartSerializer


class CartViewSet(viewsets.ModelViewSet):

    serializer_class = CartSerializer


    def get_queryset(self):

        queryset = Cart.objects.all()

        user_id = self.request.query_params.get("user")

        if user_id:
            queryset = queryset.filter(user_id=user_id)

        return queryset



    def create(self, request, *args, **kwargs):

        user_id = request.data.get("user")
        menu_id = request.data.get("menu")
        quantity = int(request.data.get("quantity", 1))


        user = User.objects.get(id=user_id)
        menu = Menu.objects.get(id=menu_id)


        cart_item = Cart.objects.filter(
            user=user,
            menu=menu
        ).first()


        if cart_item:

            cart_item.quantity += quantity
            cart_item.save()

            serializer = CartSerializer(cart_item)

            return Response(serializer.data)



        cart_item = Cart.objects.create(
            user=user,
            menu=menu,
            quantity=quantity
        )


        serializer = CartSerializer(cart_item)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )



    def update(self, request, *args, **kwargs):

        cart_item = self.get_object()

        quantity = request.data.get("quantity")


        if quantity is not None:

            cart_item.quantity = quantity
            cart_item.save()


        serializer = CartSerializer(cart_item)


        return Response({
            "success": True,
            "message": "Cart updated successfully",
            "cart": serializer.data
        })