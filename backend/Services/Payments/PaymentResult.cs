namespace Fiertel.Api.Services.Payments;

public record PaymentResult(
    string PaymentReference,
    string CheckoutUrl
);