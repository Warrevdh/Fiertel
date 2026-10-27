namespace Fiertel.Api.Dtos;

public record CampaignResponse(
    int Id,
    string Name,
    decimal Goal,
    decimal Raised
);