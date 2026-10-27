using Fiertel.Api.Data;
using Fiertel.Api.Dtos;
using Fiertel.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Fiertel.Api.Services;

public class CampaignService
{
    private readonly FiertelDbContext _db;

    public CampaignService(FiertelDbContext db)
    {
        _db = db;
    }

    public async Task<CampaignResponse?> GetCampaignAsync(int id)
    {
        var campaign = await _db.Campaigns
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (campaign is null)
        {
            return null;
        }

        var raised = await _db.Donations
            .Where(d =>
                d.CampaignId == campaign.Id &&
                d.Status == DonationStatus.Paid)
            .SumAsync(d => d.Amount);

        return new CampaignResponse(
            campaign.Id,
            campaign.Name,
            campaign.Goal,
            raised
        );
    }
}