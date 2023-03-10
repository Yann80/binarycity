using BinaryCity.Models;
using BinaryCity.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BinaryCity.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController: ControllerBase
    {
        private readonly IDataRepository<Client> _repo;
        private readonly IDataContext _context;

        public ClientController(IDataContext context, IDataRepository<Client> repo)
        {
            _repo = repo;
            _context = context;
        }

        [HttpPost]
        [Route("PostClient")]
        public async Task<IActionResult> PostClient([FromBody] Client client)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            client.ClientCodePrefix = GetClientAlphaCharacters(client.Name);

            _repo.Add(client);
            await _repo.SaveAsync(client);

            return CreatedAtAction("GetClient", new { ClientCode = client.ClientCode }, client);
        }

        [HttpGet]
        [Route("GetClients")]
        public IActionResult GetClients()
        {
            var clients = _repo.GetEntities().Include(c => c.Contacts).OrderBy(a => a.Name);
            return Ok(clients);
        }

        [HttpPut]
        [Route("UpdateClient/{id}")]
        public async Task<IActionResult> UpdateClient([FromRoute] int id, [FromBody] Client client)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != client.ClientId)
            {
                return BadRequest();
            }

            client.ClientCodePrefix = GetClientAlphaCharacters(client.Name);
            var objClient = _repo.GetEntities().Include(c => c.Contacts).SingleOrDefault(cl => cl.ClientId == client.ClientId);

            if (objClient == null)
                return NotFound();

            _context.Entry(objClient).CurrentValues.SetValues(client);
            var contacts = objClient.Contacts.ToList();

            // Adds new Users
            foreach (var contact in client.Contacts)
            {
                if (contacts.All(i => i.ContactId != contact.ContactId))
                {
                    objClient.Contacts.Add(contact);
                }
            }
            // Removes old Users
            foreach (var contact in contacts)
            {
                if (client.Contacts.FirstOrDefault(c => c.ContactId == contact.ContactId) == null)
                {
                    objClient.Contacts.Remove(contact);
                }
            }
            try
            {
                _repo.Update(objClient);
                await _repo.SaveAsync(objClient);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Clients.Any(e => e.ClientId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(client);
        }

        [HttpDelete]
        [Route("DeleteClient/{id}")]
        public async Task<IActionResult> DeleteClient([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            _repo.Delete(client);
            await _repo.SaveAsync(client);

            return Ok(client);
        }

        private string GetClientAlphaCharacters(string clientName)
        {
            if (!clientName.Any(a => char.IsWhiteSpace(a)))
            {
                string name = string.Empty;
                switch (clientName.Length)
                {
                    case int x when x == 1:
                        name = clientName[..1].ToUpper();
                        return name += "AB";
                    case int x when x == 2:
                        name = clientName[..2].ToUpper();
                        return name += "A";
                    default:
                        return clientName[..3].ToUpper();
                }
            }
            else
            {
                return new string(clientName.Split(' ').Select(a => a[0]).ToArray()).ToUpper();
            }
        }
    }
}
