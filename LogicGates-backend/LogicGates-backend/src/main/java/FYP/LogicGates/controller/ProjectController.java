package FYP.LogicGates.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import FYP.LogicGates.dto.ProjectDto;
import FYP.LogicGates.entity.Project;
import FYP.LogicGates.service.ProjectService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects(@RequestParam Long userId) {
        List<ProjectDto> projects = projectService.getAllProjects(userId);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id){
        ProjectDto ProjectDto = projectService.getProjectById(id);
        return new ResponseEntity<>(ProjectDto, HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto ProjectDto) {

        ProjectDto createdProject = projectService.createProject(ProjectDto);
        
        return new ResponseEntity<>(createdProject, HttpStatus.OK);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long id, @RequestBody ProjectDto ProjectDto) {
        ProjectDto updatedProject = projectService.updateProject(id, ProjectDto);
        
        return new ResponseEntity<>(updatedProject, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteProject(@PathVariable Long id){
            projectService.deleteProject(id);

            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
}
