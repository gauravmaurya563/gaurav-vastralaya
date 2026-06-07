using System.Collections.Generic;
using System.Linq;
using backend.Data;
using backend.Models;

namespace backend.Services
{
    public interface IAppointmentService
    {
        Appointment BookAppointment(Appointment appointment);
        IEnumerable<Appointment> GetAppointments();
    }

    public class AppointmentService : IAppointmentService
    {
        private readonly AppDbContext _context;

        public AppointmentService(AppDbContext context)
        {
            _context = context;
        }

        public Appointment BookAppointment(Appointment appointment)
        {
            appointment.Id = Guid.NewGuid();
            appointment.CreatedAt = DateTime.UtcNow;
            
            _context.Appointments.Add(appointment);
            _context.SaveChanges();
            
            return appointment;
        }

        public IEnumerable<Appointment> GetAppointments()
        {
            return _context.Appointments.OrderByDescending(a => a.CreatedAt).ToList();
        }
    }
}
