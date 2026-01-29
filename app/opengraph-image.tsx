import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
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
          Tối ưu vận hành, mở rộng mạng lưới đại lý và tăng trưởng doanh thu cho khu du lịch, sự kiện và doanh
          nghiệp.
        </div>
        <div style={{ marginTop: 48, display: "flex", gap: 12 }}>
          <div
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              background: "rgba(59,130,246,0.18)",
              border: "1px solid rgba(59,130,246,0.35)",
              fontSize: 18,
              color: "rgba(191,219,254,1)",
            }}
          >
            techera.vn
          </div>
          <div
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              background: "rgba(168,85,247,0.16)",
              border: "1px solid rgba(168,85,247,0.35)",
              fontSize: 18,
              color: "rgba(233,213,255,1)",
            }}
          >
            Ticketing Platform
          </div>
        </div>
      </div>
    ),
    size
  );
}

