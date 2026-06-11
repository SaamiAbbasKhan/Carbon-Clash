import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// Mock Framer Motion to prevent JSDOM requestAnimationFrame/animation timing issues
vi.mock("motion/react", () => {
  const mockComponent = ({ children, ...props }: any) => {
    // Strip transition/initial/animate/exit props to avoid React warnings in JSDOM
    const { initial, animate, exit, transition, ...rest } = props;
    return <div {...rest}>{children}</div>;
  };
  return {
    motion: {
      div: mockComponent,
      span: mockComponent,
      header: mockComponent,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe("App component integration tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render the landing page by default and proceed to app on enter", async () => {
    render(<App />);

    // Verify landing page heading is shown
    expect(screen.getByText(/The Battle For the/i)).toBeInTheDocument();
    expect(screen.getByText(/Planet's Tomorrow/i)).toBeInTheDocument();

    // Find and click the enter button
    const enterBtn = screen.getByRole("button", { name: /Enter Action Compact/i });
    expect(enterBtn).toBeInTheDocument();
    
    fireEvent.click(enterBtn);

    // After entering, since default state has surveyCompleted = true for mock Saami,
    // it should transition directly to the main layout Dashboard tab.
    await waitFor(() => {
      expect(screen.getByText(/GOOD MORNING, CLASH FIGHTER/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Daily Quests/i)).toBeInTheDocument();
    });
  });

  it("should navigate tabs when clicking top HUD buttons", async () => {
    render(<App />);

    // Enter main app
    const enterBtn = screen.getByRole("button", { name: /Enter Action Compact/i });
    fireEvent.click(enterBtn);

    // Verify we're on the dashboard
    await waitFor(() => {
      expect(screen.getByText(/GOOD MORNING, CLASH FIGHTER/i)).toBeInTheDocument();
    });

    // Click Virtual Grid tab
    const gridBtn = screen.getByRole("button", { name: /Virtual Grid/i });
    fireEvent.click(gridBtn);
    expect(screen.getByText(/Realm Statistics/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Balance/i)).toBeInTheDocument();

    // Click Leaderboard tab
    const leadBtn = screen.getByRole("button", { name: /Leaderboard/i });
    fireEvent.click(leadBtn);
    expect(screen.getAllByText("EcoBoss_99")[0]).toBeInTheDocument();
  });
});
