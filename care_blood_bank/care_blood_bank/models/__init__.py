import uuid

from django.db import models


class BloodGroup(models.TextChoices):
    A_POSITIVE = "A+", "A+"
    A_NEGATIVE = "A-", "A-"
    B_POSITIVE = "B+", "B+"
    B_NEGATIVE = "B-", "B-"
    AB_POSITIVE = "AB+", "AB+"
    AB_NEGATIVE = "AB-", "AB-"
    O_POSITIVE = "O+", "O+"
    O_NEGATIVE = "O-", "O-"


class Component(models.TextChoices):
    WHOLE_BLOOD = "whole_blood", "Whole blood"
    RED_CELLS = "red_cells", "Red cells"
    PLASMA = "plasma", "Plasma"
    PLATELETS = "platelets", "Platelets"


class Donor(models.Model):
    external_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(max_length=200)
    blood_group = models.CharField(max_length=3, choices=BloodGroup.choices)
    phone = models.CharField(max_length=30, blank=True)
    eligibility_status = models.CharField(
        max_length=12,
        choices=[
            ("eligible", "Eligible"),
            ("deferred", "Deferred"),
            ("ineligible", "Ineligible"),
        ],
        default="eligible",
    )
    last_donation_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class BloodUnit(models.Model):
    external_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    donation_id = models.CharField(max_length=40, unique=True)
    donor = models.ForeignKey(Donor, on_delete=models.PROTECT, related_name="units")
    blood_group = models.CharField(max_length=3, choices=BloodGroup.choices)
    component = models.CharField(
        max_length=12,
        choices=Component.choices,
    )
    status = models.CharField(
        max_length=10,
        choices=[
            ("available", "Available"),
            ("reserved", "Reserved"),
            ("issued", "Issued"),
            ("discarded", "Discarded"),
            ("expired", "Expired"),
        ],
        default="available",
    )
    collected_at = models.DateTimeField()
    expires_at = models.DateTimeField()
    volume_ml = models.PositiveIntegerField()
    storage_location = models.CharField(max_length=120, blank=True)

    class Meta:
        ordering = ["expires_at"]


class BloodRequest(models.Model):
    external_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    patient_name = models.CharField(max_length=200)
    blood_group = models.CharField(max_length=3, choices=BloodGroup.choices)
    component = models.CharField(max_length=12, choices=Component.choices)
    units_requested = models.PositiveIntegerField(default=1)
    urgency = models.CharField(
        max_length=9,
        choices=[
            ("routine", "Routine"),
            ("urgent", "Urgent"),
            ("emergency", "Emergency"),
        ],
        default="routine",
    )
    status = models.CharField(
        max_length=10,
        choices=[
            ("pending", "Pending"),
            ("approved", "Approved"),
            ("fulfilled", "Fulfilled"),
            ("cancelled", "Cancelled"),
        ],
        default="pending",
    )
    notes = models.TextField(blank=True)
    requested_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-requested_at"]


class CrossMatch(models.Model):
    external_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    request = models.ForeignKey(
        BloodRequest, on_delete=models.CASCADE, related_name="crossmatches"
    )
    unit = models.ForeignKey(
        BloodUnit, on_delete=models.CASCADE, related_name="crossmatches"
    )
    result = models.CharField(
        max_length=11,
        choices=[
            ("pending", "Pending"),
            ("compatible", "Compatible"),
            ("incompatible", "Incompatible"),
        ],
        default="pending",
    )
    performed_by = models.CharField(max_length=200, blank=True)
    tested_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["request", "unit"], name="unique_blood_crossmatch"
            )
        ]