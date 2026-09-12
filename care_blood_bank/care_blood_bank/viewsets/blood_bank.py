from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from care_blood_bank.models import BloodRequest, BloodUnit, CrossMatch, Donor
from care_blood_bank.serializers import (
    BloodRequestSerializer,
    BloodUnitSerializer,
    CrossMatchSerializer,
    DonorSerializer,
)


class AuthenticatedModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]


class DonorViewSet(AuthenticatedModelViewSet):
    queryset = Donor.objects.all()
    serializer_class = DonorSerializer


class BloodUnitViewSet(AuthenticatedModelViewSet):
    queryset = BloodUnit.objects.select_related("donor").all()
    serializer_class = BloodUnitSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get("status")
        blood_group = self.request.query_params.get("blood_group")
        if status:
            queryset = queryset.filter(status=status)
        if blood_group:
            queryset = queryset.filter(blood_group=blood_group)
        return queryset


class BloodRequestViewSet(AuthenticatedModelViewSet):
    queryset = BloodRequest.objects.all()
    serializer_class = BloodRequestSerializer


class CrossMatchViewSet(AuthenticatedModelViewSet):
    queryset = CrossMatch.objects.select_related("request", "unit").all()
    serializer_class = CrossMatchSerializer
