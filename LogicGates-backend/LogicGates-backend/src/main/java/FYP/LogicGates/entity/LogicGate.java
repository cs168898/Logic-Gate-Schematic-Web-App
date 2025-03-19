package FYP.LogicGates.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)  // Exclude null fields from JSON serialization

public class LogicGate {
    private String name;
    private String type;
    private List<String> input;
    private String output;

    // Constructors, Getters, and Setters
    public LogicGate() {}

    public LogicGate(String name, String type, List<String> input, String output) {
        this.name = name;
        this.type = type;
        this.input = input;
        this.output = output;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<String> getInput() { return input; }
    public void setInput(List<String> input) { this.input = input; }

    public String getOutput() { return output; }
    public void setOutput(String output) { this.output = output; }
}
