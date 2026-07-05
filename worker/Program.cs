using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using worker;
using worker.Handlers;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = Host.CreateApplicationBuilder(args);

builder.Services.Configure<RedisSettings>(builder.Configuration.GetSection("Redis"));

builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
    ConnectionMultiplexer.Connect($"{builder.Configuration["Redis:Host"]}:6379"));

builder.Services.AddDbContextFactory<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration["Postgres:ConnectionString"])
           .UseSnakeCaseNamingConvention());

// Handlers — ajouter les nouveaux ici
builder.Services.AddSingleton<DefaultEventHandler>();
builder.Services.AddSingleton<IEventHandler, DefaultEventHandler>(sp => sp.GetRequiredService<DefaultEventHandler>());
builder.Services.AddSingleton<IEventHandler, MoraleHandler>();
builder.Services.AddSingleton<IEventHandler, StartAttackHandler>();
builder.Services.AddSingleton<IEventHandler, AttackHandler>();

builder.Services.AddSingleton<EventDispatcher>();
builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
