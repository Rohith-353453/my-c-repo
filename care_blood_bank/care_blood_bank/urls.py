"""URL routes.

Core mounts this module at /api/care_blood_bank/ via the PLUGIN_APPS loop in
config/urls.py. Do not repeat that prefix here.

Routes under `otp/` are for the patient portal (OTP-authenticated, phone-number scoped).
Keep them read-mostly. See the care-auth-contexts skill.
"""

from django.urls import path
from rest_framework.routers import DefaultRouter

from care_blood_bank.viewsets.blood_bank import (
    BloodRequestViewSet,
    BloodUnitViewSet,
    CrossMatchViewSet,
    DonorViewSet,
)
from care_blood_bank.viewsets.config import ConfigView

router = DefaultRouter()
router.register("donors", DonorViewSet, basename="donor")
router.register("units", BloodUnitViewSet, basename="blood-unit")
router.register("requests", BloodRequestViewSet, basename="blood-request")
router.register("crossmatches", CrossMatchViewSet, basename="crossmatch")

urlpatterns = [
    *router.urls,
    path("config/", ConfigView.as_view(), name="care_blood_bank-config"),
]
