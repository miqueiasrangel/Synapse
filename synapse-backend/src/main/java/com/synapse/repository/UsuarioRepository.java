package com.synapse.repository;

import com.synapse.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
    // Método customizado para buscar um usuário pelo PIN
    Optional<Usuario> findByPin(String pin);
}