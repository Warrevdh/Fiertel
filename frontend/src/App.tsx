import { useEffect, useState } from "react";
import { createDonation, getCampaign } from "./services/api";
import Hero from "./components/Hero";
import RouteProgress from "./components/RouteProgress";
import DonationSection from "./components/DonationSection";
import { createCampaignConnection } from "./services/signalr";
import "./App.css";

const CAMPAIGN_ID = Number(import.meta.env.VITE_CAMPAIGN_ID);
const DONATION_OPTIONS = [5, 10, 25, 50];

if (!Number.isInteger(CAMPAIGN_ID) || CAMPAIGN_ID <= 0) {
  throw new Error("VITE_CAMPAIGN_ID is niet correct ingesteld.");
}

function App() {
  const [raised, setRaised] = useState(0);
  const [goal, setGoal] = useState(65000);

  const [donationAmount, setDonationAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");

  const [donationMessage, setDonationMessage] = useState<string | null>(null);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [isDonating, setIsDonating] = useState(false);

  const [isLoadingCampaign, setIsLoadingCampaign] = useState(true);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  const bells = raised;

  const progress = Math.min(raised / goal, 1);
  const percentage = progress * 100;

  const goalReached = raised >= goal;
  const remaining = Math.max(goal - raised, 0);

  const loadCampaign = async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) {
        setCampaignError(null);
      }

      const campaign = await getCampaign(CAMPAIGN_ID);

      setRaised(campaign.raised);
      setGoal(campaign.goal);
    } catch (error) {
      console.error("Campagne kon niet geladen worden:", error);

      if (!isBackgroundRefresh) {
        setCampaignError(
          "De actuele stand van de campagne kon niet geladen worden.",
        );
      }
    } finally {
      if (!isBackgroundRefresh) {
        setIsLoadingCampaign(false);
      }
    }
  };

  const selectDonationAmount = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);

    const amount = Number(value);

    if (amount > 0) {
      setDonationAmount(amount);
    }
  };

  const handleDonation = async () => {
    if (donationAmount <= 0 || isDonating) {
      return;
    }

    setIsDonating(true);
    setDonationError(null);
    setDonationMessage(null);

    try {
      await createDonation(CAMPAIGN_ID, donationAmount);

      setDonationMessage(
        "De donatie werd aangemaakt en wacht op betalingsbevestiging.",
      );
    } catch (error) {
      console.error("Donatie kon niet gestart worden:", error);

      console.error("Donatie kon niet gestart worden:", error);

      if (error instanceof Error) {
        setDonationError(error.message);
      } else {
        setDonationError(
          "Er ging iets mis bij het starten van je donatie. Probeer het opnieuw.",
        );
      }
    } finally {
      setIsDonating(false);
    }
  };

  useEffect(() => {
    let disposed = false;

    loadCampaign();

    const connection = createCampaignConnection();

    const handleCampaignUpdated = (campaignId: number) => {
      if (campaignId === CAMPAIGN_ID) {
        loadCampaign(true);
      }
    };

    connection.on("CampaignUpdated", handleCampaignUpdated);

    const startConnection = async () => {
      try {
        await connection.start();

        if (!disposed) {
          console.log("SignalR verbonden.");
        }
      } catch (error) {
        if (!disposed) {
          console.error("SignalR verbinding mislukt:", error);
        }
      }
    };

    startConnection();

    return () => {
      disposed = true;

      connection.off("CampaignUpdated", handleCampaignUpdated);

      connection.stop();
    };
  }, []);

  if (isLoadingCampaign) {
    return (
      <main className="page">
        <section className="campaign-loading">
          <div className="loading-spinner" />
          <p>De Fiertel wordt geladen...</p>
        </section>
      </main>
    );
  }

  if (campaignError) {
    return (
      <main className="page">
        <section className="campaign-error">
          <p className="eyebrow">Fiertelommegang Ronse</p>

          <h1>Even geduld</h1>

          <p>{campaignError}</p>

          <button
            type="button"
            onClick={() => {
              setIsLoadingCampaign(true);
              loadCampaign();
            }}>
            Opnieuw proberen
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <Hero bells={bells} percentage={percentage} />

      <RouteProgress
        raised={raised}
        goal={goal}
        bells={bells}
        goalReached={goalReached}
        remaining={remaining}
      />

      <DonationSection
        donationAmount={donationAmount}
        customAmount={customAmount}
        donationOptions={DONATION_OPTIONS}
        isDonating={isDonating}
        donationMessage={donationMessage}
        donationError={donationError}
        onSelectAmount={selectDonationAmount}
        onCustomAmountChange={handleCustomAmount}
        onDonate={handleDonation}
      />
    </main>
  );
}

export default App;
