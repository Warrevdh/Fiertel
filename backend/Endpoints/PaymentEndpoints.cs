using Fiertel.Api.Services.Payments;

namespace Fiertel.Api.Endpoints;

public static class PaymentEndpoints
{
    public static IEndpointRouteBuilder MapPaymentEndpoints(
        this IEndpointRouteBuilder app)
    {
        app.MapPost(
            "/api/payments/{paymentReference}/status",
            async (
                string paymentReference,
                PaymentService paymentService) =>
            {
                var processed =
                    await paymentService.ProcessPaymentStatusAsync(
                        paymentReference
                    );

                if (!processed)
                {
                    return Results.NotFound(new
                    {
                        message = "Betaling niet gevonden."
                    });
                }

                return Results.Ok(new
                {
                    message = "Betalingsstatus verwerkt."
                });
            }
        );

        return app;
    }
}