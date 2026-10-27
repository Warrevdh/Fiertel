using Fiertel.Api.Data;
using Fiertel.Api.Dtos;
using Fiertel.Api.Models;
using Fiertel.Api.Services.Payments;
using Microsoft.EntityFrameworkCore;

namespace Fiertel.Api.Services;

public class DonationService
{
    private readonly FiertelDbContext _db;
    private readonly IPaymentProvider _paymentProvider;
    private readonly IConfiguration _configuration;
    private readonly ILogger<DonationService> _logger;

    public DonationService(FiertelDbContext db, IPaymentProvider paymentProvider, IConfiguration configuration, ILogger<DonationService> logger)
    {
        _db = db;
        _paymentProvider = paymentProvider;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> CampaignExistsAsync(int campaignId)
    {
        return await _db.Campaigns
            .AnyAsync(c => c.Id == campaignId);
    }

    public async Task<DonationResponse> CreateDonationAsync(
        int campaignId,
        CreateDonationRequest request)
    {
        var donation = new Donation
        {
            CampaignId = campaignId,
            Amount = request.Amount,
            Status = DonationStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        var frontendUrl =
            _configuration["Frontend:BaseUrl"]
            ?? throw new InvalidOperationException(
                "Frontend:BaseUrl is niet ingesteld."
            );

        var backendUrl =
            _configuration["Backend:BaseUrl"]
            ?? throw new InvalidOperationException(
                "Backend:BaseUrl is niet ingesteld."
            );

        _db.Donations.Add(donation);
        await _db.SaveChangesAsync();
        
        _logger.LogInformation(
            "Donation {DonationId} created for campaign {CampaignId} with amount {Amount}. Status: {Status}",
            donation.Id,
            donation.CampaignId,
            donation.Amount,
            donation.Status
        );

        try
        {
            var payment =
                await _paymentProvider.CreatePaymentAsync(
                    new PaymentRequest(
                        donation.Amount,
                        $"Donatie Fiertel - {donation.Id}",
                        $"{frontendUrl}/donation/complete",
                        $"{backendUrl}/api/payments/webhook"
                    )
                );

            donation.PaymentProvider = _paymentProvider.Name;
            donation.PaymentReference = payment.PaymentReference;

            await _db.SaveChangesAsync();

            _logger.LogInformation(
                "Payment created for donation {DonationId} using provider {PaymentProvider}.",
                donation.Id,
                donation.PaymentProvider
            );

            return new DonationResponse(
                donation.Id,
                donation.Amount,
                donation.Status.ToString(),
                payment.CheckoutUrl,
                donation.CreatedAt
            );
        }
        catch(Exception ex)
        {
            donation.Status = DonationStatus.Failed;

            await _db.SaveChangesAsync();

                _logger.LogError(
                    ex,
                    "Failed to create payment for donation {DonationId}.",
                    donation.Id
                );

            throw;
        }
    }
}