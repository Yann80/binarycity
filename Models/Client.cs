using System.ComponentModel.DataAnnotations;

namespace BinaryCity.Models
{
    public class Client
    {
        [Key]
        public int ClientId { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-Z0-9][a-zA-Z0-9.,'\-_ ]*[a-zA-Z0-9]$",
            ErrorMessage = "Special Characters are not allowed.")]
        public string Name { get; set; }

        [MaxLength(3)]
        public string ClientCodePrefix { get; set; }

        public string ClientCode => String.Concat(ClientCodePrefix, String.Format("{0:000}", ClientId));

        public int NumberOfContacts => Contacts != null ? Contacts.Count : 0;

        public ICollection<Contact> Contacts { get; set; }
    }
}
