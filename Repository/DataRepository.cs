using BinaryCity.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BinaryCity.Repository
{
    public class DataRepository<T>: IDataRepository<T> where T : class
    {
        private readonly DataContext _context;

        public DataRepository(DataContext context)
        {
            _context = context;
        }

        public void Add(T entity)
        {
            _context.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }

        public DbSet<T> GetEntities()
        {
            return _context.Set<T>();
        }

        public async Task<T> SaveAsync(T entity)
        {
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<T> FindAsync(T entity)
        {
            await _context.Set<T>().FindAsync();
            return entity;
        }
    }
}
