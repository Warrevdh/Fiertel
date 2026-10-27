using Fiertel.Api.Dtos;
using Fiertel.Api.Services;

namespace Fiertel.Api.Endpoints;

public static class DonationEndpoints
{
    public static IEndpointRouteBuilder MapDonationEndpoints(
        this IEndpointRouteBuilder app)
    {
        app.MapPost(
            "/api/campaigns/{campaignId:int}/donations",
            async (
                int campaignId,
                CreateDonationRequest request,
                DonationService donationService) =>
            {
                if (request.Amount <= 0)
                {
                    return Results.BadRequest(new
                    {
                        message =
                            "Het donatiebedrag moet groter zijn dan €0."
                    });
                }

                var campaignExists =
                    await donationService.CampaignExistsAsync(
                        campaignId
                    );

                if (!campaignExists)
                {
                    return Results.NotFound(new
                    {
                        message = "Campagne niet gevonden."
                    });
                }

                var donation =
                    await donationService.CreateDonationAsync(
                        campaignId,
                        request
                    );

                return Results.Created(
                    $"/api/campaigns/{campaignId}/donations/{donation.Id}",
                    donation
                );
            }
        ).RequireRateLimiting("donation");

        return app;
    }
}