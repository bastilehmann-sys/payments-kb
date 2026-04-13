import type { Stats } from '@/lib/queries/dashboard';

// Custom inline SVGs — ~20px, single stroke, SAP green
function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="#86bc25"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 2L3 5v5c0 4.1 2.9 7.9 7 9 4.1-1.1 7-4.9 7-9V5L10 2z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="#86bc25"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-5z" />
      <path d="M12 2v5h5" />
      <path d="M7 10h6M7 13h4" />
    </svg>
  );
}

function ArrowsHorizontalIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="#86bc25"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10h12M13 7l3 3-3 3M7 7L4 10l3 3" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="#86bc25"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="8" />
      <path d="M2 10h16" />
      <path d="M10 2c-2.5 2.5-3 5-3 8s.5 5.5 3 8" />
      <path d="M10 2c2.5 2.5 3 5 3 8s-.5 5.5-3 8" />
    </svg>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex items-center justify-between">
        <span className="text-base font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {icon}
      </div>
      <span className="font-heading text-5xl font-bold tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}

interface StatsRowProps {
  stats: Stats;
}

function BankIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="#86bc25"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 18h16M2 8h16M4 8v10M8 8v10M12 8v10M16 8v10M10 2l8 6H2l8-6z" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="#86bc25"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="5" width="16" height="12" rx="2" />
      <path d="M2 9h16M6 13h2M10 13h4" />
    </svg>
  );
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      <StatCard
        label="Regulatorik"
        value={stats.regulatorik}
        icon={<ShieldIcon />}
      />
      <StatCard
        label="Formate"
        value={stats.formate}
        icon={<DocumentIcon />}
      />
      <StatCard
        label="Clearing"
        value={stats.clearing}
        icon={<ArrowsHorizontalIcon />}
      />
      <StatCard
        label="Zahlungsarten"
        value={stats.zahlungsarten}
        icon={<PaymentIcon />}
      />
      <StatCard
        label="IHB / POBO"
        value={stats.ihb}
        icon={<BankIcon />}
      />
      <StatCard
        label="Länder"
        value={stats.totalCountries}
        icon={<GlobeIcon />}
      />
    </div>
  );
}
