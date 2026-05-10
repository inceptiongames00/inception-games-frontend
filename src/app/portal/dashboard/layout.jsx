import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div 
      className="flex flex-col md:flex-row min-h-screen"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: `linear-gradient(#ddd 1px, transparent 1px),
          linear-gradient(90deg, #ddd 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    >
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 md:h-screen md:overflow-y-auto">
        <div className="max-w-7xl mx-auto pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
