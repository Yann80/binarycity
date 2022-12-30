using Microsoft.EntityFrameworkCore;

namespace BinaryCity.Repository
{
    public interface IDataRepository<T> where T : class
    {
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        DbSet<T> GetEntities();
        Task<T> SaveAsync(T entity);
    }
}
