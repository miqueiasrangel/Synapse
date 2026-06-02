package com.synapse.repository;

import com.synapse.model.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DashboardRepository extends JpaRepository<Dashboard, UUID> {
    // Busca os dashboards de um usuário específico, já ordenados para o "Play"
    List<Dashboard> findByUsuarioIdOrderByOrdemExibicaoAsc(UUID usuarioId);
}