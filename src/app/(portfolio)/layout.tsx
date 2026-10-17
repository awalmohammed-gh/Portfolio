import PortfolioShell from "@/components/layout/PortfolioShell";

export default function PortfolioLayout({ children }: LayoutProps<"/">) {
  return <PortfolioShell>{children}</PortfolioShell>;
}
