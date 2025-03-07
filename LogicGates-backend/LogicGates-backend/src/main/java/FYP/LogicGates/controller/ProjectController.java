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

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long projectId){
        ProjectDto projectDto = projectService.getProjectById(projectId);
        return new ResponseEntity<>(projectDto, HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto projectDto) {

        ProjectDto createdProject = projectService.createProject(projectDto);
        
        return new ResponseEntity<>(createdProject, HttpStatus.OK);
    }
    
    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long projectId, @RequestBody ProjectDto projectDto) {
        ProjectDto updatedProject = projectService.updateProject(projectId, projectDto);
        
        return new ResponseEntity<>(updatedProject, HttpStatus.OK);
    }

    @DeleteMapping("/{projectId}")
        public ResponseEntity<Void> deleteProject(@PathVariable Long projectId){
            projectService.deleteProject(projectId);

            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
}
