using Fiertel.Api.Data;
using Fiertel.Api.Models;
using Microsoft.EntityFrameworkCore;
using Fiertel.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Fiertel.Api.Services.Payments;

public class PaymentService
{
    private readonly FiertelDbContext _db;
    private readonly IPaymentProvider _paymentProvider;
    private readonly ILogger<PaymentService> _logger;
    private readonly IHubContext<CampaignHub> _campaignHub;

    public PaymentService(
        FiertelDbContext db,
        IPaymentProvider paymentProvider,
        ILogger<PaymentService> logger,
        IHubContext<CampaignHub> campaignHub
        )
    {
        _db = db;
        _paymentProvider = paymentProvider;
        _logger = logger;
        _campaignHub = campaignHub;
    }

    public async Task<bool> ProcessPaymentStatusAsync(
        string paymentReference)
    {
        var donation = await _db.Donations
            .FirstOrDefaultAsync(d =>
                d.PaymentReference == paymentReference);

        if (donation is null)
        {
            _logger.LogWarning(
                "Payment status update received for an unknown payment reference."
            );

            return false;
        }

        if (donation.Status == DonationStatus.Paid)
        {
            _logger.LogDebug(
                "Donation {DonationId} is already marked as paid.",
                donation.Id
            );

            return true;
        }

        var paymentStatus =
            await _paymentProvider.GetPaymentStatusAsync(
                paymentReference
            );

        var previousStatus = donation.Status;

        UpdateDonationStatus(
            donation,
            paymentStatus.Status
        );

        await _db.SaveChangesAsync();

        if (previousStatus != donation.Status)
        {
            _logger.LogInformation(
                "Donation {DonationId} status changed from {PreviousStatus} to {NewStatus}.",
                donation.Id,
                previousStatus,
                donation.Status
            );

            if (donation.Status == DonationStatus.Paid)
            {
                await _campaignHub.Clients.All.SendAsync(
                    "CampaignUpdated",
                    donation.CampaignId
                );
            }
        }

        return true;
    }

    private static void UpdateDonationStatus(
        Donation donation,
        PaymentStatus paymentStatus)
    {
        switch (paymentStatus)
        {
            case PaymentStatus.Paid:
                donation.Status = DonationStatus.Paid;

                if (donation.PaidAt is null)
                {
                    donation.PaidAt = DateTime.UtcNow;
                }

                break;

            case PaymentStatus.Failed:
                donation.Status = DonationStatus.Failed;
                break;

            case PaymentStatus.Cancelled:
                donation.Status = DonationStatus.Cancelled;
                break;

            case PaymentStatus.Expired:
                donation.Status = DonationStatus.Expired;
                break;

            case PaymentStatus.Pending:
                donation.Status = DonationStatus.Pending;
                break;
        }
    }
}