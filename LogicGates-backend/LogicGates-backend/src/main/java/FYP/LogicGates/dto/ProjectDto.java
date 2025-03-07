package FYP.LogicGates.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    private Long projectId;
    private String projectName;
    private String projectJSON;
    private Long userId;
    // Add other fields as needed
}