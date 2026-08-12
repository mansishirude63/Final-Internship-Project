from rest_framework import viewsets
from rest_framework.response import Response

from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):

    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def create(self, request, *args, **kwargs):

        order_id = request.data.get("order")

        try:

            payment = Payment.objects.get(
                order_id=order_id
            )

            # Payment already exists → update it
            serializer = self.get_serializer(
                payment,
                data=request.data,
                partial=True
            )

            serializer.is_valid(
                raise_exception=True
            )

            serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Payment updated successfully",
                    "payment": serializer.data
                },
                status=200
            )

        except Payment.DoesNotExist:

            # Payment doesn't exist → create new payment
            serializer = self.get_serializer(
                data=request.data
            )

            serializer.is_valid(
                raise_exception=True
            )

            serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Payment created successfully",
                    "payment": serializer.data
                },
                status=201
            )