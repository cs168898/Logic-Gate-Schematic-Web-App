package FYP.LogicGates.repository;

import FYP.LogicGates.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TokenRepository extends JpaRepository<Token, UUID> {
    Optional<Token> findByToken(String token);
    void deleteByUserid(Long userid); // optional cleanup if needed
}
