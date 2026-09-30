import type { PropsWithChildren } from "react";
import type { AppRoute } from "../routes/AppRouter";
import { TopNav } from "../components/TopNav";

export const SiteLayout = ({
  currentRoute,
  navigate,
  children,
}: PropsWithChildren<{ currentRoute: AppRoute; navigate: (to: string) => void }>) => {
  return (
    <div className="site-shell">
      <TopNav currentRoute={currentRoute} navigate={navigate} />
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <p>JUNO • Designed in Argentina • Japanese Design Mindset • Chinese Manufacturing Pragmatism</p>
      </footer>
    </div>
  );
};
