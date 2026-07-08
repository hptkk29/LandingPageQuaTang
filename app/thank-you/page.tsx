import { ThankYouView } from "./ThankYouView";

export const metadata = {
  title: "Cảm ơn ba mẹ — Sata Robo",
  description:
    "Đăng ký thành công. Sata Robo sẽ liên hệ ba mẹ trong 24 giờ.",
  robots: { index: false },
};

export default function ThankYouPage() {
  return <ThankYouView />;
}
