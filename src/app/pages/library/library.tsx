import { useState } from "react";
import LibraryDashboard from "./dashboard";
import LibraryFullGrid from "./fullgrid";

type LibraryView = 'DASHBOARD' | 'VIEW_ALL';

export default function Library() {
  const [view, setView] = useState<LibraryView>('DASHBOARD');

  return (
    <div className="h-screen">
      {view === 'DASHBOARD' ? (
        <LibraryDashboard goView={() => setView('VIEW_ALL')} />
      ) : (
        <LibraryFullGrid goDashboard={() => setView('DASHBOARD')} />
      )}
    </div>
  );
}