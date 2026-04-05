package com.banquito.empleado.controller;

import com.banquito.empleado.dto.LoginRequestDTO;
import com.banquito.empleado.dto.LoginResponseDTO;
import com.banquito.empleado.service.EmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/empleados")
@RequiredArgsConstructor
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO req) {
        return ResponseEntity.ok(empleadoService.login(req));
    }
}
