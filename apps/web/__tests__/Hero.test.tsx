import { render, screen } from "@testing-library/react";
import Hero from "@/components/sections/Hero";

describe("Hero", () => {
  it("renderiza el nombre y rol", () => {
    render(<Hero />);
    expect(screen.getByText("[Tu Nombre]")).toBeInTheDocument();
    expect(screen.getByText("Ver proyectos")).toBeInTheDocument();
    expect(screen.getByText("Contactar")).toBeInTheDocument();
  });

  it("el link de proyectos navega a #projects", () => {
    render(<Hero />);
    const link = screen.getByText("Ver proyectos");
    expect(link).toHaveAttribute("href", "#projects");
  });
});
