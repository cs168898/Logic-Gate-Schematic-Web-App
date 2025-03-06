package FYP.LogicGates.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment pri key ID
    private Long id;

    @Column(name = "projectname", nullable = false)
    private String projectName;

    @Column(name = "projectjson", columnDefinition = "jsonb")
    private String projectJSON;

    @ManyToOne
    @JoinColumn(name = "userid", referencedColumnName = "id", nullable = false)
    private UserDetails user;

}
