import { Suspense } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TopBar } from "@/components/layout/top-bar";
import { RouteTransition } from "@/components/providers/route-transition";
import { BankPageSkeleton } from "@/components/shared/bank-page-skeleton";
import { ContextBackButton } from "@/components/layout/context-back-button";
import { ScrollRevealController } from "@/components/providers/scroll-reveal-controller";
import { LayoutEditorOverlay } from "@/components/layout/layout-editor-overlay";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-grid h-dvh min-h-0 overflow-hidden">
      <div aria-hidden="true" className="ambient-orb ambient-orb-lime" />
      <div aria-hidden="true" className="ambient-orb ambient-orb-orange" />
      <div aria-hidden="true" className="ambient-orb ambient-orb-blue" />
      <Suspense fallback={null}>
        <AppSidebar />
      </Suspense>
      <div className="app-content flex h-dvh min-w-0 flex-col lg:pl-[248px]">
        <TopBar />
        <main id="app-scroll-region" className="app-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full max-w-[1600px] px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-10">
            <Suspense fallback={null}><ContextBackButton /></Suspense>
            <Suspense fallback={<BankPageSkeleton />}>
              <RouteTransition>{children}</RouteTransition>
            </Suspense>
          </div>
        </main>
      </div>
      <Suspense fallback={null}><ScrollRevealController /></Suspense>
      <LayoutEditorOverlay />
      <div aria-hidden="true" className="mobile-bottom-fade lg:hidden" />
      <Suspense fallback={null}>
        <MobileNav />
      </Suspense>
    </div>
  );
}
