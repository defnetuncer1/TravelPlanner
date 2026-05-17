using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

builder.Services.AddDbContext<TravelPlannerContext>(options => options.UseSqlite("Data Source=travelplanner.db"));

var app = builder.Build();

using(var scope = app.Services.CreateScope())
{
    var context=scope.ServiceProvider.GetRequiredService<TravelPlannerContext>();
    context.Database.EnsureCreated();
    if (!context.Places.Any())
    {
        context.Places.AddRange(new Place
        {
            PlaceName="Sky Garden",
            City="London",
            Country="United Kingdom",
            Category="Attraction",
            Description="A popular viewpoint and indoor garden with city views.",
            EstimatedCost=0,
            Currency="GBP",
            Rating=4.6,
            ImagePath="../images/london.jpeg"
        },
        new Place
        {
            PlaceName="Louvre Museum",
            City="Paris",
            Country="France",
            Category="Museum",
            Description="A world-famous museum for art, history and culture lovers.",
            EstimatedCost= 17,
            Currency="EUR",
            Rating=4.8,
            ImagePath="../images/louvre.jpeg"
        },
        new Place
        {
            PlaceName="Shibuya Crossing",
            City="Tokyo",
            Country="Japan",
            Category="Attraction",
            Description="One of Tokyo's most iconic and energetic city spots.",
            EstimatedCost=0,
            Currency="JPY",
            Rating=4.7,
            ImagePath="../images/tokyo.jpeg"
        }
        );
        context.SaveChanges();
    }
}


if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.MapGet("/api/places", async(TravelPlannerContext context) =>
{
    return await context.Places.ToListAsync();
});


app.MapPost("/api/plans", async([FromBody]Plan plan, TravelPlannerContext context) =>
{
    context.Plans.Add(plan);
    await context.SaveChangesAsync();
    return Results.Ok(plan);
});

app.MapDelete("/api/plans/{id}", async(int id, TravelPlannerContext context) =>
{
    var plan = await context.Plans.FindAsync(id);
    if (plan == null)
    {
        return Results.NotFound();
    }
    context.Plans.Remove(plan);
    await context.SaveChangesAsync();
    return Results.Ok();
});
app.Run();
