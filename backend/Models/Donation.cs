namespace Fiertel.Api.Models;

public class Donation
{
    public int Id { get; set; }

    public decimal Amount { get; set; }

    public DonationStatus Status { get; set; }

    public string? PaymentProvider { get; set; }

    public string? PaymentReference { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? PaidAt { get; set; }

    public int CampaignId { get; set; }

    public Campaign Campaign { get; set; } = null!;
}