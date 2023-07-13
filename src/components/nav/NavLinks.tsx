import Link from "next/link";

export default function NavLinks() {
  return (
    <div className="flex gap-3 ml-2">
      <Link href="/" className="relative nav-link p-2">
        Game
      </Link>
      <Link href="/high-scores" className="relative nav-link p-2">
        High-Scores
      </Link>
      <Link href="/comments" className="relative nav-link p-2">
        Comments
      </Link>
    </div>
  );
}
