import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex fixed justify-center gap-6 w-full uppercase">
      <Link href="/high-scores" className="relative nav-link text-2xl p-2">
        High-Scores
      </Link>
      <Link href="/comments" className="relative nav-link text-2xl  p-2">
        Comments
      </Link>
    </nav>
  );
}
