import Link from 'next/link';

interface ApartmentLayoutProps {
  children: React.ReactNode;
}

export default function ApartmentLayout({ children }: ApartmentLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer (Optional) */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-blue-300/70">
            <p>&copy; 2026 Elemental App. Todos los derechos reservados.</p>
            <div className="flex items-center space-x-4">
              <Link href="/help" className="hover:text-white transition-colors">
                Ayuda
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}