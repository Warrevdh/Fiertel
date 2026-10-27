import FiertelRoute from "./FiertelRoute";

interface RouteProgressProps {
  raised: number;
  goal: number;
  bells: number;
  goalReached: boolean;
  remaining: number;
}

function RouteProgress({
  raised,
  goal,
  bells,
  goalReached,
  remaining,
}: RouteProgressProps) {
  return (
    <section className="route-section">
      <div className="route-header">
        <div>
          <p className="section-label">Onze weg rond Ronse</p>
          <h2>De Fiertel groeit met elke belslag</h2>
        </div>

        <div className="amount">
          €{raised.toLocaleString("nl-BE")}
          <span> / €{goal.toLocaleString("nl-BE")}</span>
        </div>
      </div>

      <FiertelRoute progress={raised / goal} />

      {goalReached ? (
        <div className="goal-reached">
          <strong>De volledige Fiertel klinkt!</strong>

          <p>
            Dankzij {bells.toLocaleString("nl-BE")} geschonken belslagen hebben
            we samen de volledige ronde bereikt.
          </p>
        </div>
      ) : (
        <p className="remaining">
          Nog <strong>{remaining.toLocaleString("nl-BE")}</strong> belslagen tot
          de volledige Fiertel.
        </p>
      )}
    </section>
  );
}

export default RouteProgress;
