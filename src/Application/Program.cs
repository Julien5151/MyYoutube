using Application.Extensions;
using Domain.Extensions.Services;
using Infrastructure.Database;
using Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configuration options
builder.Services.AddConfigurationOptions(builder.Configuration);
// Authentication
builder.Services.AddJwtAuthentication(builder.Configuration);
// Controllers
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Database
builder.Services.AddDbContext<MyYoutubeContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("MyYoutubeApiDatabase")));
// Core services
builder.Services.AddCoreServices();
// Data services
builder.Services.AddDataServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();