import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowUpRight,
  BellRing,
  Boxes,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Droplet,
  HeartPulse,
  Plus,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { API, type BloodRequest, type BloodUnit } from "@/utils/api";

export default function ExamplePage() {
  const { t } = useTranslation();
  const units = useQuery({
    queryKey: ["blood-bank", "units"],
    queryFn: () => API.units({ status: "available" }),
  });
  const donors = useQuery({
    queryKey: ["blood-bank", "donors"],
    queryFn: API.donors,
  });
  const requests = useQuery({
    queryKey: ["blood-bank", "requests"],
    queryFn: API.requests,
  });
  const openRequests = requests.data?.filter((item) => item.status === "pending") ?? [];

  return (
    <div className="min-h-screen bg-[#f7f9f8] text-secondary-900">
      <div className="mx-auto max-w-7xl p-5 sm:p-8">
        <header className="flex flex-col gap-5 border-b border-secondary-200 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-700 text-white shadow-sm">
              <HeartPulse className="size-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-700">
                  {t("blood_bank__eyebrow")}
                </p>
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-semibold text-primary-800">
                  {t("blood_bank__live")}
                </span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {t("blood_bank__page_title")}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-secondary-600">
            <CalendarClock className="size-4" aria-hidden="true" />
            <span>{t("blood_bank__last_synced")}</span>
            <button className="rounded-lg border border-secondary-300 bg-white px-3 py-2 font-semibold text-secondary-800 shadow-sm transition hover:border-primary-500 hover:text-primary-700">
              {t("blood_bank__export")}
            </button>
          </div>
        </header>

        <main className="mt-7">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div className="rounded-2xl bg-primary-800 p-5 text-white shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-primary-100">{t("blood_bank__readiness")}</p>
                  <p className="mt-2 text-3xl font-bold">{t("blood_bank__ready")}</p>
                </div>
                <ShieldCheck className="size-7 text-primary-200" aria-hidden="true" />
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-primary-100">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                {t("blood_bank__ready_detail")}
              </div>
            </div>
            <SummaryCard icon={Droplet} label={t("blood_bank__available_units")} value={units.data?.length} tone="rose" />
            <SummaryCard icon={Users} label={t("blood_bank__registered_donors")} value={donors.data?.length} tone="blue" />
            <SummaryCard icon={BellRing} label={t("blood_bank__open_requests")} value={openRequests.length} tone="amber" />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
            <InventoryPanel units={units.data} loading={units.isLoading} error={units.isError} t={t} />
            <RequestsPanel requests={openRequests} loading={requests.isLoading} t={t} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-primary-300 bg-primary-50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-2.5 text-primary-700 shadow-sm">
                <Plus className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold">{t("blood_bank__quick_action_title")}</p>
                <p className="text-sm text-secondary-600">{t("blood_bank__quick_action_detail")}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-800">
              {t("blood_bank__add_unit")} <ArrowUpRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value?: number;
  tone: "rose" | "blue" | "amber";
}) {
  const colors = {
    rose: "bg-rose-50 text-rose-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <div className="rounded-2xl border border-secondary-200 bg-white p-5 shadow-sm">
      <div className={`flex size-10 items-center justify-center rounded-xl ${colors[tone]}`}>
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <p className="mt-5 text-sm text-secondary-600">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value ?? "—"}</p>
    </div>
  );
}

function InventoryPanel({
  units,
  loading,
  error,
  t,
}: {
  units?: BloodUnit[];
  loading: boolean;
  error: boolean;
  t: (key: string) => string;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-secondary-100 px-5 py-4">
        <div>
          <p className="text-lg font-bold">{t("blood_bank__inventory_title")}</p>
          <p className="mt-0.5 text-sm text-secondary-500">{t("blood_bank__inventory_subtitle")}</p>
        </div>
        <Activity className="size-5 text-primary-700" aria-hidden="true" />
      </div>
      {loading ? (
        <p className="p-5 text-sm text-secondary-600">{t("blood_bank__loading")}</p>
      ) : error ? (
        <p className="p-5 text-sm text-red-600">{t("blood_bank__load_error")}</p>
      ) : (
        <div className="divide-y divide-secondary-100">
          {units?.map((unit) => (
            <div key={unit.external_id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                  <Droplet className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{unit.donation_id}</p>
                  <p className="text-sm capitalize text-secondary-500">
                    {unit.blood_group} · {unit.component.replace("_", " ")}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary-400">{t("blood_bank__expires")}</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-secondary-700">
                  <Clock3 className="size-3.5" aria-hidden="true" />
                  {new Date(unit.expires_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function RequestsPanel({
  requests,
  loading,
  t,
}: {
  requests: BloodRequest[];
  loading: boolean;
  t: (key: string) => string;
}) {
  return (
    <section className="rounded-2xl border border-secondary-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-secondary-100 px-5 py-4">
        <div>
          <p className="text-lg font-bold">{t("blood_bank__requests_title")}</p>
          <p className="mt-0.5 text-sm text-secondary-500">{t("blood_bank__requests_subtitle")}</p>
        </div>
        <Boxes className="size-5 text-amber-600" aria-hidden="true" />
      </div>
      {loading ? (
        <p className="p-5 text-sm text-secondary-600">{t("blood_bank__loading")}</p>
      ) : (
        <div className="space-y-3 p-4">
          {requests.map((request) => (
            <div key={request.external_id} className="rounded-xl border border-secondary-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{request.patient_name}</p>
                  <p className="mt-1 text-sm text-secondary-500">
                    {request.blood_group} · {request.units_requested} {t("blood_bank__units")}
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold capitalize text-amber-800">
                  {request.urgency}
                </span>
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-secondary-300 px-3 py-2 text-sm font-semibold text-secondary-700 transition hover:border-primary-500 hover:text-primary-700">
                {t("blood_bank__review_request")} <ArrowUpRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
