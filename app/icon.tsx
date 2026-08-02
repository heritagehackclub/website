import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        background: "#ec3750",
        borderRadius: 16,
        fontFamily: "sans-serif",
        fontSize: 34,
        fontWeight: 800,
      }}
    >
      H
    </div>,
    size,
  );
}
