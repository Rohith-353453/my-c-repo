import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  ChevronRight,
  Clock3,
  Droplet,
  HeartPulse,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { API, type BloodRequest, type BloodUnit } from "@/utils/api";

const topNavItems = [
  "blood_bank__nav_overview",
  "blood_bank__nav_inventory",
  "blood_bank__nav_requests",
  "blood_bank__nav_donors",
] as const;

export default function ExamplePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<(typeof topNavItems)[number]>(
    "blood_bank__nav_overview",
  );
  const [search, setSearch] = useState("");

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

  const openRequests =
    requests.data?.filter((item) => item.status === "pending") ?? [];
  const filteredUnits = useMemo(
    () =>
      units.data?.filter((unit) =>
        `${unit.donation_id} ${unit.blood_group} ${unit.component}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ) ?? [],
    [search, units.data],
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#be2f45] text-white">
              <HeartPulse className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Care Blood Bank</p>
              <p className="text-xs text-slate-500">
                {t("blood_bank__facility_label")}
              </p>
            </div>
          </div>

          <div className="hidden w-full max-w-md items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
            <Search className="size-4 text-slate-400" aria-hidden="true" />
            <input
              aria-label={t("blood_bank__search_everything")}
              placeholder={t("blood_bank__search_everything")}
              className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:flex">
              <span className="size-2 rounded-full bg-emerald-500" />
              {t("blood_bank__system_operational")}
            </span>
            <button
              aria-label={t("blood_bank__notifications")}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <Bell className="size-5" aria-hidden="true" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#be2f45]" />
            </button>
            <button className="hidden items-center gap-2 rounded-lg bg-[#be2f45] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#a12538] sm:flex">
              <Plus className="size-4" aria-hidden="true" />
              {t("blood_bank__new_request")}
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-6 overflow-x-auto">
            {topNavItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`whitespace-nowrap border-b-2 py-3 text-sm font-semibold transition ${
                  activeTab === item
                    ? "border-[#be2f45] text-[#be2f45]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {t(item)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <span>{t("blood_bank__breadcrumb_home")}</span>
          <ChevronRight className="size-4 text-slate-300" />
          <span className="font-semibold text-slate-700">
            {t("blood_bank__breadcrumb_current")}
          </span>
          <span className="mx-1 text-slate-300">•</span>
          <span>{t("blood_bank__last_updated")}</span>
        </div>

        <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4">
          <StatBlock
            title={t("blood_bank__available_units")}
            value={String(filteredUnits.length)}
            subtitle={t("blood_bank__units_ready")}
            tone="red"
          />
          <StatBlock
            title={t("blood_bank__open_requests")}
            value={String(openRequests.length)}
            subtitle={t("blood_bank__needs_attention")}
            tone="amber"
          />
          <StatBlock
            title={t("blood_bank__registered_donors")}
            value={String(donors.data?.length ?? 0)}
            subtitle={t("blood_bank__active_donors")}
            tone="blue"
          />
          <StatBlock
            title={t("blood_bank__readiness")}
            value="100%"
            subtitle={t("blood_bank__checks_complete")}
            tone="green"
          />
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">{t("blood_bank__inventory_title")}</h2>
                <p className="text-sm text-slate-500">
                  {t("blood_bank__inventory_subtitle")}
                </p>
              </div>
              <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 focus-within:border-[#be2f45]">
                <Search className="size-4" aria-hidden="true" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t("blood_bank__search_inventory")}
                  className="w-40 bg-transparent outline-none placeholder:text-slate-400"
                />
              </label>
            </div>

            {units.isLoading ? (
              <p className="p-5 text-sm text-slate-500">{t("blood_bank__loading")}</p>
            ) : units.isError ? (
              <p className="p-5 text-sm text-red-600">{t("blood_bank__load_error")}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr className="border-b border-slate-200">
                      <th className="px-5 py-3">{t("blood_bank__donation_id")}</th>
                      <th className="px-5 py-3">{t("blood_bank__blood_group")}</th>
                      <th className="px-5 py-3">{t("blood_bank__component")}</th>
                      <th className="px-5 py-3">{t("blood_bank__expires")}</th>
                      <th className="px-5 py-3">{t("blood_bank__status")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUnits.map((unit) => (
                      <tr key={unit.external_id} className="hover:bg-slate-50">
                        <td className="px-5 py-4 font-semibold">{unit.donation_id}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-md bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700">
                            {unit.blood_group}
                          </span>
                        </td>
                        <td className="px-5 py-4 capitalize text-slate-600">
                          {unit.component.replace("_", " ")}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          <Clock3 className="mr-1 inline size-3.5" />
                          {new Date(unit.expires_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                            {t("blood_bank__available")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                <h2 className="text-lg font-bold">{t("blood_bank__requests_title")}</h2>
                <p className="text-sm text-slate-500">
                  {t("blood_bank__requests_subtitle")}
                </p>
              </div>
              <div className="space-y-3 p-4">
                {requests.isLoading ? (
                  <p className="text-sm text-slate-500">{t("blood_bank__loading")}</p>
                ) : openRequests.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    {t("blood_bank__no_requests")}
                  </p>
                ) : (
                  openRequests.map((request) => (
                    <div
                      key={request.external_id}
                      className="rounded-lg border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {request.patient_name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {request.blood_group} · {request.units_requested}{" "}
                            {t("blood_bank__units")}
                          </p>
                        </div>
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold capitalize text-amber-700">
                          {request.urgency}
                        </span>
                      </div>
                      <button className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-[#be2f45] hover:text-[#be2f45]">
                        {t("blood_bank__review_request")}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                <h2 className="text-lg font-bold">{t("blood_bank__blood_group_title")}</h2>
                <p className="text-sm text-slate-500">
                  {t("blood_bank__blood_group_subtitle")}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2 p-4">
                {["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"].map((group) => {
                  const count =
                    units.data?.filter((unit) => unit.blood_group === group)
                      .length ?? 0;
                  return (
                    <div
                      key={group}
                      className={`rounded-lg border p-2 text-center ${
                        count
                          ? "border-rose-200 bg-rose-50"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-700">{group}</p>
                      <p
                        className={`mt-1 text-lg font-bold ${
                          count ? "text-rose-700" : "text-slate-400"
                        }`}
                      >
                        {count}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">{t("blood_bank__workflow_title")}</h2>
              <p className="text-sm text-slate-500">
                {t("blood_bank__workflow_subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <WorkflowStep label={t("blood_bank__step_collect")} active />
              <ChevronRight className="size-4 text-slate-300" />
              <WorkflowStep label={t("blood_bank__step_test")} active />
              <ChevronRight className="size-4 text-slate-300" />
              <WorkflowStep label={t("blood_bank__step_store")} active />
              <ChevronRight className="size-4 text-slate-300" />
              <WorkflowStep label={t("blood_bank__step_issue")} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatBlock({
  title,
  value,
  subtitle,
  tone,
}: {
  title: string;
  value: string;
  subtitle: string;
  tone: "red" | "amber" | "blue" | "green";
}) {
  const toneClass = {
    red: "text-rose-700 bg-rose-50",
    amber: "text-amber-700 bg-amber-50",
    blue: "text-sky-700 bg-sky-50",
    green: "text-emerald-700 bg-emerald-50",
  }[tone];

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-md px-2 py-1 text-xs font-bold ${toneClass}`}>
          {tone === "green" ? (
            <ShieldCheck className="size-3.5" />
          ) : tone === "blue" ? (
            <Users className="size-3.5" />
          ) : (
            <Droplet className="size-3.5" />
          )}
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function WorkflowStep({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {label}
    </div>
  );
}
