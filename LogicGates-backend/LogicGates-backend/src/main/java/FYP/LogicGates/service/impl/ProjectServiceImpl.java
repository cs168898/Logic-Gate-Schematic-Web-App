package FYP.LogicGates.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import FYP.LogicGates.dto.ProjectDto;
import FYP.LogicGates.entity.Project;
import FYP.LogicGates.exception.ResourceNotFoundException;
import FYP.LogicGates.mapper.ProjectMapper;
import FYP.LogicGates.repository.ProjectRepository;
import FYP.LogicGates.service.ProjectService;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public List<ProjectDto> getAllProjects(Long userId){
        List<Project> projects = projectRepository.findByUserId(userId);
        return projects.stream()
        .map(ProjectMapper::mapToProjectDto)
        .collect(Collectors.toList());
    }

    @Override
    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Project not found with id: " + id)
        );
        return ProjectMapper.mapToProjectDto(project);
    }

    @Override
    public ProjectDto createProject(ProjectDto projectDto){
        Project project = ProjectMapper.mapToProject(projectDto);
        Project savedProject = projectRepository.save(project);
        return ProjectMapper.mapToProjectDto(savedProject);
    }

    @Override
    public ProjectDto updateProject(Long id, ProjectDto projectDto) {
        Project existingProject = projectRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Project not found with id: " + id)
        );
        existingProject.setProjectName(projectDto.getProjectName());
        existingProject.setProjectJSON(projectDto.getProjectJSON());
        Project updatedProject = projectRepository.save(existingProject);
        return ProjectMapper.mapToProjectDto(updatedProject);
    }

    @Override
    public void deleteProject(Long id){
        Project projectToDelete = projectRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Project not found with id: " + id)
            );

        projectRepository.deleteById(id);
    }


}
