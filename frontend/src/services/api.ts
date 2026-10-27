import type { Campaign } from "../types/Campaign";
import type { Donation } from "../types/Donation";

const API_URL = import.meta.env.VITE_API_URL;

export async function getCampaign(campaignId: number): Promise<Campaign> {
  const response = await fetch(`${API_URL}/api/campaigns/${campaignId}`);

  if (!response.ok) {
    throw new Error("Kon campagne niet ophalen.");
  }

  return response.json();
}

export async function createDonation(
  campaignId: number,
  amount: number,
): Promise<Donation> {
  const response = await fetch(
    `${API_URL}/api/campaigns/${campaignId}/donations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
      }),
    },
  );

  if (response.status === 429) {
    throw new Error(
      "Je hebt te veel donatiepogingen gedaan. Probeer het over enkele ogenblikken opnieuw.",
    );
  }

  if (!response.ok) {
    throw new Error("De donatie kon niet gestart worden.");
  }

  return response.json();
}
