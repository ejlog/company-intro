import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ADDSEN | 주식회사 애드센",
    template: "%s | ADDSEN",
  },
  description:
    "비전 기반 Physical AI로 차세대 의료기기와 로봇 자동화 시스템을 개발합니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
