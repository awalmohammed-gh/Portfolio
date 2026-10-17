import PortfolioShell from "@/components/layout/PortfolioShell";
import NotFoundContent from "@/components/ui/NotFoundContent";

/** 404 for unmatched URLs, rendered with the public site's chrome. */
export default function NotFound() {
  return (
    <PortfolioShell>
      <NotFoundContent />
    </PortfolioShell>
  );
}
