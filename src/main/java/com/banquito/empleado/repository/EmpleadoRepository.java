package com.banquito.empleado.repository;

import com.banquito.empleado.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
    Optional<Empleado> findByEmailAndActivo(String email, Short activo);
}
