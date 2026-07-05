namespace worker.Entities;

public class Raid
{
    public int RaidId { get; set; }
    public string ClanCode { get; set; } = "";
    public string EnemyId { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Clan Clan { get; set; } = null!;
    public ICollection<Attack> Attacks { get; set; } = [];
}
