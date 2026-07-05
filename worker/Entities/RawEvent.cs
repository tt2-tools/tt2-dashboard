using System.Text.Json;

namespace worker.Entities;

public class RawEvent
{
    public long Id { get; set; }
    public string EventName { get; set; } = "";
    public JsonDocument EventData { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
