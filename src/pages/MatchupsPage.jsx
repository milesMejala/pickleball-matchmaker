import { useLocation } from "react-router";
import Matchups from "../components/Matchups";

export default function MatchupsPage() {
  const { state } = useLocation();
  const matchups = state?.matchups ?? [];

  return (
    <div>
      <h1>Matchups</h1>
      {matchups.length > 0
        ? <Matchups matchups={matchups} />
        : <p>No matchups found. Go back and generate some!</p>
      }
    </div>
  );
}