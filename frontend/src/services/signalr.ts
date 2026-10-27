import * as signalR from "@microsoft/signalr";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is niet ingesteld.");
}

export function createCampaignConnection() {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${API_URL}/hubs/campaign`)
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
}
