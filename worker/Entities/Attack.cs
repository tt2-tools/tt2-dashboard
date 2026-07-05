using System.Text.Json;

namespace worker.Entities;

public class Attack
{
    public long Id { get; set; }
    public int RaidId { get; set; }
    public string PlayerCode { get; set; } = "";
    public int Cycle { get; set; }
    public int AttacksRemaining { get; set; }
    public long TotalDamage { get; set; }
    public JsonDocument AttackLog { get; set; } = null!;
    public JsonDocument RaidState { get; set; } = null!;
    public DateTime AttackDatetime { get; set; }

    public Raid Raid { get; set; } = null!;
    public Player Player { get; set; } = null!;
}
