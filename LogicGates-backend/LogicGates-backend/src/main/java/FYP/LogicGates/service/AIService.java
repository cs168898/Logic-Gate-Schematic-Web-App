package FYP.LogicGates.service;

import java.util.List;


public interface AIService {
    String callAiAPI(String UserInput, List<String> ExistingGates) throws Exception;
}
