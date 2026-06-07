using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpPost]
        public ActionResult<Appointment> Book([FromBody] Appointment appointment)
        {
            if (appointment == null)
            {
                return BadRequest(new { message = "Invalid appointment details." });
            }

            if (string.IsNullOrWhiteSpace(appointment.Name) || string.IsNullOrWhiteSpace(appointment.Phone))
            {
                return BadRequest(new { message = "Name and Phone Number are required." });
            }

            var created = _appointmentService.BookAppointment(appointment);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpGet]
        public ActionResult<IEnumerable<Appointment>> Get()
        {
            return Ok(_appointmentService.GetAppointments());
        }
    }
}
