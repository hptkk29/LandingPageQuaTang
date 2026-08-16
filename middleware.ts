import { NextResponse, type NextRequest } from "next/server";

// Rewrite host covua.quatang.edu.vn → route /covua (docs covua 05 §3).
// File này MỚI (repo trước đó không có middleware). Host khác nhánh covua
// đi thẳng NextResponse.next() — trang quatang cũ không đổi hành vi.

const COVUA_HOSTS = new Set([
  "covua.quatang.edu.vn",
  "covua.localhost:3000", // dev: http://covua.localhost:3000
]);

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  if (COVUA_HOSTS.has(host) && !pathname.startsWith("/covua")) {
    const url = req.nextUrl.clone();
    url.pathname = `/covua${pathname === "/" ? "" : pathname}`;
    // rewrite, KHÔNG redirect: thanh địa chỉ phải giữ nguyên subdomain
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Loại trừ api (form vẫn gọi /api/lead-covua trực tiếp), asset tĩnh và
  // mọi file có đuôi mở rộng.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
