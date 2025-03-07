package FYP.LogicGates.service;

import java.util.List;

import FYP.LogicGates.dto.ProjectDto;
import FYP.LogicGates.entity.Project;

public interface ProjectService {
    List<ProjectDto> getAllProjects(Long userId);
    ProjectDto getProjectById(Long projectId);
    ProjectDto createProject(ProjectDto projectDto);
    ProjectDto updateProject(Long projectId, ProjectDto projectDto);
    void deleteProject(Long projectId);
}
