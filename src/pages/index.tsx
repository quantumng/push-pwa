import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

const NotificationComp = dynamic(() => import("../components/Notification"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <NotificationComp />
    </main>
  );
}
