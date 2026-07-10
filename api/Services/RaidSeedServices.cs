using System.Net.Http.Headers;

namespace api.Services;

public class RaidSeedService
{
    private readonly HttpClient _http;

    public RaidSeedService(HttpClient http, IConfiguration config)
    {
        _http = http;
        var token = config["SeedApi:Token"]
            ?? throw new InvalidOperationException("SeedApi:Token must be configured.");
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    public Task<HttpResponseMessage> GetMetaAsync(CancellationToken ct) =>
        _http.GetAsync("/seed/meta", ct);

    public Task<HttpResponseMessage> GetRaidsAsync(CancellationToken ct) =>
        _http.GetAsync("/seed/raids", ct);

    public Task<HttpResponseMessage> GetRaidAsync(int tier, int level, CancellationToken ct) =>
        _http.GetAsync($"/seed/raids/{tier}/{level}", ct);
}
