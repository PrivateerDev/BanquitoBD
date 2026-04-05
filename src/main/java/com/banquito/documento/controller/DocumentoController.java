package com.banquito.documento.controller;

import com.banquito.documento.dto.DocumentoResponseDTO;
import com.banquito.documento.dto.RevisionRequestDTO;
import com.banquito.documento.service.DocumentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/documentos")
@RequiredArgsConstructor
public class DocumentoController {

    private final DocumentoService documentoService;

    @PostMapping("/subir")
    public ResponseEntity<DocumentoResponseDTO> subir(
            @RequestParam Integer idCliente,
            @RequestParam Integer idEmpleado,
            @RequestParam String  tipoDocumento,
            @RequestParam(required = false) Integer idSolicitud,
            @RequestParam MultipartFile archivo) throws IOException {
        return ResponseEntity.ok(
            documentoService.subirDocumento(idCliente, idEmpleado, tipoDocumento, idSolicitud, archivo));
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<DocumentoResponseDTO>> porCliente(@PathVariable Integer idCliente) {
        return ResponseEntity.ok(documentoService.getDocumentosPorCliente(idCliente));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<DocumentoResponseDTO>> pendientes() {
        return ResponseEntity.ok(documentoService.getDocumentosPendientes());
    }

    @PatchMapping("/{idDocumento}/revision")
    public ResponseEntity<DocumentoResponseDTO> revisar(
            @PathVariable Integer idDocumento,
            @RequestBody RevisionRequestDTO req) {
        return ResponseEntity.ok(documentoService.revisarDocumento(idDocumento, req));
    }
}
