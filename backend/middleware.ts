import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  // Chỉ bảo vệ các route api (có thể mở rộng)
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }
    const token = auth.split(" ")[1];
    try {
      const user = jwt.verify(token, "SECRET_KEY");
      // Gán user vào request để các API khác dùng
      req.user = user;
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Token không hợp lệ" }, { status: 401 });
    }
  }
  return NextResponse.next();
}

// Có thể mở rộng: kiểm tra role cho từng route bằng cách đọc req.user.role trong từng API