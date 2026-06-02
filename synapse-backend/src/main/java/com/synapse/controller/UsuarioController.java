package com.synapse.controller;

import com.synapse.model.Usuario;
import com.synapse.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Apenas faz o Login. Se não achar o PIN, retorna erro 404.
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String pin = payload.get("pin");

        if (pin == null || pin.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("PIN não pode ser vazio.");
        }

        Optional<Usuario> usuarioExistente = usuarioRepository.findByPin(pin);

        if (usuarioExistente.isPresent()) {
            return ResponseEntity.ok(usuarioExistente.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("PIN não encontrado. Faça o cadastro primeiro.");
        }
    }

    // Novo Endpoint exclusivo para Cadastro
    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@RequestBody Map<String, String> payload) {
        String pin = payload.get("pin");

        if (pin == null || pin.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("PIN não pode ser vazio.");
        }

        Optional<Usuario> usuarioExistente = usuarioRepository.findByPin(pin);

        if (usuarioExistente.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Este PIN já está em uso.");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setPin(pin);
        usuarioRepository.save(novoUsuario);

        return ResponseEntity.ok(novoUsuario);
    }
}