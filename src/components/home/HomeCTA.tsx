import Link from "next/link";

export function HomeCTA() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            Interested in an artwork?
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Send a message and we’ll get back to you.
          </p>
        </div>

        <Link
          href="/contact"
          className="inline-flex w-fit items-center justify-center rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 hover:shadow-md dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Contact
        </Link>
      </div>
    </section>
  );
}
