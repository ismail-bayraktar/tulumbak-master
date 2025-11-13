export default function HomePage() {
  return (
    <main className="min-h-screen px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">
          🧁 Tulumbak İzmir Baklava
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Next.js 15 + TypeScript + Tailwind CSS + Zustand
        </p>
        <p className="text-lg text-green-600 font-semibold">
          ✅ CHECKPOINT 1 TAMAMLANDI
        </p>
        <div className="mt-8 text-left max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg">
          <h2 className="font-bold text-lg mb-2">Kurulu Paketler:</h2>
          <ul className="space-y-1 text-sm">
            <li>✅ Next.js 15 (App Router)</li>
            <li>✅ React 19</li>
            <li>✅ TypeScript 5</li>
            <li>✅ Tailwind CSS 3</li>
            <li>✅ Zustand (State Management)</li>
            <li>✅ Axios (HTTP Client)</li>
            <li>✅ Lucide React (Icons)</li>
            <li>✅ React Toastify (Notifications)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
