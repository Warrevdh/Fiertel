interface DonationSectionProps {
  donationAmount: number;
  customAmount: string;
  donationOptions: number[];
  isDonating: boolean;
  donationMessage: string | null;
  donationError: string | null;
  onSelectAmount: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
  onDonate: () => void;
}

function DonationSection({
  donationAmount,
  customAmount,
  donationOptions,
  isDonating,
  donationMessage,
  donationError,
  onSelectAmount,
  onCustomAmountChange,
  onDonate,
}: DonationSectionProps) {
  return (
    <section className="donation-section">
      <div className="donation-content">
        <p className="section-label">Draag jouw belslag bij</p>

        <h2>Hoeveel belslagen laat jij klinken?</h2>

        <p>
          Voor elke euro die je schenkt, voegen we één belslag toe aan onze
          tocht rond Ronse.
        </p>

        <div className="donation-options">
          {donationOptions.map((amount) => (
            <button
              key={amount}
              type="button"
              disabled={isDonating}
              className={
                donationAmount === amount && !customAmount ? "selected" : ""
              }
              onClick={() => onSelectAmount(amount)}>
              {amount} belslagen
              <span>€{amount}</span>
            </button>
          ))}
        </div>

        <div className="custom-donation">
          <label htmlFor="customAmount">
            Of kies je eigen aantal belslagen
          </label>

          <div className="custom-input">
            <span>€</span>

            <input
              id="customAmount"
              type="number"
              min="1"
              step="1"
              placeholder="Eigen bedrag"
              value={customAmount}
              disabled={isDonating}
              onChange={(event) => onCustomAmountChange(event.target.value)}
            />
          </div>
        </div>

        <button
          className="donate-button"
          type="button"
          onClick={onDonate}
          disabled={donationAmount <= 0 || isDonating}>
          {isDonating
            ? "Donatie verwerken..."
            : `Schenk ${donationAmount.toLocaleString("nl-BE")} ${
                donationAmount === 1 ? "belslag" : "belslagen"
              }`}
        </button>

        {donationMessage && (
          <div className="donation-success" role="status">
            <div className="success-icon">✓</div>

            <div>
              <strong>Donatie aangemaakt</strong>
              <p>{donationMessage}</p>
            </div>
          </div>
        )}

        {donationError && (
          <div className="donation-error" role="alert">
            <div className="error-icon">!</div>

            <div>
              <strong>Donatie niet verwerkt</strong>
              <p>{donationError}</p>
            </div>
          </div>
        )}
      </div>

      <div className="qr-card">
        <div className="qr-placeholder">
          <span>QR</span>
        </div>

        <strong>Scan & schenk</strong>
        <p>Scan de QR-code en voeg jouw belslagen toe.</p>
      </div>
    </section>
  );
}

export default DonationSection;
