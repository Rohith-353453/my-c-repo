from rest_framework import serializers

from care_blood_bank.models import BloodRequest, BloodUnit, CrossMatch, Donor


class DonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = [
            "external_id", "name", "blood_group", "phone",
            "eligibility_status", "last_donation_date", "created_at", "updated_at",
        ]
        read_only_fields = ["external_id", "created_at", "updated_at"]


class BloodUnitSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source="donor.name", read_only=True)

    class Meta:
        model = BloodUnit
        fields = [
            "external_id", "donation_id", "donor", "donor_name", "blood_group",
            "component", "status", "collected_at", "expires_at", "volume_ml",
            "storage_location",
        ]
        read_only_fields = ["external_id", "donor_name"]


class BloodRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodRequest
        fields = [
            "external_id", "patient_name", "blood_group", "component",
            "units_requested", "urgency", "status", "notes", "requested_at",
        ]
        read_only_fields = ["external_id", "requested_at"]


class CrossMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrossMatch
        fields = [
            "external_id", "request", "unit", "result", "performed_by", "tested_at",
        ]
        read_only_fields = ["external_id"]