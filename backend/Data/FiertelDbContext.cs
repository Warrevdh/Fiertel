namespace Fiertel.Api.Data;

using Fiertel.Api.Models;
using Microsoft.EntityFrameworkCore;

public class FiertelDbContext : DbContext
{
    public FiertelDbContext(DbContextOptions<FiertelDbContext> options)
        : base(options)
    {
    }

    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<Donation> Donations => Set<Donation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Campaign>().HasData(
            new Campaign
            {
                Id = 1,
                Name = "Fiertelommegang Ronse",
                Goal = 65000m,
                CreatedAt = new DateTime(
                    2026, 10, 10,
                    0, 0, 0,
                    DateTimeKind.Utc
                )
            }
        );

        modelBuilder.Entity<Donation>()
            .HasIndex(d => d.PaymentReference)
            .IsUnique();
    }
}