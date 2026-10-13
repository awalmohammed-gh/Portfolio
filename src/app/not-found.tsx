import { LuArrowLeft } from "react-icons/lu";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container className="relative flex min-h-[65vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-gradient text-7xl font-semibold tracking-tight sm:text-8xl">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-muted">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div className="mt-8">
          <ButtonLink href="/">
            <LuArrowLeft aria-hidden="true" className="size-4" />
            Back to home
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
