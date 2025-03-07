package FYP.LogicGates.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import FYP.LogicGates.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long>{

    
    List<Project> findByUserId(Long userId);
    Optional<Project> findByProjectId(Long projectId);

}
