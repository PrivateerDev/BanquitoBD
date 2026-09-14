package com.banquito.auditoria.aspect;

import com.banquito.auditoria.model.BitacoraAcceso;
import com.banquito.auditoria.repository.BitacoraAccesoRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditoriaAccesoAspect {

    private final BitacoraAccesoRepository bitacoraAccesoRepository;

    // Cubre Cliente, Cuenta, Tarjeta, Transaccion, SolicitudCredito,
    // Aclaracion, BloqueoTarjeta, ProductoMovimiento (todos viven aqui).
    @Around("execution(* com.banquito.cliente.controller..*(..))")
    public Object auditar(ProceedingJoinPoint pjp) throws Throwable {
        String usuario = obtenerUsuario();
        String recurso = obtenerRecurso();
        String accion  = obtenerAccion();

        try {
            Object resultado = pjp.proceed();
            registrar(usuario, recurso, accion, "EXITO", null);
            return resultado;
        } catch (Throwable ex) {
            registrar(usuario, recurso, accion, "RECHAZO", ex.getMessage());
            throw ex;
        }
    }

    private void registrar(String usuario, String recurso, String accion, String resultado, String detalle) {
        try {
            bitacoraAccesoRepository.save(BitacoraAcceso.builder()
                    .usuario(usuario)
                    .recurso(recurso)
                    .accion(accion)
                    .resultado(resultado)
                    .detalle(detalle)
                    .build());
        } catch (Exception e) {
            // La bitacora nunca debe tumbar la peticion original
            log.error("[Bitacora] No se pudo registrar el acceso: {}", e.getMessage());
        }
    }

    private String obtenerUsuario() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.isAuthenticated()) ? auth.getName() : "ANONIMO";
    }

    private String obtenerRecurso() {
        HttpServletRequest req = requestActual();
        return req != null ? req.getMethod() + " " + req.getRequestURI() : "N/D";
    }

    private String obtenerAccion() {
        HttpServletRequest req = requestActual();
        if (req == null) return "DESCONOCIDA";
        return switch (req.getMethod()) {
            case "GET" -> "CONSULTAR";
            case "POST" -> "CREAR";
            case "PUT", "PATCH" -> "ACTUALIZAR";
            case "DELETE" -> "ELIMINAR";
            default -> req.getMethod();
        };
    }

    private HttpServletRequest requestActual() {
        var attrs = RequestContextHolder.getRequestAttributes();
        if (attrs instanceof ServletRequestAttributes sra) {
            return sra.getRequest();
        }
        return null;
    }
}
