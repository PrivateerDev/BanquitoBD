package com.banquito.empleado.service;

import com.banquito.empleado.dto.LoginRequestDTO;
import com.banquito.empleado.dto.LoginResponseDTO;
import com.banquito.empleado.model.Empleado;
import com.banquito.empleado.repository.EmpleadoRepository;
import com.banquito.exception.BusinessException;
import com.banquito.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final JwtUtil             jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO req) {
        log.info("[Auth] Intento de login: {}", req.getEmail());

        Empleado emp = empleadoRepository
                .findByEmailAndActivo(req.getEmail(), (short) 1)
                .orElseThrow(() -> new BusinessException("Credenciales invalidas"));

        if (!req.getPassword().equals(emp.getPasswordHash())) {
            throw new BusinessException("Credenciales invalidas");
        }

        // Generar token JWT real — RNF-ES-01
        String token = jwtUtil.generarToken(
                emp.getIdEmpleado(),
                emp.getEmail(),
                emp.getRol());

        log.info("[Auth] Login exitoso: {} rol={}", emp.getEmail(), emp.getRol());

        return LoginResponseDTO.builder()
                .idEmpleado(emp.getIdEmpleado())
                .nombre(emp.getNombre())
                .apellidoPat(emp.getApellidoPat())
                .email(emp.getEmail())
                .rol(emp.getRol())
                .sucursalNombre(emp.getSucursal().getNombre())
                .token(token)
                .build();
    }
}
