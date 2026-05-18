import type { LeadInput } from "@/lib/schemas/lead";
import type { LeadApiResponse } from "@/lib/types/api";

export async function submitLead(data: LeadInput): Promise<LeadApiResponse> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = (await res.json()) as LeadApiResponse;
    return json;
  } catch (err) {
    console.error("[submitLead] Network error:", err);
    return {
      ok: false,
      error: "NETWORK_ERROR",
      message: "Mất kết nối, vui lòng kiểm tra mạng và thử lại",
    };
  }
}
