import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(135deg, #020617 0%, #0b1224 50%, #1e293b 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1 }}>TECHERA</div>
        <div style={{ marginTop: 16, fontSize: 42, fontWeight: 700, lineHeight: 1.2 }}>
          Nền tảng Quản lý &amp; Phân phối Vé Toàn Diện
        </div>
        <div style={{ marginTop: 20, fontSize: 24, color: "rgba(226,232,240,0.9)", maxWidth: 920 }}>
          Giải pháp quản lý, phân phối và bán vé thông minh cho khu du lịch, sự kiện và doanh nghiệp.
        </div>
      </div>
    ),
    size
  );
}

