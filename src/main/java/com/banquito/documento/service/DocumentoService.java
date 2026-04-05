package com.banquito.documento.service;

import com.banquito.cliente.model.Cliente;
import com.banquito.cliente.model.SolicitudCredito;
import com.banquito.cliente.repository.ClienteRepository;
import com.banquito.cliente.repository.SolicitudCreditoRepository;
import com.banquito.documento.dto.DocumentoResponseDTO;
import com.banquito.documento.dto.RevisionRequestDTO;
import com.banquito.documento.model.DocumentoCliente;
import com.banquito.documento.repository.DocumentoClienteRepository;
import com.banquito.empleado.model.Empleado;
import com.banquito.empleado.repository.EmpleadoRepository;
import com.banquito.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentoService {

    private final DocumentoClienteRepository documentoRepo;
    private final ClienteRepository          clienteRepo;
    private final EmpleadoRepository         empleadoRepo;
    private final SolicitudCreditoRepository solicitudRepo;

    @Value("${app.uploads.path:uploads/docs}")
    private String uploadsPath;

    public DocumentoResponseDTO subirDocumento(
            Integer idCliente, Integer idEmpleado,
            String tipoDocumento, Integer idSolicitud,
            MultipartFile archivo) throws IOException {

        Cliente  cliente  = clienteRepo.findById(idCliente)
            .orElseThrow(() -> new BusinessException("Cliente no encontrado"));
        Empleado empleado = empleadoRepo.findById(idEmpleado)
            .orElseThrow(() -> new BusinessException("Empleado no encontrado"));

        SolicitudCredito solicitud = null;
        if (idSolicitud != null) {
            solicitud = solicitudRepo.findById(idSolicitud)
                .orElseThrow(() -> new BusinessException("Solicitud no encontrada"));
        }

        String ext         = getExtension(archivo.getOriginalFilename());
        String uuid        = UUID.randomUUID().toString();
        String carpeta     = uploadsPath + "/" + idCliente;
        String nombreFinal = uuid + "." + ext;
        Path   destino     = Paths.get(carpeta, nombreFinal);

        Files.createDirectories(destino.getParent());
        Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

        DocumentoCliente doc = DocumentoCliente.builder()
            .cliente(cliente)
            .empleado(empleado)
            .solicitud(solicitud)
            .tipoDocumento(tipoDocumento.toUpperCase())
            .nombreArchivo(archivo.getOriginalFilename())
            .rutaArchivo(carpeta + "/" + nombreFinal)
            .mimeType(archivo.getContentType())
            .tamanioBytes((int) archivo.getSize())
            .estado("PENDIENTE")
            .build();

        return toDTO(documentoRepo.save(doc));
    }

    public List<DocumentoResponseDTO> getDocumentosPorCliente(Integer idCliente) {
        return documentoRepo.findByClienteIdClienteOrderByCreatedAtDesc(idCliente)
            .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<DocumentoResponseDTO> getDocumentosPendientes() {
        return documentoRepo.findByEstadoOrderByCreatedAtDesc("PENDIENTE")
            .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public DocumentoResponseDTO revisarDocumento(Integer idDocumento, RevisionRequestDTO req) {
        DocumentoCliente doc = documentoRepo.findById(idDocumento)
            .orElseThrow(() -> new BusinessException("Documento no encontrado"));

        if (!req.getEstado().equals("VALIDADO") && !req.getEstado().equals("RECHAZADO"))
            throw new BusinessException("Estado inválido: use VALIDADO o RECHAZADO");

        Empleado revisor = empleadoRepo.findById(req.getIdEmpleadoRevisor())
            .orElseThrow(() -> new BusinessException("Empleado revisor no encontrado"));

        doc.setEstado(req.getEstado());
        doc.setObservaciones(req.getObservaciones());
        doc.setEmpleadoRevisor(revisor);
        doc.setFechaRevision(LocalDateTime.now());

        return toDTO(documentoRepo.save(doc));
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "bin";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    private DocumentoResponseDTO toDTO(DocumentoCliente d) {
        String nombreCliente = d.getCliente().getNombre() + " " + d.getCliente().getApellidoPat();
        String nombreEmp     = d.getEmpleado().getNombre() + " " + d.getEmpleado().getApellidoPat();
        String nombreRev     = d.getEmpleadoRevisor() != null
            ? d.getEmpleadoRevisor().getNombre() + " " + d.getEmpleadoRevisor().getApellidoPat()
            : null;

        Integer idSol    = d.getSolicitud() != null ? d.getSolicitud().getIdsolicitud() : null;
        String  tipoProd = d.getSolicitud() != null ? d.getSolicitud().getTipoproducto() : null;
        String  folio    = d.getSolicitud() != null ? d.getSolicitud().getFolioseguimiento() : null;

        return DocumentoResponseDTO.builder()
            .idDocumento(d.getIdDocumento())
            .idCliente(d.getCliente().getIdCliente())
            .nombreCliente(nombreCliente)
            .idEmpleado(d.getEmpleado().getIdEmpleado())
            .nombreEmpleado(nombreEmp)
            .tipoDocumento(d.getTipoDocumento())
            .nombreArchivo(d.getNombreArchivo())
            .mimeType(d.getMimeType())
            .tamanioBytes(d.getTamanioBytes())
            .estado(d.getEstado())
            .observaciones(d.getObservaciones())
            .nombreRevisor(nombreRev)
            .fechaRevision(d.getFechaRevision())
            .createdAt(d.getCreatedAt())
            .idSolicitud(idSol)
            .tipoProducto(tipoProd)
            .folioSolicitud(folio)
            .build();
    }
}
