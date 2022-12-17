using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Diagnostics.CodeAnalysis;

namespace BinaryCity.Models
{
    public interface IDataContext
    {
        EntityEntry<TEntity> Entry<TEntity>([NotNullAttribute] TEntity entity) where TEntity : class;

        public DbSet<Client> Clients { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        void SetModified(object entity);
    }
}