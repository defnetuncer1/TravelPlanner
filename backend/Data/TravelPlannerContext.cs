using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class TravelPlannerContext : DbContext
    {
        public TravelPlannerContext(DbContextOptions<TravelPlannerContext>options):base(options){}
        public DbSet<User> Users{get;set;}
        public DbSet<Place> Places{get;set;}
        public DbSet<Plan> Plans{get;set;}
        public DbSet<PlanItem>PlanItems{get;set;}
        public DbSet<Review> Reviews{get;set;}
    }
}