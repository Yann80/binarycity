using Microsoft.EntityFrameworkCore;

namespace BinaryCity.Models
{
    public class DataContext : DbContext, IDataContext
    {
        public DbSet<Client> Clients { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public void SetModified(object entity)
        {
            Entry(entity).State = EntityState.Modified;
        }
    }
}