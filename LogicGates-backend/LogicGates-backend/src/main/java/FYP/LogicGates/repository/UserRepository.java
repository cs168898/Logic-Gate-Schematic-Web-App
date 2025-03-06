
// Purpose: This is a repository interface for the UserDetails entity. 
// It extends JpaRepository, providing CRUD operations and query methods for interacting with the database.

package FYP.LogicGates.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import FYP.LogicGates.entity.UserDetails; // check if correct import

public interface UserRepository extends JpaRepository<UserDetails, Long>{

    UserDetails findByUsername(String username);

}
