namespace worker.Entities;

public class Clan
{
    public string ClanCode { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Player> Players { get; set; } = [];
    public ICollection<MoraleTransaction> MoraleTransactions { get; set; } = [];
}
