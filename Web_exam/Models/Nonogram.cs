using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
namespace Web_exam.Models;

public class Nonogram
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Difficulty { get; set; } = null!;
    public string SolutionJson { get; set; } = null!;

    [NotMapped]
    public int[][] Solution
    {
        get => JsonSerializer.Deserialize<int[][]>(SolutionJson)!;
        set => SolutionJson = JsonSerializer.Serialize(value);
    }
    [NotMapped]
    public int Height => Solution.Length;
    [NotMapped]
    public int Width => Solution[0].Length;
    [NotMapped]
    public List<List<int>> RowHints => GetRowHints(Solution);
    [NotMapped]
    public List<List<int>> ColHints => GetColumnHints(Solution);
    [NotMapped]
    public int MaxRowHintsCount => RowHints.Max(r => r.Count);
    [NotMapped]
    public int MaxColHintsCount => ColHints.Max(c => c.Count);

    public static List<int> GetLineHints(int[] line)
    {
        var result = new List<int>();
        int currentCount = 0;

        for (int i = 0; i < line.Length; i++)
        {
            if (line[i] == 1)
            {
                currentCount++;
            }
            else
            {
                if (currentCount > 0)
                {
                    result.Add(currentCount);
                    currentCount = 0;
                }
            }
        }

        if (currentCount > 0)
        {
            result.Add(currentCount);
        }

        return result;
    }

    public static List<List<int>> GetRowHints(int[][] solution)
    {
        int height = solution.Length;
        var rowHints = new List<List<int>>(height);

        for (int row = 0; row < height; row++)
        {
            var line = solution[row];
            rowHints.Add(GetLineHints(line));
        }

        return rowHints;
    }

    public static List<List<int>> GetColumnHints(int[][] solution)
    {
        int height = solution.Length;
        int width = solution[0].Length;

        var colHints = new List<List<int>>(width);

        for (int col = 0; col < width; col++)
        {
            var line = new int[height];
            for (int row = 0; row < height; row++)
            {
                line[row] = solution[row][col];
            }

            colHints.Add(GetLineHints(line));
        }

        return colHints;
    }
}

