import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LostField } from "@/components/visual/lost-field.client";

/** Full-screen error page: the status code as halftone peaks, a short message and one way back home. */
export function ErrorScreen({ code, label, title, message }: { code: string; label: string; title: string; message: string }) {
  return (
    <div className="error-screen">
      <div className="error-screen-copy page-width">
        <p className="error-screen-code">{label}</p>
        <h1>{title}</h1>
        <p>{message}</p>
        <Link href="/" className="button primary">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
      <div className="error-screen-stage">
        <LostField code={code} />
      </div>
    </div>
  );
}
