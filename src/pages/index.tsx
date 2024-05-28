import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { Button } from "antd";

const inter = Inter({ subsets: ["latin"] });

const NotificationComp = dynamic(() => import("../components/Notification"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {

  // const id = process.env.FIREBASE_CLIENT_ID;

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {/* <Button type="primary">{id}</Button> */}
      <NotificationComp />
    </main>
  );
}
