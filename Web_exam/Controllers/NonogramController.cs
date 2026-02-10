using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_exam.Data;
using Web_exam.Models;
using Web_exam.ViewModels;

namespace Web_exam.Controllers;

public class NonogramController : Controller
{
    private readonly NonogramDbContext db;

    public NonogramController(NonogramDbContext db)
    {
        this.db = db;
    }

    public async Task<IActionResult> Play(int id)
    {
        Nonogram? nonogram = await db.Nonograms.FindAsync(id);

        if (nonogram == null) return View("There is no such nonogram... Yet.");

        return View(nonogram);
    }

    public async Task<IActionResult> Index()
    {
        List<Nonogram> nonograms = await db.Nonograms.ToListAsync();
        if (!nonograms.Any()) return NotFound("Nonograms not found");

        LevelGroup easy = new()
        {
            Title = "Easy",
            Levels = [.. nonograms.Where(n => n.Difficulty.ToLower() == "easy")]
        };

        LevelGroup mediun = new()
        {
            Title = "Medium",
            Levels = [.. nonograms.Where(n => n.Difficulty.ToLower() == "medium")]
        };

        LevelGroup hard = new()
        {
            Title = "Hard",
            Levels = [.. nonograms.Where(n => n.Difficulty.ToLower() == "hard")]
        };

        LevelsVm vm = new();
        vm.LevelGroups.Add(easy);
        vm.LevelGroups.Add(mediun);
        vm.LevelGroups.Add(hard);

        return View(vm);
    }

    public IActionResult Create() => View(new CreateVm());

    [HttpPost]
    public async Task<IActionResult> Create(CreateVm vm)
    {
        if (!ModelState.IsValid) return View(vm);
        if (!vm.GridJson.Contains('1'))
        {
            ModelState.AddModelError(string.Empty, "Grid is empty");
            return View(vm);
        }

        string difficulty = "";
        int maxSide = Math.Max(vm.Width, vm.Height);

        if (maxSide <= 5) difficulty = "easy";
        else if (maxSide <= 10) difficulty = "medium";
        else difficulty = "hard";

        Nonogram nonogram = new()
        {
            Name = vm.Name,
            Difficulty = difficulty,
            SolutionJson = vm.GridJson
        };

        await db.Nonograms.AddAsync(nonogram);
        await db.SaveChangesAsync();

        return RedirectToAction(nameof(Index));
    }
}
