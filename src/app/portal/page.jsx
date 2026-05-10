import Link from "next/link";

export default function PortalPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: `linear-gradient(#ddd 1px, transparent 1px),
          linear-gradient(90deg, #ddd 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    >
      <div className="text-center space-y-6 bg-white border border-black/10 rounded-2xl p-10 shadow-xl">
        <h1 className="text-3xl font-bold !text-gray-900">Welcome to Portal</h1>

        <p className="text-gray-500">Access your account securely</p>

        <Link
          href="/portal/login"
          className="inline-block px-6 py-2 rounded-lg 
             bg-gradient-to-r from-purple-500 to-pink-500 
             text-white font-medium 
             hover:from-purple-600 hover:to-pink-600 
             transition-all duration-300"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
