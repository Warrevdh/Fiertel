namespace Fiertel.Api.Models;

public class Campaign
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public decimal Goal { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<Donation> Donations { get; set; } = [];
}