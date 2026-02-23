import clsx from "clsx";
import Link from "next/link";
import { MdArrowForward } from "react-icons/md";

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  href,
  className,
  children,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  href?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const inner = (
    <div className={clsx("rounded-2xl border p-5", className)}>
      <div className="flex items-center gap-1.5">
        <div className="text-muted-foreground">{icon}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>

      <div className="mt-2 text-3xl font-semibold tabular-nums">{value}</div>

      {subtitle ? (
        <div className="mt-2 text-xs text-muted-foreground">{subtitle}</div>
      ) : null}

      {children ? <div className="mt-4 border-t pt-3">{children}</div> : null}
    </div>
  );

  if (!href) return inner;

  return (
    <Link href={href} className="group block">
      <div className="relative">
        {inner}
        <div className="pointer-events-none absolute right-5 top-5 text-muted-foreground opacity-0 transition group-hover:opacity-100">
          <MdArrowForward size={18} />
        </div>
      </div>
    </Link>
  );
}
