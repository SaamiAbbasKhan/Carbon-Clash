import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Leaderboard from "./Leaderboard";

describe("Leaderboard component tests", () => {
  const defaultProps = {
    currentUsername: "Saami",
    currentLevel: 12,
    currentXp: 3450,
    currentStreak: 17,
  };

  it("should render default World leaderboard with top users and podium ranks", () => {
    render(<Leaderboard {...defaultProps} />);

    // Verify World tab is selected by default
    const worldBtn = screen.getByRole("button", { name: /World/i });
    expect(worldBtn).toHaveClass("text-emerald-400");

    // Verify first rank podium name is shown
    expect(screen.getAllByText("EcoBoss_99")[0]).toBeInTheDocument();
    
    // Verify user Saami is on the leaderboard list
    expect(screen.getAllByText("Saami")[0]).toBeInTheDocument();
    expect(screen.getByText("YOU")).toBeInTheDocument();
  });

  it("should switch tabs and show University user lists and college battle warning", () => {
    render(<Leaderboard {...defaultProps} />);

    const universityBtn = screen.getByRole("button", { name: /University/i });
    fireEvent.click(universityBtn);

    // StanfordEcoGamer should now show in university list and/or podium
    expect(screen.getAllByText("StanfordEcoGamer")[0]).toBeInTheDocument();

    // Verify university event banner is shown
    expect(screen.getByText(/ANNUAL SUNDOWN CAMPUS BATTLE/i)).toBeInTheDocument();
  });

  it("should switch tabs and show Friends Lobby lists", () => {
    render(<Leaderboard {...defaultProps} />);

    const friendsBtn = screen.getByRole("button", { name: /Friends Lobby/i });
    fireEvent.click(friendsBtn);

    // AlexCommute should now show in Friends list/podium
    expect(screen.getAllByText("AlexCommute")[0]).toBeInTheDocument();
    expect(screen.queryByText(/ANNUAL SUNDOWN CAMPUS BATTLE/i)).not.toBeInTheDocument();
  });

  it("should allow changing timeframe options", () => {
    render(<Leaderboard {...defaultProps} />);

    const allTimeBtn = screen.getByRole("button", { name: /All-Time XP/i });
    expect(allTimeBtn).toBeInTheDocument();
    
    fireEvent.click(allTimeBtn);
    expect(allTimeBtn).toHaveClass("text-slate-200");
  });
});
