using Fiertel.Api.Services;

namespace Fiertel.Api.Endpoints;

public static class CampaignEndpoints
{
    public static IEndpointRouteBuilder MapCampaignEndpoints(
        this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/campaigns/{campaignId:int}", async (
            int campaignId,
            CampaignService campaignService) =>
        {
            var campaign =
                await campaignService.GetCampaignAsync(campaignId);

            if (campaign is null)
            {
                return Results.NotFound(new
                {
                    message = "Campagne niet gevonden."
                });
            }

            return Results.Ok(campaign);
        });

        return app;
    }
}