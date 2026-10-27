namespace Fiertel.Api.Services.Payments;

public record PaymentRequest(
    decimal Amount,
    string Description,
    string RedirectUrl,
    string WebhookUrl
);