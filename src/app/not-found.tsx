import { ErrorScreen } from "@/components/site/error-screen";

export default function NotFound() {
  return (
    <ErrorScreen
      code="404"
      label="Error 404 · Page not found"
      title="A little off the path."
      message="This page may have moved, or it isn’t available yet."
    />
  );
}
