import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

function createDiv(displayName: string) {
  const Comp = React.forwardRef<any, any>(({ children, ...props }, ref) => {
    const { initial, animate, transition, exit, whileInView, viewport, ...safe } = props;
    return React.createElement("div", { ...safe, ref }, children);
  });
  Comp.displayName = displayName;
  return Comp;
}

vi.mock("framer-motion", () => ({
  motion: {
    div: createDiv("motion.div"),
    a: createDiv("motion.a"),
    section: createDiv("motion.section"),
    p: createDiv("motion.p"),
    span: createDiv("motion.span"),
    h1: createDiv("motion.h1"),
    h2: createDiv("motion.h2"),
    h3: createDiv("motion.h3"),
  },
  AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
}));

vi.mock("lucide-react", () => {
  function createIcon(name: string) {
    const Icon = (props: any) => React.createElement("span", { "data-testid": `icon-${name}`, ...props });
    Icon.displayName = name;
    return Icon;
  }
  return {
    ArrowDown: createIcon("ArrowDown"),
    Github: createIcon("Github"),
    Linkedin: createIcon("Linkedin"),
    Menu: createIcon("Menu"),
    X: createIcon("X"),
    ExternalLink: createIcon("ExternalLink"),
    Send: createIcon("Send"),
    CheckCircle: createIcon("CheckCircle"),
  };
});
