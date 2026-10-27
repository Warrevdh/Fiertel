interface HeroProps {
  bells: number;
  percentage: number;
}

function Hero({ bells, percentage }: HeroProps) {
  return (
    <section className="hero">
      <p className="eyebrow">Fiertelommegang Ronse</p>

      <h1>Laat de Fiertel klinken</h1>

      <p className="intro">
        Elke euro brengt de Fiertel een belslag verder. Samen maken we de
        volledige ronde rond Ronse.
      </p>

      <div className="stats">
        <div className="stat">
          <span className="stat-value">{bells.toLocaleString("nl-BE")}</span>
          <span className="stat-label">belslagen</span>
        </div>

        <div className="divider" />

        <div className="stat">
          <span className="stat-value">{percentage.toFixed(1)}%</span>
          <span className="stat-label">van de Fiertel</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
