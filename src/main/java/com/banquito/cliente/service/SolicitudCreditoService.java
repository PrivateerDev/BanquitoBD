package com.banquito.cliente.service;

import com.banquito.cliente.dto.SolicitudRequestDTO;
import com.banquito.cliente.dto.SolicitudResponseDTO;
import com.banquito.cliente.model.SolicitudCredito;
import com.banquito.cliente.repository.SolicitudCreditoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SolicitudCreditoService {

    private final SolicitudCreditoRepository repo;

    public SolicitudResponseDTO crear(SolicitudRequestDTO req) {
        SolicitudCredito s = new SolicitudCredito();
        s.setIdcliente(req.getIdCliente());
        s.setTipoproducto(req.getTipoProducto());
        s.setMonto(req.getMonto());
        s.setPlazo(req.getPlazo());
        s.setEstado("EN_EVALUACION");
        s.setFolioseguimiento("SOL-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
        s.setCreatedat(LocalDateTime.now());
        s.setUpdatedat(LocalDateTime.now());
        return toDTO(repo.save(s));
    }

    public List<SolicitudResponseDTO> porCliente(Integer idCliente) {
        return repo.findByIdclienteOrderByCreatedatDesc(idCliente)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private SolicitudResponseDTO toDTO(SolicitudCredito s) {
        SolicitudResponseDTO d = new SolicitudResponseDTO();
        d.setIdSolicitud(s.getIdsolicitud());
        d.setTipoProducto(s.getTipoproducto());
        d.setMonto(s.getMonto());
        d.setPlazo(s.getPlazo());
        d.setEstado(s.getEstado());
        d.setFolioSeguimiento(s.getFolioseguimiento());
        d.setCreatedAt(s.getCreatedat());
        return d;
    }
}
