import { createServer } from "node:http";
import { parse } from "node:url";

const port = Number(process.env.PORT || 9000);

const donors = [
  {
    external_id: "11111111-1111-4111-8111-111111111111",
    name: "Asha Rao",
    blood_group: "O+",
    eligibility_status: "eligible",
  },
  {
    external_id: "22222222-2222-4222-8222-222222222222",
    name: "Daniel Kim",
    blood_group: "A-",
    eligibility_status: "eligible",
  },
  {
    external_id: "33333333-3333-4333-8333-333333333333",
    name: "Maya Patel",
    blood_group: "B+",
    eligibility_status: "deferred",
  },
];

const units = [
  {
    external_id: "aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
    donation_id: "DON-2026-001",
    blood_group: "O+",
    component: "red_cells",
    status: "available",
    expires_at: "2026-10-03T12:00:00Z",
  },
  {
    external_id: "aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
    donation_id: "DON-2026-002",
    blood_group: "A-",
    component: "plasma",
    status: "available",
    expires_at: "2026-09-28T12:00:00Z",
  },
  {
    external_id: "aaaaaaa3-aaaa-4aaa-8aaa-aaaaaaaaaaa3",
    donation_id: "DON-2026-003",
    blood_group: "B+",
    component: "platelets",
    status: "reserved",
    expires_at: "2026-09-15T12:00:00Z",
  },
];

const requests = [
  {
    external_id: "bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbb1",
    patient_name: "Emergency Ward - Patient 1042",
    blood_group: "O+",
    component: "red_cells",
    units_requested: 2,
    urgency: "urgent",
    status: "pending",
  },
  {
    external_id: "bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2",
    patient_name: "Surgical Ward - Patient 1088",
    blood_group: "A-",
    component: "plasma",
    units_requested: 1,
    urgency: "routine",
    status: "approved",
  },
];

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  });
  response.end(JSON.stringify(body));
}

const server = createServer((request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    });
    response.end();
    return;
  }

  const { pathname, query } = parse(request.url, true);
  if (pathname === "/health/") {
    sendJson(response, 200, { status: "ok", service: "care_blood_bank_mock" });
    return;
  }
  if (pathname === "/api/care_blood_bank/config/") {
    sendJson(response, 200, { enabled: true, environment: "development" });
    return;
  }
  if (pathname === "/api/care_blood_bank/donors/") {
    sendJson(response, 200, donors);
    return;
  }
  if (pathname === "/api/care_blood_bank/requests/") {
    sendJson(response, 200, requests);
    return;
  }
  if (pathname === "/api/care_blood_bank/units/") {
    const filtered = units.filter(
      (unit) =>
        (!query.status || unit.status === query.status) &&
        (!query.blood_group || unit.blood_group === query.blood_group),
    );
    sendJson(response, 200, filtered);
    return;
  }

  sendJson(response, 404, { detail: "Not found" });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Care Blood Bank mock API listening on http://localhost:${port}`);
});
