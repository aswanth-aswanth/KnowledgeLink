// import Footer from "@/components/shared/Footer"
import Header from "@/components/shared/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div >
      <Header />
      <main className="max-w-[1224px] px-4 md:px-0 mx-auto ">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
