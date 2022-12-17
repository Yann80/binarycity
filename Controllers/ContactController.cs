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

            return CreatedAtAction("GetContact", new { Id = contact.Id }, contact);
        }

        [HttpGet]
        [Route("GetContacts")]
        public IActionResult GetContacts()
        {
            IEnumerable<Contact> contacts = _context.Contacts.OrderBy(a => a.Name);
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

            if (id != contact.Id)
            {
                return BadRequest();
            }

            _context.SetModified(contact);

            try
            {
                _repo.Update(contact);
                await _repo.SaveAsync(contact);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Contacts.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
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
