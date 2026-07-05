namespace worker.Entities;

public enum MoraleEventType { Contribution, Consumption }

public class MoraleTransaction
{
    public long Id { get; set; }
    public string ClanCode { get; set; } = "";
    public string? PlayerCode { get; set; }
    public int Amount { get; set; }
    public int TotalAmount { get; set; }
    public MoraleEventType EventType { get; set; }
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;

    public Clan Clan { get; set; } = null!;
    public Player? Player { get; set; }
}
