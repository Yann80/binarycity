using BinaryCity.Models;
using BinaryCity.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace BinaryCity.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IDataRepository<Contact> _repo;
        private readonly IDataContext _context;

        public ContactController(IDataContext context, IDataRepository<Contact> repo)
        {
            _repo = repo;
            _context = context;
        }

        [HttpPost]
        [Route("PostContact")]
        public async Task<IActionResult> PostContact([FromBody] Contact contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _repo.Add(contact);
            await _repo.SaveAsync(contact);

            return CreatedAtAction("GetContact", new { Id = contact.ContactId }, contact);
        }

        [HttpGet]
        [Route("GetContacts")]
        public IActionResult GetContacts()
        {
            IEnumerable<Contact> contacts = _context.Contacts.Include(c => c.Clients).OrderBy(a => a.Name);
            return Ok(contacts);
        }

        [HttpPut]
        [Route("UpdateContact/{id}")]
        public async Task<IActionResult> UpdateContact([FromRoute] int id, [FromBody] Contact contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contact.ContactId)
            {
                return BadRequest();
            }

            var objContact = _context.Contacts.Include(c => c.Clients).FirstOrDefault(t => t.ContactId == contact.ContactId);
            _context.Entry(objContact).CurrentValues.SetValues(contact);
            var clients = objContact.Clients.ToList();
            // Adds new Users
            foreach (var client in contact.Clients)
            {
                if (clients.All(i => i.ClientId != client.ClientId))
                {
                    objContact.Clients.Add(client);
                }
            }
            // Removes old Users
            foreach (var client in clients)
            {
                if (contact.Clients.FirstOrDefault(c => c.ClientId == client.ClientId) == null)
                {
                    var objClient = _context.Clients.Include(c => c.Contacts).First(co => co.ClientId == client.ClientId);
                    objContact.Clients.Remove(objClient);
                }
            }
            try
            {
                _repo.Update(objContact);
                await _repo.SaveAsync(objContact);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Contacts.Any(e => e.ContactId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(contact);
        }

        [HttpDelete]
        [Route("DeleteContact/{id}")]
        public async Task<IActionResult> DeleteContact([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }

            _repo.Delete(contact);
            await _repo.SaveAsync(contact);

            return Ok(contact);
        }
    }
}
