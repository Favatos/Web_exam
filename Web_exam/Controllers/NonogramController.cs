using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Web_exam.Data;
using Web_exam.Models;

namespace Web_exam.Controllers;

public class NonogramController : Controller
{
    private readonly NonogramDbContext db;

    public NonogramController(NonogramDbContext db)
    {
        this.db = db;
    }

    public IActionResult Index()
    {
        return View();
    }

    public async Task<IActionResult> Play(int id)
    {
        Nonogram? nonogram = await db.Nonograms.FindAsync(id);

        if (nonogram == null) return NotFound("Nonogram not found");

        return View(nonogram);
    }
}
