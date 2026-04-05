package com.banquito.cliente.repository;

import com.banquito.cliente.model.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Integer> {

    // ── Usados por TransaccionService (original) ──────────────────────────────

    // TransaccionService.listarPorCuenta() — línea 31
    List<Transaccion> findByCuenta_IdCuentaOrderByCreatedAtDesc(Integer idCuenta);

    // TransaccionService.listarPorCliente() — línea 36
    List<Transaccion> findByCliente_IdClienteOrderByCreatedAtDesc(Integer idCliente);

    // ── Usado por ProductoMovimientoService (nuevo) ───────────────────────────

    // ProductoMovimientoService.obtenerMovimientosCuenta()
    List<Transaccion> findByCuenta_IdCuenta(Integer idCuenta);

    // ── RNF-CLI-08: Detección y revisión de operaciones sospechosas ───────────
    // Usa idx_tx_sospechosa (V6__indices_rendimiento.sql — índice parcial WHERE sospechosa=TRUE)
    List<Transaccion> findBySospechosaTrueOrderByCreatedAtDesc();
}
