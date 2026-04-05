package com.banquito.cliente.service;

import com.banquito.cliente.dto.TransaccionRequestDTO;
import com.banquito.cliente.dto.TransaccionResponseDTO;
import com.banquito.cliente.model.Cuenta;
import com.banquito.cliente.model.Transaccion;
import com.banquito.cliente.repository.CuentaRepository;
import com.banquito.cliente.repository.TransaccionRepository;
import com.banquito.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransaccionService {

    private static final String OTP_DEMO = "123456";

    private final TransaccionRepository transaccionRepository;
    private final CuentaRepository      cuentaRepository;

    public List<TransaccionResponseDTO> listarPorCuenta(Integer idCuenta) {
        log.info("[RF-CLI-02] Listando transacciones de cuenta: {}", idCuenta);
        return transaccionRepository
                .findByCuenta_IdCuentaOrderByCreatedAtDesc(idCuenta)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<TransaccionResponseDTO> listarPorCliente(Integer idCliente) {
        log.info("[RF-CLI-02] Listando transacciones del cliente: {}", idCliente);
        return transaccionRepository
                .findByCliente_IdClienteOrderByCreatedAtDesc(idCliente)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public TransaccionResponseDTO realizarTransferencia(TransaccionRequestDTO dto) {
        log.info("[RF-CLI-02][RNF-CLI-03] Iniciando SPEI desde cuenta {} por ${}", dto.getIdCuenta(), dto.getMonto());

        if (!OTP_DEMO.equals(dto.getOtp())) {
            throw new BusinessException("OTP incorrecto. Para esta demo usa: 123456");
        }

        Cuenta cuentaOrigen = cuentaRepository.findById(dto.getIdCuenta())
                .orElseThrow(() -> new BusinessException("Cuenta origen no encontrada"));

        if (!"ACTIVA".equals(cuentaOrigen.getEstado())) {
            throw new BusinessException("La cuenta origen no esta activa");
        }

        if (cuentaOrigen.getClabe().equals(dto.getCuentaDestino())) {
            throw new BusinessException("No puedes transferir a tu misma cuenta");
        }

        if (cuentaOrigen.getSaldo().compareTo(dto.getMonto()) < 0) {
            throw new BusinessException(
                    String.format("Fondos insuficientes. Saldo disponible: $%.2f", cuentaOrigen.getSaldo()));
        }

        if (dto.getMonto().compareTo(cuentaOrigen.getLimiteDiario()) > 0) {
            throw new BusinessException(
                    String.format("Monto supera el limite diario de $%.2f", cuentaOrigen.getLimiteDiario()));
        }

        BigDecimal saldoAntes   = cuentaOrigen.getSaldo();
        BigDecimal saldoDespues = saldoAntes.subtract(dto.getMonto());
        cuentaOrigen.setSaldo(saldoDespues);
        cuentaRepository.save(cuentaOrigen);

        Transaccion tx = Transaccion.builder()
                .cuenta(cuentaOrigen)
                .cliente(cuentaOrigen.getCliente())
                .tipoOp("SPEI")
                .monto(dto.getMonto())
                .saldoAntes(saldoAntes)
                .saldoDespues(saldoDespues)
                .cuentaDestino(dto.getCuentaDestino())
                .concepto(dto.getConcepto())
                .otpValidado((short) 1)
                .estado("COMPLETADA")
                .canal("WEB")
                .comprobanteGenerado(false)
                .sospechosa(false)
                .build();

        Transaccion guardada = transaccionRepository.save(tx);
        log.info("[RF-CLI-02] SPEI completado. TX id: {}", guardada.getIdTransaccion());
        return toDTO(guardada);
    }

    // ── RF-CLI-08 / RNF-CLI-08: Operaciones sospechosas ─────────────────────

    /**
     * RF-CLI-08: Lista todas las transacciones con sospechosa=TRUE.
     * Usa idx_tx_sospechosa (índice parcial V6) para rendimiento óptimo.
     * Solo accesible por SUPERVISOR.
     */
    public List<TransaccionResponseDTO> listarSospechosas() {
        log.info("[RF-CLI-08][RNF-CLI-08] Listando transacciones sospechosas");
        List<TransaccionResponseDTO> result = transaccionRepository
                .findBySospechosaTrueOrderByCreatedAtDesc()
                .stream().map(this::toDTO).collect(Collectors.toList());
        log.info("[RNF-CLI-08] {} transacciones sospechosas encontradas", result.size());
        return result;
    }

    /**
     * RNF-CLI-08: Marca una transacción sospechosa como revisada (sospechosa=FALSE).
     * Registra auditoría en log con id del supervisor.
     */
    @Transactional
    public TransaccionResponseDTO marcarRevisada(Integer idTransaccion, String supervisorEmail) {
        log.info("[RNF-CLI-08] Supervisor {} marcando tx {} como revisada",
                supervisorEmail, idTransaccion);
        Transaccion tx = transaccionRepository.findById(idTransaccion)
                .orElseThrow(() -> new BusinessException(
                        "Transacción no encontrada: " + idTransaccion));
        if (!tx.isSospechosa()) {
            throw new BusinessException(
                    "La transacción " + idTransaccion + " no está marcada como sospechosa");
        }
        tx.setSospechosa(false);
        Transaccion guardada = transaccionRepository.save(tx);
        log.info("[RNF-CLI-08] TX {} marcada como revisada por {}", idTransaccion, supervisorEmail);
        return toDTO(guardada);
    }

    private TransaccionResponseDTO toDTO(Transaccion t) {
        return TransaccionResponseDTO.builder()
                .idTransaccion(t.getIdTransaccion())
                .tipoOperacion(t.getTipoOp())
                .tipoOp(t.getTipoOp())
                .monto(t.getMonto())
                .saldoAntes(t.getSaldoAntes())
                .saldoDespues(t.getSaldoDespues())
                .cuentaDestino(t.getCuentaDestino())
                .concepto(t.getConcepto())
                .estado(t.getEstado())
                .canal(t.getCanal())
                .createdAt(t.getCreatedAt())
                .comprobanteGenerado(t.isComprobanteGenerado())
                .sospechosa(t.isSospechosa())
                .clienteNombre(t.getCliente().getNombre() + " " + t.getCliente().getApellidoPat())
                .numeroCuentaOrigen(t.getCuenta().getNumeroCuenta())
                .build();
    }
}
