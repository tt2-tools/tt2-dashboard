namespace worker.Entities;

public class Player
{
    public string PlayerCode { get; set; } = "";
    public string ClanCode { get; set; } = "";
    public string? Name { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Clan Clan { get; set; } = null!;
    public ICollection<MoraleTransaction> MoraleTransactions { get; set; } = [];
}
