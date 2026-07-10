using api.Endpoints;
using api.Services;
using Npgsql;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
    ConnectionMultiplexer.Connect($"{builder.Configuration["Redis:Host"]}:6379"));

builder.Services.AddSingleton(_ =>
    NpgsqlDataSource.Create(builder.Configuration["Postgres:ConnectionString"]!));

builder.Services.AddSingleton<LiveEventBroadcaster>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<LiveEventBroadcaster>());

builder.Services.AddHttpClient<RaidSeedService>(client =>
    client.BaseAddress = new Uri(builder.Configuration["SeedApi:BaseUrl"]!));

var app = builder.Build();

app.MapRaidEndpoints();
app.MapPlayerEndpoints();
app.MapSseEndpoints();
app.MapRaidSeedEndpoints();

app.Run();
