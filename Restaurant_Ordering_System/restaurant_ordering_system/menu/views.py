from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Menu
from .serializers import MenuSerializer

@api_view(['POST'])
def add_menu(request):
    serializer = MenuSerializer(data = request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({
            'success' : True,
            'message' : "Menu added successfully",
            'account' : serializer.data
        }, status = status.HTTP_201_CREATED)

    return Response({
        'success' : False,
        'error' : serializer.errors
    }, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_menu(request):
    menu = Menu.objects.all()
    serializer = MenuSerializer(menu, many=True)

    return Response({
        'success' : True,
        'menu' : serializer.data
    }, status = status.HTTP_200_OK)

@api_view(['GET'])
def get_menu_item(request, menu_id):
    try:
        menu = Menu.objects.get(id=menu_id)
        serializer = MenuSerializer(menu)

        return Response({
            "success": True,
            "menu": serializer.data
        }, status=status.HTTP_200_OK)
    
    except menu.DoesNotExist:
        return Response({
            "success": False,
            "message": "Menu not found"
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_menu(request, menu_id):
    try:
        menu = Menu.objects.get(id=menu_id)
    except menu.DoesNotExist:
        return Response({
            "success": False,
            "message": "Menu not found"
        }, status=status.HTTP_404_NOT_FOUND)

    serializer = MenuSerializer(menu, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({
            "success": True,
            "message": " Menu updated successfully",
            "menu": serializer.data
        }, status=status.HTTP_200_OK)
    
    return Response({
        "success": False,
        "message": "Failed to update menu",
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_menu(request, menu_id):
    try:
        menu = Menu.objects.get(id=menu_id)
        menu.delete()
        return Response({
            "success": True,
            "message": "Menu deleted successfully"
        }, status=status.HTTP_200_OK)
    
    except Menu.DoesNotExist:
        return Response({
            "success": False,
            "message": "Menu not found"
        }, status=status.HTTP_404_NOT_FOUND)

