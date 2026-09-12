# Care Blood Bank

Blood-bank workflows for CARE

A [CARE](https://github.com/ohcnetwork/care) backend plugin. It is an ordinary Django app,
pip-installed into core and registered through `plug_config.py`. Core contains no reference
to this package.

## Install (local development)

Place the plugin inside the backend checkout as a **real directory**. A symlink breaks
`docker build`, which cannot follow links out of the build context.

```bash
mv /path/to/care_blood_bank $CARE_BE/care_blood_bank
```

`care/plug_config.py`:

```python
care_blood_bank = Plug(
    name="care_blood_bank",
    package_name="care_blood_bank",
    version="",
    configs={
        "BLOOD_BANK_ENABLED": True,
    },
)

plugs = [care_blood_bank, ...]
```

Plugins are pip-installed at **image build time**, so a newly registered plug needs a rebuild:

```bash
cd $CARE_BE
make down      # safe stop. NOT `make teardown` — that deletes the database volume.
make build     # re-runs install_plugins.py
make up
make makemigrations && make migrate
```

`backend` and `celery` share one image, so a single rebuild covers both.

## API

Mounted automatically at `/api/care_blood_bank/` by core's `config/urls.py`.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/care_blood_bank/config/` | Client-safe configuration |
| GET/POST | `/api/care_blood_bank/donors/` | Register and list donors |
| GET/POST | `/api/care_blood_bank/units/` | Manage blood units; filter with `status` and `blood_group` |
| GET/POST | `/api/care_blood_bank/requests/` | Track blood requests and fulfilment status |
| GET/POST | `/api/care_blood_bank/crossmatches/` | Record request-to-unit compatibility results |

## Settings

Resolution order: `PLUGIN_CONFIGS["care_blood_bank"][key]` → environment variable → default.
See `care_blood_bank/settings.py`.
