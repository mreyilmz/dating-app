
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<AppUser> Users { get; set; }
        // Do we need to add another DB set for the "photos"? Well, we could, but if we think about what we're actually going to be doing with these photos, then when a user adds a photo, it's going to be added to that specific user. A user is not going to be able to add photos for other users. And at no point do we want a photo that's not associated with a user. We also don't need to query the photos directly either. We're not going to need to go to the database and say, Hey, can I get this one very specific photo for a random user? So based on that, then we don't actually need to create a DB set for the photos because we're not going to be using that entity to query our database directly on it. It's always going to be done via the user entity.
        public DbSet<UserLike> Likes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserLike>()
                .HasKey(k => new { k.SourceUserId, k.TargetUserId });

            builder.Entity<UserLike>()
                .HasOne(s => s.SourceUser)
                .WithMany(l => l.LikedUsers)
                .HasForeignKey(s => s.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserLike>()
                .HasOne(s => s.TargetUser)
                .WithMany(l => l.LikedByUsers)
                .HasForeignKey(s => s.TargetUserId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}