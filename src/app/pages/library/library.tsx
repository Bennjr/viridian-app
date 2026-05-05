import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import these
import LibraryDashboard from "./dashboard";
import LibraryFullGrid from "./fullgrid";

type LibraryView = 'DASHBOARD' | 'VIEW_ALL';

export default function Library() {
  const [view, setView] = useState<LibraryView>('DASHBOARD');

  return (
    <div className="h-screen w-full bg-c-primary">
      <AnimatePresence mode="wait">

        {view === 'DASHBOARD' ? (
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
            transition={{ duration: 0.1, ease: "circOut" }}
            className="h-full w-full"
          >
            <LibraryDashboard goView={() => setView('VIEW_ALL')} />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="h-full w-full"
          >
            <LibraryFullGrid goDashboard={() => setView('DASHBOARD')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}