namespace Fiertel.Api.Dtos;

public record DonationResponse(
    int Id,
    decimal Amount,
    string Status,
    string CheckoutUrl,
    DateTime CreatedAt
);