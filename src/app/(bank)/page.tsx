import { BalanceHero } from "@/components/dashboard/balance-hero";
import { BankCard } from "@/components/dashboard/bank-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingWidget } from "@/components/dashboard/spending-widget";
import { FinancialPulse } from "@/components/dashboard/financial-pulse";
import { UpcomingPayments } from "@/components/dashboard/upcoming-payments";
import { SavingsGoals } from "@/components/dashboard/savings-goals";
import { EverydayServices } from "@/components/dashboard/everyday-services";
import { HomeHeading } from "@/components/dashboard/home-heading";

export default function HomePage() {
  return (
    <>
      <HomeHeading />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,.75fr)]">
        <div className="order-2 space-y-4 xl:order-1"><BalanceHero /><QuickActions /></div>
        <div className="order-1 xl:order-2"><BankCard /></div>
      </div>
      <div className="dashboard-sections mt-4 grid gap-4 xl:grid-cols-12">
        <section className="dashboard-section-pulse xl:col-span-12"><FinancialPulse /></section>
        <section className="dashboard-section-spending xl:col-span-7"><SpendingWidget /></section>
        <section className="dashboard-section-upcoming xl:col-span-5"><UpcomingPayments /></section>
        <section className="dashboard-section-goals xl:col-span-12"><SavingsGoals /></section>
        <section className="dashboard-section-services xl:col-span-12"><EverydayServices /></section>
        <section className="dashboard-section-history xl:col-span-12"><RecentTransactions /></section>
      </div>
    </>
  );
}
