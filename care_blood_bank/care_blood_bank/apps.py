from django.apps import AppConfig

PLUGIN_NAME = "care_blood_bank"


class CareBloodBankConfig(AppConfig):
    name = PLUGIN_NAME
    verbose_name = "Care Blood Bank"

    def ready(self):
        from care_blood_bank import signals  # noqa: F401
