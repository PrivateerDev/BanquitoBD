package com.banquito.cliente.service;

import com.banquito.cliente.dto.MovimientoCuentaDTO;
import com.banquito.cliente.dto.MovimientoCuentaDTO.MovimientoDTO;
import com.banquito.cliente.dto.ProductoClienteDTO;
import com.banquito.cliente.dto.ProductoClienteDTO.CuentaProductoDTO;
import com.banquito.cliente.dto.ProductoClienteDTO.SolicitudProductoDTO;
import com.banquito.cliente.model.Cuenta;
import com.banquito.cliente.model.SolicitudCredito;
import com.banquito.cliente.model.Transaccion;
import com.banquito.cliente.repository.CuentaRepository;
import com.banquito.cliente.repository.SolicitudCreditoRepository;
import com.banquito.cliente.repository.TransaccionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de productos y movimientos del cliente para el Empleado de Sucursal.
 *
 * Trazabilidad:
 *  RF-CLI-01 → Consultar saldos y productos contratados (cuentas activas/finalizadas)
 *  RF-CLI-02 → Historial de operaciones / movimientos
 *  RF-CLI-03 → Estado de solicitudes de productos bancarios
 *  RF-CLI-08 → Generación de comprobantes
 *  RNF-CLI-02 → Tiempo de respuesta < 5 s
 *  RNF-CLI-08 → Detección de operaciones sospechosas
 *
 * Actor: EJECUTIVO_SUCURSAL (Ejecutivo de Cuenta — Atención a Clientes)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductoMovimientoService {

    private static final List<String> ESTADOS_CUENTA_ACTIVA    = Arrays.asList("ACTIVA");
    private static final List<String> ESTADOS_SOLICITUD_ACTIVA = Arrays.asList("PENDIENTE", "EN_EVALUACION", "APROBADA");

    private final CuentaRepository           cuentaRepository;
    private final SolicitudCreditoRepository  solicitudRepository;
    private final TransaccionRepository       transaccionRepository;

    // ── RF-CLI-01 + RF-CLI-03: Productos activos y finalizados ───────────────

    /**
     * Devuelve cuentas bancarias y solicitudes del cliente.
     * Trazabilidad: RF-CLI-01, RF-CLI-03 · CU-CLI-01 · tblcuenta, tblsolicitudcredito
     */
    public ProductoClienteDTO obtenerProductosCliente(Integer idCliente) {
        log.info("[RF-CLI-01][RF-CLI-03] Consultando productos del cliente: {}", idCliente);

        // ── Cuentas — tblcuenta ──────────────────────────────────────────────
        // CuentaRepository.findByClienteIdCliente (getter real: getIdCliente con C mayúscula)
        List<Cuenta> cuentas = cuentaRepository.findByClienteIdCliente(idCliente);

        List<CuentaProductoDTO> cuentasDTO = cuentas.stream()
                .map(c -> CuentaProductoDTO.builder()
                        .idCuenta(c.getIdCuenta())                          // getter real: getIdCuenta()
                        .numeroCuenta(c.getNumeroCuenta())                  // getter real: getNumeroCuenta()
                        .clabe(c.getClabe())
                        .tipoCuenta(c.getTipoCuenta())                      // getter real: getTipoCuenta()
                        .estado(c.getEstado())
                        .saldo(c.getSaldo())
                        .limiteDialio(c.getLimiteDiario())                  // getter real: getLimiteDiario()
                        .sucursalNombre(c.getSucursal() != null
                                ? c.getSucursal().getNombre() : "N/A")
                        .creadoEn(c.getCreatedAt())                         // getter real: getCreatedAt()
                        .activo(ESTADOS_CUENTA_ACTIVA.contains(c.getEstado()))
                        .build())
                .collect(Collectors.toList());

        // ── Solicitudes — tblsolicitudcredito ────────────────────────────────
        // SolicitudCreditoRepository.findByIdclienteOrderByCreatedatDesc (método real)
        List<SolicitudCredito> solicitudes = solicitudRepository
                .findByIdclienteOrderByCreatedatDesc(idCliente);

        List<SolicitudProductoDTO> solicitudesDTO = solicitudes.stream()
                .map(s -> SolicitudProductoDTO.builder()
                        .idSolicitud(s.getIdsolicitud())
                        .folioSeguimiento(s.getFolioseguimiento())
                        .tipoProducto(s.getTipoproducto())
                        .monto(s.getMonto())
                        .plazo(s.getPlazo())
                        .estado(s.getEstado())
                        .creadoEn(s.getCreatedat())
                        .actualizadoEn(s.getUpdatedat())
                        .activo(ESTADOS_SOLICITUD_ACTIVA.contains(s.getEstado()))
                        .build())
                .collect(Collectors.toList());

        log.info("[RF-CLI-01] {} cuentas | [RF-CLI-03] {} solicitudes para cliente {}",
                cuentas.size(), solicitudes.size(), idCliente);

        return ProductoClienteDTO.builder()
                .cuentas(cuentasDTO)
                .solicitudes(solicitudesDTO)
                .build();
    }

    // ── RF-CLI-02 + RF-CLI-08: Movimientos de cuenta ─────────────────────────

    /**
     * Historial de movimientos de una cuenta específica.
     * Trazabilidad: RF-CLI-02, RF-CLI-08 · RNF-CLI-02 (<5s) · RNF-CLI-08 · tbltransaccion
     */
    public MovimientoCuentaDTO obtenerMovimientosCuenta(Integer idCuenta) {
        log.info("[RF-CLI-02] Consultando movimientos de cuenta: {}", idCuenta);

        Cuenta cuenta = cuentaRepository.findById(idCuenta)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada: " + idCuenta));

        // RNF-CLI-02: < 5 s — findByCuenta_IdCuenta usa el índice en idcuenta
        List<Transaccion> transacciones = transaccionRepository
                .findByCuenta_IdCuentaOrderByCreatedAtDesc(idCuenta);

        List<MovimientoDTO> movimientosDTO = transacciones.stream()
                .map(t -> MovimientoDTO.builder()
                        .idTransaccion(t.getIdTransaccion())         // getter real: getIdTransaccion()
                        .tipoOperacion(t.getTipoOp())                // getter real: getTipoOp()
                        .monto(t.getMonto())
                        .concepto(t.getConcepto())
                        .canal(t.getCanal())
                        .estado(t.getEstado())
                        .sospechosa(t.isSospechosa())               // RNF-CLI-08
                        .comprobanteGenerado(t.isComprobanteGenerado()) // RF-CLI-08
                        .timestamp(t.getCreatedAt())                 // getter real: getCreatedAt()
                        .build())
                .collect(Collectors.toList());

        log.info("[RF-CLI-02] {} movimientos para cuenta {}", transacciones.size(), idCuenta);

        return MovimientoCuentaDTO.builder()
                .idCuenta(cuenta.getIdCuenta())
                .numeroCuenta(cuenta.getNumeroCuenta())
                .tipoCuenta(cuenta.getTipoCuenta())
                .saldoActual(cuenta.getSaldo())
                .movimientos(movimientosDTO)
                .build();
    }

    /**
     * Movimientos de TODAS las cuentas de un cliente (vista consolidada).
     * Trazabilidad: RF-CLI-01, RF-CLI-02 · CU-CLI-01
     */
    public List<MovimientoCuentaDTO> obtenerMovimientosTodoCuenta(Integer idCliente) {
        log.info("[RF-CLI-01][RF-CLI-02] Movimientos consolidados cliente: {}", idCliente);
        List<Cuenta> cuentas = cuentaRepository.findByClienteIdCliente(idCliente);
        return cuentas.stream()
                .map(c -> obtenerMovimientosCuenta(c.getIdCuenta()))
                .collect(Collectors.toList());
    }
}
