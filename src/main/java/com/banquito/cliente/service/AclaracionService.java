package com.banquito.cliente.service;

import com.banquito.cliente.dto.AclaracionRequestDTO;
import com.banquito.cliente.dto.AclaracionResponseDTO;
import com.banquito.cliente.model.Aclaracion;
import com.banquito.cliente.model.Cliente;
import com.banquito.cliente.model.Transaccion;
import com.banquito.cliente.repository.AclaracionRepository;
import com.banquito.cliente.repository.ClienteRepository;
import com.banquito.cliente.repository.TransaccionRepository;
import com.banquito.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AclaracionService {

    private final AclaracionRepository aclaracionRepository;
    private final ClienteRepository clienteRepository;
    private final TransaccionRepository transaccionRepository;

    @Transactional
    public AclaracionResponseDTO crearAclaracion(AclaracionRequestDTO request) {
        log.info("[RF-CLI-06][CU-CLI-05] Creando aclaracion tipo={} para cliente={} tx={}",
                request.getTipoAclaracion(), request.getIdCliente(), request.getIdTransaccion());
        Cliente cliente = clienteRepository.findById(request.getIdCliente())
                .orElseThrow(() -> new BusinessException("Cliente no encontrado: " + request.getIdCliente()));

        Transaccion transaccion = transaccionRepository.findById(request.getIdTransaccion())
                .orElseThrow(() -> new BusinessException("Transacción no encontrada: " + request.getIdTransaccion()));

        String folio = "ACL-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));

        Aclaracion aclaracion = Aclaracion.builder()
                .cliente(cliente)
                .transaccion(transaccion)
                .folio(folio)
                .tipoAclaracion(request.getTipoAclaracion())
                .descripcion(request.getDescripcion())
                .monto(request.getMonto())
                .build();

        aclaracionRepository.save(aclaracion);
        return toResponse(aclaracion);
    }

    @Transactional(readOnly = true)
    public List<AclaracionResponseDTO> obtenerPorCliente(Integer idCliente) {
        log.info("[RF-CLI-06] Consultando aclaraciones del cliente: {}", idCliente);
        return aclaracionRepository.findByCliente_IdClienteOrderByCreatedAtDesc(idCliente)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AclaracionResponseDTO obtenerPorFolio(String folio) {
        log.info("[RF-CLI-06] Buscando aclaracion por folio: {}", folio);
        return aclaracionRepository.findByFolio(folio)
                .map(this::toResponse)
                .orElseThrow(() -> new BusinessException("Aclaración no encontrada con folio: " + folio));
    }

    private AclaracionResponseDTO toResponse(Aclaracion a) {
        return AclaracionResponseDTO.builder()
                .idAclaracion(a.getIdAclaracion())
                .idCliente(a.getCliente().getIdCliente())
                .idTransaccion(a.getTransaccion().getIdTransaccion())
                .folio(a.getFolio())
                .tipoAclaracion(a.getTipoAclaracion())
                .descripcion(a.getDescripcion())
                .monto(a.getMonto())
                .estado(a.getEstado())
                .plazoRegulatorio(a.getPlazoRegulatorio())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
