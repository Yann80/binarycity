using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BinaryCity.Models
{
    public class Contact
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get;set; }

        [Required]
        public string Surname { get; set; }

        [Required]
        public string Email { get;set; }

        public  string FullName => string.Concat(this.Surname, " ", this.Name);

        public int NumberOfClients => Clients.Count;

        public virtual ICollection<Client> Clients { get; set; }
    }
}
