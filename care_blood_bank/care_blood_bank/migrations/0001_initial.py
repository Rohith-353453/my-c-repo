import uuid

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="Donor",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("external_id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("name", models.CharField(max_length=200)),
                ("blood_group", models.CharField(choices=[("A+", "A+"), ("A-", "A-"), ("B+", "B+"), ("B-", "B-"), ("AB+", "AB+"), ("AB-", "AB-"), ("O+", "O+"), ("O-", "O-")], max_length=3)),
                ("phone", models.CharField(blank=True, max_length=30)),
                ("eligibility_status", models.CharField(choices=[("eligible", "Eligible"), ("deferred", "Deferred"), ("ineligible", "Ineligible")], default="eligible", max_length=12)),
                ("last_donation_date", models.DateField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="BloodRequest",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("external_id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("patient_name", models.CharField(max_length=200)),
                ("blood_group", models.CharField(choices=[("A+", "A+"), ("A-", "A-"), ("B+", "B+"), ("B-", "B-"), ("AB+", "AB+"), ("AB-", "AB-"), ("O+", "O+"), ("O-", "O-")], max_length=3)),
                ("component", models.CharField(choices=[("whole_blood", "Whole blood"), ("red_cells", "Red cells"), ("plasma", "Plasma"), ("platelets", "Platelets")], max_length=12)),
                ("units_requested", models.PositiveIntegerField(default=1)),
                ("urgency", models.CharField(choices=[("routine", "Routine"), ("urgent", "Urgent"), ("emergency", "Emergency")], default="routine", max_length=9)),
                ("status", models.CharField(choices=[("pending", "Pending"), ("approved", "Approved"), ("fulfilled", "Fulfilled"), ("cancelled", "Cancelled")], default="pending", max_length=10)),
                ("notes", models.TextField(blank=True)),
                ("requested_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["-requested_at"]},
        ),
        migrations.CreateModel(
            name="BloodUnit",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("external_id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("donation_id", models.CharField(max_length=40, unique=True)),
                ("blood_group", models.CharField(choices=[("A+", "A+"), ("A-", "A-"), ("B+", "B+"), ("B-", "B-"), ("AB+", "AB+"), ("AB-", "AB-"), ("O+", "O+"), ("O-", "O-")], max_length=3)),
                ("component", models.CharField(choices=[("whole_blood", "Whole blood"), ("red_cells", "Red cells"), ("plasma", "Plasma"), ("platelets", "Platelets")], max_length=12)),
                ("status", models.CharField(choices=[("available", "Available"), ("reserved", "Reserved"), ("issued", "Issued"), ("discarded", "Discarded"), ("expired", "Expired")], default="available", max_length=10)),
                ("collected_at", models.DateTimeField()),
                ("expires_at", models.DateTimeField()),
                ("volume_ml", models.PositiveIntegerField()),
                ("storage_location", models.CharField(blank=True, max_length=120)),
                ("donor", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="units", to="care_blood_bank.donor")),
            ],
            options={"ordering": ["expires_at"]},
        ),
        migrations.CreateModel(
            name="CrossMatch",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("external_id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("result", models.CharField(choices=[("pending", "Pending"), ("compatible", "Compatible"), ("incompatible", "Incompatible")], default="pending", max_length=11)),
                ("performed_by", models.CharField(blank=True, max_length=200)),
                ("tested_at", models.DateTimeField(blank=True, null=True)),
                ("request", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="crossmatches", to="care_blood_bank.bloodrequest")),
                ("unit", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="crossmatches", to="care_blood_bank.bloodunit")),
            ],
        ),
        migrations.AddConstraint(
            model_name="crossmatch",
            constraint=models.UniqueConstraint(fields=("request", "unit"), name="unique_blood_crossmatch"),
        ),
    ]
