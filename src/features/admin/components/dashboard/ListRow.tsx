import Image from "next/image";
import Link from "next/link";
import { MdArrowForward } from "react-icons/md";

export function ListRow({
  href,
  title,
  subtitle,
  meta,
  imageUrl,
}: {
  href: string;
  title: string;
  subtitle?: string;
  meta?: string;
  imageUrl?: string | null;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-muted/60"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              width={38}
              height={38}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{title}</div>
          {subtitle ? (
            <div className="truncate text-xs text-muted-foreground">
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {meta ? (
          <span className="text-xs text-muted-foreground">{meta}</span>
        ) : null}

        <MdArrowForward
          size={18}
          className="text-muted-foreground opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100"
        />
      </div>
    </Link>
  );
}
