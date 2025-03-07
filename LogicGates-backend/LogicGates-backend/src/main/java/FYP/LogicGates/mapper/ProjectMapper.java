package FYP.LogicGates.mapper;

import FYP.LogicGates.dto.ProjectDto;
import FYP.LogicGates.entity.Project;

public class ProjectMapper {
    public static ProjectDto mapToProjectDto(Project project) {
        return new ProjectDto(
            project.getProjectId(),
            project.getProjectName(),
            project.getProjectJSON(),
            // Map other fields as needed
            project.getUser().getId()
        );
    }

    public static Project mapToProject(ProjectDto projectDto) {
        return new Project(
            projectDto.getProjectId(),
            projectDto.getProjectName(),
            projectDto.getProjectJSON(),
            null // UserDetails should be set separately
            // Map other fields as needed
        );
    }
}