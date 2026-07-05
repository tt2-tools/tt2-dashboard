namespace worker.Entities;

public class PlayerCardLevel
{
    public string PlayerCode { get; set; } = "";
    public string CardId { get; set; } = "";
    public int Level { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Player Player { get; set; } = null!;
}
