
// Purpose: This is a repository interface for the UserDetails entity. 
// It extends JpaRepository, providing CRUD operations and query methods for interacting with the database.

package FYP.LogicGates.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import FYP.LogicGates.entity.UserDetails; // check if correct import

public interface UserRepository extends JpaRepository<UserDetails, Long>{

    @Query("SELECT u FROM UserDetails u WHERE LOWER(u.username) = LOWER(:username)")
    UserDetails findByUsername(String username);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM UserDetails u WHERE LOWER(u.username) = LOWER(:username)")
    boolean existsByUsername(@Param("username") String username);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM UserDetails u WHERE LOWER(u.email) = LOWER(:email)")
    boolean existsByEmail(@Param("email") String email);
}
