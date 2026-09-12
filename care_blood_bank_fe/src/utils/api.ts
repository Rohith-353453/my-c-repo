const STAFF_TOKEN_KEY = "care_access_token";
const PATIENT_TOKEN_KEY = "care_patient_token";
const BASE_PATH = "/api/care_blood_bank";

function getPatientToken(): string | null {
  try {
    const stored = JSON.parse(localStorage.getItem(PATIENT_TOKEN_KEY) || "null");
    return stored?.token ?? null;
  } catch {
    return null;
  }
}

function getAuthToken() {
  return localStorage.getItem(STAFF_TOKEN_KEY) ?? getPatientToken();
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function request<T>(
  endpoint: string,
  method: Method = "GET",
  body?: unknown,
  queryParams?: Record<string, string | number | boolean | undefined | null>,
): Promise<T> {
  const url = new URL(`${window.CARE_API_URL}${BASE_PATH}${endpoint}`);
  Object.entries(queryParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  const token = getAuthToken();
  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const detail = data?.detail;
    throw new ApiError(response.status, data, typeof detail === "string" ? detail : `Request failed with status ${response.status}`);
  }
  return data as T;
}

export interface Donor {
  external_id: string;
  name: string;
  blood_group: string;
  eligibility_status: "eligible" | "deferred" | "ineligible";
}

export interface BloodUnit {
  external_id: string;
  donation_id: string;
  blood_group: string;
  component: string;
  status: "available" | "reserved" | "issued" | "discarded" | "expired";
  expires_at: string;
}

export interface BloodRequest {
  external_id: string;
  patient_name: string;
  blood_group: string;
  component: string;
  units_requested: number;
  urgency: "routine" | "urgent" | "emergency";
  status: string;
}

export const API = {
  config: () => request<{ enabled: boolean }>("/config/"),
  donors: () => request<Donor[]>("/donors/"),
  units: (queryParams?: Record<string, string>) =>
    request<BloodUnit[]>("/units/", "GET", undefined, queryParams),
  requests: () => request<BloodRequest[]>("/requests/"),
};
