namespace Fiertel.Api.Services.Payments;

public interface IPaymentProvider
{
    string Name { get; }

    Task<PaymentResult> CreatePaymentAsync(
        PaymentRequest request
    );

    Task<PaymentStatusResult> GetPaymentStatusAsync(
        string paymentReference
    );
}