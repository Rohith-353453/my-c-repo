import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  Bell,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Clock3,
  Droplet,
  HeartPulse,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { API, type BloodRequest, type BloodUnit } from "@/utils/api";

const navigation = [
  { key: "overview", icon: LayoutDashboard },
  { key: "inventory", icon: Droplet },
  { key: "requests", icon: ClipboardList },
  { key: "donors", icon: Users },
];

export default function ExamplePage() {
  const { t } = useTranslation();
  const [active, setActive] = useState("overview");
  const [search, setSearch] = useState("");
  const units = useQuery({
    queryKey: ["blood-bank", "units"],
    queryFn: () => API.units({ status: "available" }),
  });
  const donors = useQuery({ queryKey: ["blood-bank", "donors"], queryFn: API.donors });
  const requests = useQuery({ queryKey: ["blood-bank", "requests"], queryFn: API.requests });
  const openRequests = requests.data?.filter((item) => item.status === "pending") ?? [];
  const filteredUnits = useMemo(
    () =>
      units.data?.filter((unit) =>
        `${unit.donation_id} ${unit.blood_group} ${unit.component}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search, units.data],
  );

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#102a43] text-slate-200 lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#c9374b] text-white">
            <HeartPulse className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold tracking-tight text-white">Care Blood Bank</p>
            <p className="text-xs text-slate-400">{t("blood_bank__facility_label")}</p>
          </div>
        </div>
        <div className="px-4 py-6">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {t("blood_bank__workspace")}
          </p>
          <nav className="mt-3 space-y-1">
            {navigation.map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  active === key
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {t(`blood_bank__nav_${key}`)}
                {key === "requests" && openRequests.length > 0 ? (
                  <span className="ml-auto rounded-full bg-[#c9374b] px-2 py-0.5 text-[10px] text-white">
                    {openRequests.length}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto space-y-1 border-t border-white/10 p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white">
            <Settings className="size-4" aria-hidden="true" /> {t("blood_bank__settings")}
          </button>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#d7e6ef] text-xs font-bold text-[#102a43]">
              AM
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Aarav Mehta</p>
              <p className="text-xs text-slate-400">{t("blood_bank__administrator")}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#fbecef] text-[#c9374b] lg:hidden">
              <HeartPulse className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t("blood_bank__eyebrow")}
              </p>
              <h1 className="text-lg font-bold text-slate-900">{t("blood_bank__page_title")}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-xs font-semibold text-slate-500 sm:flex">
              <span className="size-2 rounded-full bg-emerald-500" />
              {t("blood_bank__system_operational")}
            </span>
            <button aria-label={t("blood_bank__notifications")} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <Bell className="size-5" aria-hidden="true" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#c9374b]" />
            </button>
            <button className="hidden items-center gap-2 rounded-lg bg-[#c9374b] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#a92d3f] sm:flex">
              <Plus className="size-4" aria-hidden="true" /> {t("blood_bank__new_request")}
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] p-5 sm:p-8">
          <div className="mb-7 flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-400">{t("blood_bank__breadcrumb_home")}</span>
              <ChevronRight className="size-4 text-slate-300" aria-hidden="true" />
              <span className="font-semibold text-slate-700">{t("blood_bank__breadcrumb_current")}</span>
            </div>
            <span className="hidden text-xs font-medium text-slate-400 sm:block">
              {t("blood_bank__last_updated")}
            </span>
          </div>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-slate-500">{t("blood_bank__greeting")}</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {t("blood_bank__overview_title")}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="size-4" aria-hidden="true" />
              {t("blood_bank__today")}
            </div>
          </div>

          <SectionDivider label={t("blood_bank__section_snapshot")} />
          <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={Droplet} label={t("blood_bank__available_units")} value={units.data?.length} detail={t("blood_bank__units_ready")} tone="red" />
            <MetricCard icon={ClipboardList} label={t("blood_bank__open_requests")} value={openRequests.length} detail={t("blood_bank__needs_attention")} tone="amber" />
            <MetricCard icon={Users} label={t("blood_bank__registered_donors")} value={donors.data?.length} detail={t("blood_bank__active_donors")} tone="blue" />
            <MetricCard icon={ShieldCheck} label={t("blood_bank__readiness")} value="100%" detail={t("blood_bank__checks_complete")} tone="green" />
          </section>

          <SectionDivider label={t("blood_bank__section_operations")} />
          <div className="mt-4 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
            <InventoryCard units={filteredUnits} loading={units.isLoading} error={units.isError} search={search} setSearch={setSearch} t={t} />
            <RequestCard requests={openRequests} loading={requests.isLoading} t={t} />
          </div>

          <SectionDivider label={t("blood_bank__section_insights")} />
          <section className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{t("blood_bank__blood_group_title")}</h3>
                  <p className="mt-1 text-sm text-slate-500">{t("blood_bank__blood_group_subtitle")}</p>
                </div>
                <Activity className="size-5 text-slate-400" aria-hidden="true" />
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-8">
                {["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"].map((group) => {
                  const count = units.data?.filter((unit) => unit.blood_group === group).length ?? 0;
                  return (
                    <div key={group} className={`rounded-lg border p-2 text-center ${count ? "border-[#e6a1ac] bg-[#fbecef]" : "border-slate-200 bg-slate-50"}`}>
                      <p className="text-xs font-bold text-slate-700">{group}</p>
                      <p className={`mt-1 text-lg font-bold ${count ? "text-[#c9374b]" : "text-slate-400"}`}>{count}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{t("blood_bank__workflow_title")}</h3>
                  <p className="mt-1 text-sm text-slate-500">{t("blood_bank__workflow_subtitle")}</p>
                </div>
                <Clock3 className="size-5 text-slate-400" aria-hidden="true" />
              </div>
              <div className="mt-5 flex items-center gap-2">
                {["blood_bank__step_collect", "blood_bank__step_test", "blood_bank__step_store", "blood_bank__step_issue"].map((step, index) => (
                  <div key={step} className="flex min-w-0 flex-1 items-center gap-2">
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${index < 3 ? "bg-[#d9f1e7] text-[#16734f]" : "bg-slate-100 text-slate-500"}`}>
                      {index + 1}
                    </div>
                    <span className="hidden truncate text-xs font-semibold text-slate-600 sm:block">{t(step)}</span>
                    {index < 3 ? <ChevronRight className="ml-auto size-4 text-slate-300" aria-hidden="true" /> : null}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="mt-7 flex items-center gap-3 first:mt-0">
      <span className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: LucideIcon; label: string; value?: number | string; detail: string; tone: "red" | "amber" | "blue" | "green" }) {
  const toneClasses = {
    red: "bg-[#fbecef] text-[#c9374b]",
    amber: "bg-[#fff4dc] text-[#a66a00]",
    blue: "bg-[#eaf2f8] text-[#2c6b8e]",
    green: "bg-[#e4f5ed] text-[#16734f]",
  };
  return (
    <div className="rounded-xl border border-slate-200 border-t-2 border-t-transparent bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-t-[#c9374b] hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`flex size-10 items-center justify-center rounded-lg ${toneClasses[tone]}`}><Icon className="size-5" aria-hidden="true" /></div>
        <span className="text-xs font-semibold text-slate-400">{tone === "green" ? "OK" : "Live"}</span>
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{value ?? "—"}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function InventoryCard({ units, loading, error, search, setSearch, t }: { units?: BloodUnit[]; loading: boolean; error: boolean; search: string; setSearch: (value: string) => void; t: (key: string) => string }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-slate-50/70 p-5 sm:flex-row sm:items-center">
        <div><h3 className="font-bold text-slate-900">{t("blood_bank__inventory_title")}</h3><p className="mt-1 text-sm text-slate-500">{t("blood_bank__inventory_subtitle")}</p></div>
        <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 focus-within:border-[#c9374b] focus-within:bg-white">
          <Search className="size-4" aria-hidden="true" /><span className="sr-only">{t("blood_bank__search_inventory")}</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("blood_bank__search_inventory")} className="w-36 bg-transparent outline-none placeholder:text-slate-400" />
        </label>
      </div>
      {loading ? <p className="p-5 text-sm text-slate-500">{t("blood_bank__loading")}</p> : error ? <p className="p-5 text-sm text-red-600">{t("blood_bank__load_error")}</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">{t("blood_bank__donation_id")}</th><th className="px-5 py-3">{t("blood_bank__blood_group")}</th><th className="px-5 py-3">{t("blood_bank__component")}</th><th className="px-5 py-3">{t("blood_bank__expires")}</th><th className="px-5 py-3">{t("blood_bank__status")}</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {units?.map((unit) => <tr key={unit.external_id} className="hover:bg-slate-50"><td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">{unit.donation_id}</td><td className="px-5 py-4"><span className="rounded-md bg-[#fbecef] px-2 py-1 text-xs font-bold text-[#a92d3f]">{unit.blood_group}</span></td><td className="px-5 py-4 capitalize text-slate-600">{unit.component.replace("_", " ")}</td><td className="whitespace-nowrap px-5 py-4 text-slate-600"><Clock3 className="mr-1 inline size-3.5" aria-hidden="true" />{new Date(unit.expires_at).toLocaleDateString()}</td><td className="px-5 py-4"><span className="rounded-full bg-[#e4f5ed] px-2.5 py-1 text-xs font-bold text-[#16734f]">{t("blood_bank__available")}</span></td></tr>)}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function RequestCard({ requests, loading, t }: { requests: BloodRequest[]; loading: boolean; t: (key: string) => string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 p-5"><div><h3 className="font-bold text-slate-900">{t("blood_bank__requests_title")}</h3><p className="mt-1 text-sm text-slate-500">{t("blood_bank__requests_subtitle")}</p></div><AlertCircle className="size-5 text-[#a66a00]" aria-hidden="true" /></div>
      {loading ? <p className="p-5 text-sm text-slate-500">{t("blood_bank__loading")}</p> : <div className="space-y-3 p-4">{requests.length === 0 ? <p className="p-3 text-sm text-slate-500">{t("blood_bank__no_requests")}</p> : requests.map((request) => <div key={request.external_id} className="rounded-lg border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-800">{request.patient_name}</p><p className="mt-1 text-sm text-slate-500">{request.blood_group} · {request.units_requested} {t("blood_bank__units")}</p></div><span className="rounded-full bg-[#fff4dc] px-2 py-1 text-[11px] font-bold capitalize text-[#8a5a00]">{request.urgency}</span></div><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-[#c9374b] hover:text-[#c9374b]">{t("blood_bank__review_request")} <ChevronRight className="size-4" aria-hidden="true" /></button></div>)}</div>}
    </section>
  );
}
