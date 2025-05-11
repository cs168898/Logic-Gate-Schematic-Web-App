package FYP.LogicGates.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Token {

    @Id
    @GeneratedValue
    @Column(name = "tokenid")  // Tells JPA to use tokenid column as PK
    private UUID tokenid;

    @Column(nullable = false)
    private Long userid;

    @Column(nullable = false)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    public Token(Long userid, String token, LocalDateTime expiresAt) {
        this.userid = userid;
        this.token = token;
        this.expiresAt = expiresAt;
    }
}
