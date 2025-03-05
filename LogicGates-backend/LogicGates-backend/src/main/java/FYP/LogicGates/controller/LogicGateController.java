
// Purpose: This is a REST controller that handles HTTP requests related to logic gates. 
// It provides endpoints to store and retrieve logic gates data.

package FYP.LogicGates.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/logicgates")
public class LogicGateController {

    private List<String> logicGatesJson = new ArrayList<>();

    @PostMapping("/store")
    public ResponseEntity<String> storeLogicGates(@RequestBody String jsonInput) {
        logicGatesJson.add(jsonInput);
        return new ResponseEntity<>("Logic gates stored successfully", HttpStatus.OK);
    }

    @GetMapping("/retrieve_proj_list")
    public ResponseEntity<List<String>> retrieveLogicGates() {
        return new ResponseEntity<>(logicGatesJson, HttpStatus.OK);
    }
}
