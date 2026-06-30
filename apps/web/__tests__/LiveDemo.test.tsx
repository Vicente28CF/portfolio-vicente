import { render, screen } from "@testing-library/react";
import { AudienceProvider } from "@/lib/audience-context";
import DemoSection from "@/components/sections/DemoSection";

describe("DemoSection", () => {
  it("renderiza título en modo reclutador", () => {
    render(
      <AudienceProvider>
        <DemoSection />
      </AudienceProvider>,
    );
    expect(
      screen.getByText("Pruébalo tú mismo: una consola real"),
    ).toBeInTheDocument();
  });
});
