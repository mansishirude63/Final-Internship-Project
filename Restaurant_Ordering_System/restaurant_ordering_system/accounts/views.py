from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import authenticate

from .models import User
from .serializers import RegisterSerializer, UserSerializer



# Register User
@api_view(['POST'])
def register_user(request):

    serializer = RegisterSerializer(
        data=request.data
    )


    if serializer.is_valid():

        user = serializer.save()

        return Response(
            {
                "success": True,
                "message": "User registered successfully",
                "user": UserSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )


    return Response(
        {
            "success": False,
            "errors": serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )




# Login User
@api_view(['POST'])
def login_user(request):

    username = request.data.get("username")
    password = request.data.get("password")


    user = authenticate(
        username=username,
        password=password
    )


    if user is not None:

        return Response(
            {
                "success": True,
                "message": "Login successful",
                "user": UserSerializer(user).data
            },
            status=status.HTTP_200_OK
        )


    return Response(
        {
            "success": False,
            "message": "Invalid username or password"
        },
        status=status.HTTP_401_UNAUTHORIZED
    )




# Get All Users
@api_view(['GET'])
def get_all_Users(request):

    users = User.objects.all()

    serializer = UserSerializer(
        users,
        many=True
    )

    return Response(
        {
            "success": True,
            "users": serializer.data
        }
    )




# Get User By Id
@api_view(['GET'])
def get_user_by_Id(request, user_id):

    try:

        user = User.objects.get(
            id=user_id
        )

        serializer = UserSerializer(user)


        return Response(
            {
                "success": True,
                "user": serializer.data
            }
        )


    except User.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "User not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )




# Update User
@api_view(['PUT'])
def update_User(request, user_id):

    try:

        user = User.objects.get(
            id=user_id
        )


    except User.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "User not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )


    serializer = UserSerializer(
        user,
        data=request.data,
        partial=True
    )


    if serializer.is_valid():

        serializer.save()

        return Response(
            {
                "success": True,
                "message": "User updated successfully",
                "user": serializer.data
            }
        )


    return Response(
        {
            "success": False,
            "errors": serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )




# Delete User
@api_view(['DELETE'])
def delete_User(request, user_id):

    try:

        user = User.objects.get(
            id=user_id
        )

        user.delete()


        return Response(
            {
                "success": True,
                "message": "User deleted successfully"
            }
        )


    except User.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "User not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )