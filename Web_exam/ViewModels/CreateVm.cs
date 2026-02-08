using System.ComponentModel.DataAnnotations;

namespace Web_exam.ViewModels
{
    public class CreateVm
    {
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        [Range(5, 30)]
        public int Width { get; set; }
        [Required]
        [Range(5, 30)]
        public int Height { get; set; }
        [Required]
        public string GridJson { get; set; } = null!;
    }
}
