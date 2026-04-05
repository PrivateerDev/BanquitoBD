package com.banquito.cliente.service;

import com.banquito.cliente.dto.ClienteRequestDTO;
import com.banquito.cliente.dto.ClienteResponseDTO;
import com.banquito.cliente.model.Cliente;
import com.banquito.cliente.model.Sucursal;
import com.banquito.cliente.repository.ClienteRepository;
import com.banquito.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public List<ClienteResponseDTO> listarClientes() {
        log.info("Listando todos los clientes");
        return clienteRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ClienteResponseDTO buscarPorId(Integer id) {
        log.info("Buscando cliente con id: {}", id);
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
        return toDTO(cliente);
    }

    public ClienteResponseDTO buscarPorEmail(String email) {
        log.info("Buscando cliente con email: {}", email);
        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con email: " + email));
        return toDTO(cliente);
    }

    public ClienteResponseDTO crearCliente(ClienteRequestDTO dto) {
        log.info("Creando cliente con email: {}", dto.getEmail());

        if (clienteRepository.existsByEmail(dto.getEmail()))
            throw new BusinessException("Ya existe un cliente con el email: " + dto.getEmail());
        if (clienteRepository.existsByRfc(dto.getRfc()))
            throw new BusinessException("Ya existe un cliente con el RFC: " + dto.getRfc());
        if (clienteRepository.existsByCurp(dto.getCurp()))
            throw new BusinessException("Ya existe un cliente con el CURP: " + dto.getCurp());

        Sucursal sucursal = new Sucursal();
        sucursal.setIdSucursal(dto.getIdSucursal());

        Cliente cliente = Cliente.builder()
                .sucursal(sucursal)
                .nombre(dto.getNombre())
                .apellidoPat(dto.getApellidoPat())
                .apellidoMat(dto.getApellidoMat())
                .rfc(dto.getRfc())
                .curp(dto.getCurp())
                .email(dto.getEmail())
                .telefono(dto.getTelefono())
                .pin(dto.getPin())
                .build();

        Cliente guardado = clienteRepository.save(cliente);
        log.info("Cliente creado con id: {}", guardado.getIdCliente());
        return toDTO(guardado);
    }

    private ClienteResponseDTO toDTO(Cliente c) {
        return ClienteResponseDTO.builder()
                .idCliente(c.getIdCliente())
                .nombre(c.getNombre())
                .apellidoPat(c.getApellidoPat())
                .apellidoMat(c.getApellidoMat())
                .email(c.getEmail())
                .telefono(c.getTelefono())
                .rfc(c.getRfc())
                .curp(c.getCurp())
                .activo(c.getActivo())
                .sucursalNombre(c.getSucursal() != null ? c.getSucursal().getNombre() : null)
                .build();
    }
}
