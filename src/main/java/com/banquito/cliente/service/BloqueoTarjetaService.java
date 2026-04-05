package com.banquito.cliente.service;

import com.banquito.cliente.dto.BloqueoTarjetaRequestDTO;
import com.banquito.cliente.dto.BloqueoTarjetaResponseDTO;
import com.banquito.cliente.model.BloqueoTarjeta;
import com.banquito.cliente.model.Cliente;
import com.banquito.cliente.model.Tarjeta;
import com.banquito.cliente.repository.BloqueoTarjetaRepository;
import com.banquito.cliente.repository.ClienteRepository;
import com.banquito.cliente.repository.TarjetaRepository;
import com.banquito.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BloqueoTarjetaService {

    private final BloqueoTarjetaRepository bloqueoTarjetaRepository;
    private final TarjetaRepository tarjetaRepository;
    private final ClienteRepository clienteRepository;

    @Transactional
    public BloqueoTarjetaResponseDTO bloquearTarjeta(BloqueoTarjetaRequestDTO request) {
        Tarjeta tarjeta = tarjetaRepository.findById(request.getIdTarjeta())
                .orElseThrow(() -> new BusinessException("Tarjeta no encontrada: " + request.getIdTarjeta()));

        if (!"ACTIVA".equals(tarjeta.getEstado())) {
            throw new BusinessException("La tarjeta ya se encuentra bloqueada o inactiva");
        }

        Cliente cliente = clienteRepository.findById(request.getIdCliente())
                .orElseThrow(() -> new BusinessException("Cliente no encontrado: " + request.getIdCliente()));

        String folio = "BLQ-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));

        tarjeta.setEstado("BLOQUEADA");
        tarjetaRepository.save(tarjeta);

        BloqueoTarjeta bloqueo = BloqueoTarjeta.builder()
                .tarjeta(tarjeta)
                .cliente(cliente)
                .folio(folio)
                .motivo(request.getMotivo())
                .descripcion(request.getDescripcion())
                .notificadoSms((short) 0)
                .notificadoEmail((short) 0)
                .build();

        bloqueoTarjetaRepository.save(bloqueo);
        return toResponse(bloqueo);
    }

    @Transactional(readOnly = true)
    public List<BloqueoTarjetaResponseDTO> obtenerPorCliente(Integer idCliente) {
        return bloqueoTarjetaRepository.findByCliente_IdCliente(idCliente)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BloqueoTarjetaResponseDTO obtenerPorFolio(String folio) {
        return bloqueoTarjetaRepository.findByFolio(folio)
                .map(this::toResponse)
                .orElseThrow(() -> new BusinessException("Bloqueo no encontrado con folio: " + folio));
    }

    private BloqueoTarjetaResponseDTO toResponse(BloqueoTarjeta b) {
        return BloqueoTarjetaResponseDTO.builder()
                .idBloqueo(b.getIdBloqueo())
                .idTarjeta(b.getTarjeta().getIdTarjeta())
                .idCliente(b.getCliente().getIdCliente())
                .folio(b.getFolio())
                .motivo(b.getMotivo())
                .descripcion(b.getDescripcion())
                .notificadoSms(b.getNotificadoSms())
                .notificadoEmail(b.getNotificadoEmail())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
