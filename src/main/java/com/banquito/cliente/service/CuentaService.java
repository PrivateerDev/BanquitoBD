package com.banquito.cliente.service;

import com.banquito.cliente.dto.CuentaRequestDTO;
import com.banquito.cliente.dto.CuentaResponseDTO;
import com.banquito.cliente.model.Cliente;
import com.banquito.cliente.model.Cuenta;
import com.banquito.cliente.model.Sucursal;
import com.banquito.cliente.repository.ClienteRepository;
import com.banquito.cliente.repository.CuentaRepository;
import com.banquito.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CuentaService {

    private final CuentaRepository cuentaRepository;
    private final ClienteRepository clienteRepository;

    public List<CuentaResponseDTO> listarPorCliente(Integer idCliente) {
        log.info("Listando cuentas del cliente: {}", idCliente);
        return cuentaRepository.findByClienteIdCliente(idCliente)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CuentaResponseDTO buscarPorId(Integer id) {
        Cuenta cuenta = cuentaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada con id: " + id));
        return toDTO(cuenta);
    }

    public CuentaResponseDTO crearCuenta(CuentaRequestDTO dto) {
        log.info("Creando cuenta tipo {} para cliente {}", dto.getTipoCuenta(), dto.getIdCliente());

        Cliente cliente = clienteRepository.findById(dto.getIdCliente())
                .orElseThrow(() -> new BusinessException("Cliente no encontrado con id: " + dto.getIdCliente()));

        if (cliente.getActivo() != 1)
            throw new BusinessException("El cliente no está activo");

        String clabe = generarClabeUnica();
        String numeroCuenta = generarNumeroCuentaUnico();

        Sucursal sucursal = new Sucursal();
        sucursal.setIdSucursal(dto.getIdSucursal());

        Cuenta cuenta = Cuenta.builder()
                .cliente(cliente)
                .sucursal(sucursal)
                .clabe(clabe)
                .numeroCuenta(numeroCuenta)
                .tipoCuenta(dto.getTipoCuenta())
                .build();

        Cuenta guardada = cuentaRepository.save(cuenta);
        log.info("Cuenta creada con CLABE: {}", clabe);
        return toDTO(guardada);
    }

    private String generarClabeUnica() {
        String clabe;
        do {
            clabe = "032180" + String.format("%011d", new Random().nextLong(99999999999L)) + "7";
        } while (cuentaRepository.existsByClabe(clabe));
        return clabe;
    }

    private String generarNumeroCuentaUnico() {
        String num;
        do {
            num = "BNQ" + String.format("%010d", new Random().nextLong(9999999999L));
        } while (cuentaRepository.existsByNumeroCuenta(num));
        return num;
    }

    private CuentaResponseDTO toDTO(Cuenta c) {
        return CuentaResponseDTO.builder()
                .idCuenta(c.getIdCuenta())
                .clabe(c.getClabe())
                .numeroCuenta(c.getNumeroCuenta())
                .tipoCuenta(c.getTipoCuenta())
                .saldo(c.getSaldo())
                .limiteDiario(c.getLimiteDiario())
                .estado(c.getEstado())
                .clienteNombre(c.getCliente().getNombre() + " " + c.getCliente().getApellidoPat())
                .sucursalNombre(c.getSucursal() != null ? c.getSucursal().getNombre() : null)
                .build();
    }
}
