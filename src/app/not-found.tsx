import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound() {
  return (
    <div className="page-width subpage">
      <header className="page-heading">
        <h1>A little off the path.</h1>
        <p>This page may have moved, or it isn’t available yet.</p>
      </header>
      <Link href="/" className="button primary">
        <ArrowLeft size={16} />
        Back to Home
      </Link>
    </div>
  );
}
