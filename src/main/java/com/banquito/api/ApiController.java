package com.banquito.api;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ApiController {
    
    @PostMapping("/evaluar-documentos")
    public Map<String,Object> evaluarDocumentos(@RequestBody(required = false) Map<String,Object> data) {
        return Map.of("status","success","documentosEvaluados",3,"aprobados",2);
    }
    
    @PostMapping("/evaluar-revision")
    public Map<String,Object> evaluarRevision(@RequestBody(required = false) Map<String,Object> data) {
        return Map.of("status","success","revision","aprobada");
    }
    
    @GetMapping("/clientes")
    public List<Map<String,Object>> clientes() {
        return List.of(
            Map.of("id",1,"nombre","Juan Pérez","estado","pendiente"),
            Map.of("id",2,"nombre","María García","estado","aprobado")
        );
    }
    
    @PostMapping("/clientes/nuevo-cliente")
    public Map<String,Object> nuevoCliente(@RequestBody Map<String,Object> data) {
        return Map.of("status","success","clienteId",999,"mensaje","Cliente creado");
    }
}
