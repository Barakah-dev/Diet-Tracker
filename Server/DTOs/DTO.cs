using System;

namespace Server.DTOs
{
    public class DTO
    {
        
    }
    
    public record TrackerDTO(string meal, string classMajor, string classMinor, string expectedCalories);
    public record UpdateTrackerDTO(string id, string meal, string classMajor, string classMinor, string expectedCalories);
    public class DietTracker
    {
        public Guid ID { get; set; }
        public String Meal { get; set; }
        public String ClassMajor { get; set; }
        public String ClassMinor { get; set; }
        public String ExpectedCalories { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
