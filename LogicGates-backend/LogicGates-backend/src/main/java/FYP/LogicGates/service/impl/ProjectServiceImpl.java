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
import jakarta.transaction.Transactional;

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
    public ProjectDto getProjectById(Long projectId) {
        Project project = projectRepository.findByProjectId(projectId).orElseThrow(
            () -> new ResourceNotFoundException("Project not found with projectId: " + projectId)
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
    @Transactional
    public ProjectDto updateProject(Long projectId, ProjectDto projectDto) {
        Project existingProject = projectRepository.findByProjectId(projectId).orElseThrow(
            () -> new ResourceNotFoundException("Project not found with projectId: " + projectId)
        );

        existingProject.setProjectName(projectDto.getProjectName());
        existingProject.setProjectJSON(projectDto.getProjectJSON());
        Project updatedProject = projectRepository.save(existingProject);
        return ProjectMapper.mapToProjectDto(updatedProject);
    }

    @Override
    public void deleteProject(Long projectId){
        Project projectToDelete = projectRepository.findByProjectId(projectId).orElseThrow(
            () -> new ResourceNotFoundException("Project not found with projectId: " + projectId)
            );

        projectRepository.deleteById(projectId);
    }


}
