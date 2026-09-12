import { useQuery } from "@tanstack/react-query";
import { Boxes, Droplet, HeartPulse, Users, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { API } from "@/utils/api";

export default function ExamplePage() {
  const { t } = useTranslation();
  const units = useQuery({ queryKey: ["blood-bank", "units"], queryFn: () => API.units({ status: "available" }) });
  const donors = useQuery({ queryKey: ["blood-bank", "donors"], queryFn: API.donors });
  const requests = useQuery({ queryKey: ["blood-bank", "requests"], queryFn: API.requests });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-700">{t("blood_bank__eyebrow")}</p>
            <h1 className="mt-1 text-2xl font-bold text-secondary-900">{t("blood_bank__page_title")}</h1>
          </div>
          <HeartPulse className="size-8 text-primary-700" aria-hidden="true" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <SummaryCard icon={Droplet} label={t("blood_bank__available_units")} value={units.data?.length} />
          <SummaryCard icon={Users} label={t("blood_bank__registered_donors")} value={donors.data?.length} />
          <SummaryCard icon={Boxes} label={t("blood_bank__open_requests")} value={requests.data?.filter((item) => item.status === "pending").length} />
        </div>
        <section className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-secondary-900">{t("blood_bank__inventory_title")}</h2>
          {units.isLoading ? (
            <p className="mt-4 text-sm text-secondary-600">{t("blood_bank__loading")}</p>
          ) : units.isError ? (
            <p className="mt-4 text-sm text-red-600">{t("blood_bank__load_error")}</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 text-secondary-600">
                  <tr><th className="px-3 py-2">{t("blood_bank__donation_id")}</th><th className="px-3 py-2">{t("blood_bank__blood_group")}</th><th className="px-3 py-2">{t("blood_bank__component")}</th><th className="px-3 py-2">{t("blood_bank__expires")}</th></tr>
                </thead>
                <tbody>
                  {units.data?.map((unit) => (
                    <tr key={unit.external_id} className="border-b border-gray-100 last:border-0">
                      <td className="px-3 py-3 font-medium">{unit.donation_id}</td>
                      <td className="px-3 py-3">{unit.blood_group}</td>
                      <td className="px-3 py-3">{unit.component.replace("_", " ")}</td>
                      <td className="px-3 py-3">{new Date(unit.expires_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value?: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <Icon className="size-5 text-primary-700" aria-hidden="true" />
      <p className="mt-3 text-sm text-secondary-600">{label}</p>
      <p className="mt-1 text-2xl font-bold text-secondary-900">{value ?? "—"}</p>
    </div>
  );
}
