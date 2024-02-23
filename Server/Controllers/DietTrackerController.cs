using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.DTOs;

namespace Server.Controllers;

[ApiController]
[Route("[controller]")]
public class DietTrackerController : ControllerBase
{
    private readonly ILogger<DietTrackerController> _logger;
    private static IList<DietTracker> _diets = new List<DietTracker>();

    public DietTrackerController(ILogger<DietTrackerController> logger)
    {
        _logger = logger;
    }

    [HttpPost("create")]
   public IActionResult CreateDiet([FromBody] TrackerDTO trackerDTO) 
   {
        var newDiet = new DietTracker{
            ID = Guid.NewGuid(),
            Meal = trackerDTO.meal,
            ClassMajor = trackerDTO.classMajor,
            ClassMinor = trackerDTO.classMinor,
            ExpectedCalories = trackerDTO.expectedCalories,
            CreatedAt = DateTime.UtcNow
        };
        _diets.Add(newDiet);
        return Ok(newDiet);
   }  

    [HttpGet("list")]
    public IActionResult ListDiets()
    {
        return Ok(_diets);
    }

    [HttpGet("list_by_id/{id}")]
    public IActionResult ListDiet(string id)
    {
        var diet = FindDiet(id);
        if (diet is null)
        {
            return NotFound("$Meal with id {id} not found");
        }
        return Ok(diet);
    }

    private DietTracker FindDiet(string id)
    {
        var diet = _diets.FirstOrDefault(d => d.ID.ToString() == id);
        return diet;
    }

    [HttpPut("Update")]
    public IActionResult UpdateDiet([FromBody] UpdateTrackerDTO updateTrackerDTO)
    {
        var updatedDiet = UpdateDietTracker(updateTrackerDTO);
        if (updatedDiet is null)
        {
            NotFound($"Meal with id {updateTrackerDTO.id} not found");
        }
        return Ok();
    }

    private DietTracker UpdateDietTracker(UpdateTrackerDTO updateTrackerDTO)
    {
        var diet = _diets.FirstOrDefault(d => d.ID.ToString() == updateTrackerDTO.id);
        
        if (diet is not null)
        {
            diet.Meal = updateTrackerDTO.meal;
            diet.ClassMajor = updateTrackerDTO.classMajor;
            diet.ClassMinor = updateTrackerDTO.classMinor;
            diet.ExpectedCalories = updateTrackerDTO.expectedCalories;
            diet.UpdatedAt = DateTime.UtcNow;
        } 

        return diet;
    }

    
    [HttpDelete("Delete/{id}")]
    public IActionResult DeleteDiet(string id)
    {
        var deletedDiet = DeleteDietItem(id);
        if (!deletedDiet)
        {
            return NotFound($"Meal with id {id} not found");
        }
        
        return Ok($"Meal with id {id} has been deleted");
    }

    private bool DeleteDietItem(string id)
    {
        var dietToDelete = _diets.FirstOrDefault(d => d.ID.ToString() == id);
        if (dietToDelete is not null)
        {
            _diets.Remove(dietToDelete);
            return true;
        }
        return false;
    }
}
