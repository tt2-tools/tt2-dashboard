using Microsoft.EntityFrameworkCore;
using worker.Entities;

namespace worker;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<RawEvent> Events => Set<RawEvent>();
    public DbSet<Clan> Clans => Set<Clan>();
    public DbSet<Player> Players => Set<Player>();
    public DbSet<MoraleTransaction> MoraleTransactions => Set<MoraleTransaction>();
    public DbSet<Raid> Raids => Set<Raid>();
    public DbSet<Attack> Attacks => Set<Attack>();
    public DbSet<PlayerCardLevel> PlayerCardLevels => Set<PlayerCardLevel>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Clan>(e =>
        {
            e.HasKey(c => c.ClanCode);
            e.Property(c => c.ClanCode).HasMaxLength(20);
            e.Property(c => c.CreatedAt).HasDefaultValueSql("NOW()");
        });

        modelBuilder.Entity<Player>(e =>
        {
            e.HasKey(p => p.PlayerCode);
            e.Property(p => p.PlayerCode).HasMaxLength(20);
            e.Property(p => p.CreatedAt).HasDefaultValueSql("NOW()");
            e.HasOne(p => p.Clan)
             .WithMany(c => c.Players)
             .HasForeignKey(p => p.ClanCode);
        });

        modelBuilder.Entity<MoraleTransaction>(e =>
        {
            e.HasKey(m => m.Id);
            e.Property(m => m.EventType).HasConversion<string>();
            e.HasOne(m => m.Clan)
             .WithMany(c => c.MoraleTransactions)
             .HasForeignKey(m => m.ClanCode);
            e.HasOne(m => m.Player)
             .WithMany(p => p.MoraleTransactions)
             .HasForeignKey(m => m.PlayerCode)
             .IsRequired(false);
        });

        modelBuilder.Entity<RawEvent>(e =>
        {
            e.HasKey(r => r.Id);
            e.Property(r => r.EventData).HasColumnType("jsonb");
        });

        modelBuilder.Entity<Raid>(e =>
        {
            e.HasKey(r => r.RaidId);
            e.Property(r => r.RaidId).ValueGeneratedNever();
            e.Property(r => r.CreatedAt).HasDefaultValueSql("NOW()");
            e.HasOne(r => r.Clan)
             .WithMany()
             .HasForeignKey(r => r.ClanCode);
        });

        modelBuilder.Entity<Attack>(e =>
        {
            e.HasKey(a => a.Id);
            e.Property(a => a.AttackLog).HasColumnType("jsonb");
            e.Property(a => a.RaidState).HasColumnType("jsonb");
            e.HasOne(a => a.Raid)
             .WithMany(r => r.Attacks)
             .HasForeignKey(a => a.RaidId);
            e.HasOne(a => a.Player)
             .WithMany()
             .HasForeignKey(a => a.PlayerCode);
        });

        modelBuilder.Entity<PlayerCardLevel>(e =>
        {
            e.HasKey(p => new { p.PlayerCode, p.CardId });
            e.HasOne(p => p.Player)
             .WithMany()
             .HasForeignKey(p => p.PlayerCode);
        });
    }
}
