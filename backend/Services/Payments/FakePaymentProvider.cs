namespace Fiertel.Api.Services.Payments;

public class FakePaymentProvider : IPaymentProvider
{
    public string Name => "Fake";

    public Task<PaymentResult> CreatePaymentAsync(
        PaymentRequest request)
    {
        var reference = Guid.NewGuid().ToString();

        var checkoutUrl =
            $"http://localhost:5173/demo-payment/{reference}";

        return Task.FromResult(
            new PaymentResult(
                reference,
                checkoutUrl
            )
        );
    }

    public Task<PaymentStatusResult> GetPaymentStatusAsync(
        string paymentReference)
    {
        return Task.FromResult(
            new PaymentStatusResult(
                PaymentStatus.Paid
            )
        );
    }
}