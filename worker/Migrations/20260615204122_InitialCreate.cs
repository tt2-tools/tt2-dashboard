using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace worker.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "clans",
                columns: table => new
                {
                    clan_code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_clans", x => x.clan_code);
                });

            migrationBuilder.CreateTable(
                name: "events",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    event_name = table.Column<string>(type: "text", nullable: false),
                    event_data = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_events", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "players",
                columns: table => new
                {
                    player_code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    clan_code = table.Column<string>(type: "character varying(20)", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_players", x => x.player_code);
                    table.ForeignKey(
                        name: "fk_players_clans_clan_code",
                        column: x => x.clan_code,
                        principalTable: "clans",
                        principalColumn: "clan_code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "raids",
                columns: table => new
                {
                    raid_id = table.Column<int>(type: "integer", nullable: false),
                    clan_code = table.Column<string>(type: "character varying(20)", nullable: false),
                    enemy_id = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_raids", x => x.raid_id);
                    table.ForeignKey(
                        name: "fk_raids_clans_clan_code",
                        column: x => x.clan_code,
                        principalTable: "clans",
                        principalColumn: "clan_code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "morale_transactions",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    clan_code = table.Column<string>(type: "character varying(20)", nullable: false),
                    player_code = table.Column<string>(type: "character varying(20)", nullable: true),
                    amount = table.Column<int>(type: "integer", nullable: false),
                    total_amount = table.Column<int>(type: "integer", nullable: false),
                    event_type = table.Column<string>(type: "text", nullable: false),
                    occurred_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_morale_transactions", x => x.id);
                    table.ForeignKey(
                        name: "fk_morale_transactions_clans_clan_code",
                        column: x => x.clan_code,
                        principalTable: "clans",
                        principalColumn: "clan_code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_morale_transactions_players_player_code",
                        column: x => x.player_code,
                        principalTable: "players",
                        principalColumn: "player_code");
                });

            migrationBuilder.CreateTable(
                name: "player_card_levels",
                columns: table => new
                {
                    player_code = table.Column<string>(type: "character varying(20)", nullable: false),
                    card_id = table.Column<string>(type: "text", nullable: false),
                    level = table.Column<int>(type: "integer", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player_card_levels", x => new { x.player_code, x.card_id });
                    table.ForeignKey(
                        name: "fk_player_card_levels_players_player_code",
                        column: x => x.player_code,
                        principalTable: "players",
                        principalColumn: "player_code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "attacks",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    raid_id = table.Column<int>(type: "integer", nullable: false),
                    player_code = table.Column<string>(type: "character varying(20)", nullable: false),
                    cycle = table.Column<int>(type: "integer", nullable: false),
                    attacks_remaining = table.Column<int>(type: "integer", nullable: false),
                    total_damage = table.Column<long>(type: "bigint", nullable: false),
                    attack_log = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    raid_state = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    attack_datetime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_attacks", x => x.id);
                    table.ForeignKey(
                        name: "fk_attacks_players_player_code",
                        column: x => x.player_code,
                        principalTable: "players",
                        principalColumn: "player_code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_attacks_raids_raid_id",
                        column: x => x.raid_id,
                        principalTable: "raids",
                        principalColumn: "raid_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_attacks_player_code",
                table: "attacks",
                column: "player_code");

            migrationBuilder.CreateIndex(
                name: "ix_attacks_raid_id",
                table: "attacks",
                column: "raid_id");

            migrationBuilder.CreateIndex(
                name: "ix_morale_transactions_clan_code",
                table: "morale_transactions",
                column: "clan_code");

            migrationBuilder.CreateIndex(
                name: "ix_morale_transactions_player_code",
                table: "morale_transactions",
                column: "player_code");

            migrationBuilder.CreateIndex(
                name: "ix_players_clan_code",
                table: "players",
                column: "clan_code");

            migrationBuilder.CreateIndex(
                name: "ix_raids_clan_code",
                table: "raids",
                column: "clan_code");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "attacks");

            migrationBuilder.DropTable(
                name: "events");

            migrationBuilder.DropTable(
                name: "morale_transactions");

            migrationBuilder.DropTable(
                name: "player_card_levels");

            migrationBuilder.DropTable(
                name: "raids");

            migrationBuilder.DropTable(
                name: "players");

            migrationBuilder.DropTable(
                name: "clans");
        }
    }
}
