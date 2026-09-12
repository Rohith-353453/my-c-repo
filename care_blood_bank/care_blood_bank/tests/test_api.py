from datetime import datetime, timezone

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from care_blood_bank.models import BloodUnit, Donor


class BloodBankApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        user = get_user_model().objects.create_user(
            username="staff", password="secret"
        )
        self.client.force_authenticate(user=user)

    def test_donors_are_listed_with_external_id(self):
        donor = Donor.objects.create(name="Asha Rao", blood_group="O+")

        response = self.client.get("/api/care_blood_bank/donors/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["external_id"], str(donor.external_id))

    def test_units_can_be_filtered_by_status_and_blood_group(self):
        donor = Donor.objects.create(name="Asha Rao", blood_group="O+")
        BloodUnit.objects.create(
            donation_id="DON-001",
            donor=donor,
            blood_group="O+",
            component="red_cells",
            collected_at=datetime(2026, 1, 1, 10, tzinfo=timezone.utc),
            expires_at=datetime(2026, 2, 1, 10, tzinfo=timezone.utc),
            volume_ml=450,
        )

        response = self.client.get(
            "/api/care_blood_bank/units/?status=available&blood_group=O+"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
