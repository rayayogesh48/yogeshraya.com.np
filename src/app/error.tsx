"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="page-width subpage">
      <div className="page-heading">
        <h1>This page could not load.</h1>
        <p>Please try again.</p>
        <button type="button" className="button" onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
