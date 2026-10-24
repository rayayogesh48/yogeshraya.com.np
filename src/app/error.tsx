"use client";

import { ErrorScreen } from "@/components/site/error-screen";

export default function ErrorPage() {
  return (
    <ErrorScreen
      code="500"
      label="Error 500 · Something went wrong"
      title="Lost the trail."
      message="This page couldn’t load just now. Head back home and try again in a moment."
    />
  );
}
