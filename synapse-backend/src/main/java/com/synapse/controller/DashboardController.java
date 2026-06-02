package com.synapse.controller;

import com.synapse.model.Dashboard;
import com.synapse.model.Usuario;
import com.synapse.repository.DashboardRepository;
import com.synapse.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // Importante para podermos receber o novo tempo
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboards")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardRepository dashboardRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 1. Listar os dashboards de um usuário
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Dashboard>> listarPorUsuario(@PathVariable UUID usuarioId) {
        List<Dashboard> dashboards = dashboardRepository.findByUsuarioIdOrderByOrdemExibicaoAsc(usuarioId);
        return ResponseEntity.ok(dashboards);
    }

    // 2. Adicionar um novo dashboard
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<Dashboard> adicionarDashboard(@PathVariable UUID usuarioId, @RequestBody Dashboard dashboard) {
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);

        if (usuario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        dashboard.setUsuario(usuario.get());

        // Define a ordem como o último da lista
        long totalDashboards = dashboardRepository.findByUsuarioIdOrderByOrdemExibicaoAsc(usuarioId).size();
        dashboard.setOrdemExibicao((int) totalDashboards + 1);

        Dashboard salvo = dashboardRepository.save(dashboard);
        return ResponseEntity.ok(salvo);
    }

    // 3. Deletar um dashboard
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDashboard(@PathVariable UUID id) {
        if (dashboardRepository.existsById(id)) {
            dashboardRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // 4. Editar apenas o tempo do dashboard
    @PutMapping("/{id}/tempo")
    public ResponseEntity<Dashboard> atualizarTempo(@PathVariable UUID id, @RequestBody Map<String, Integer> payload) {
        Optional<Dashboard> dashboardOpt = dashboardRepository.findById(id);

        if (dashboardOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Dashboard dashboard = dashboardOpt.get();
        // Pega o novo tempo enviado pelo React e atualiza
        dashboard.setDuracaoSegundos(payload.get("duracaoSegundos"));

        Dashboard salvo = dashboardRepository.save(dashboard);
        return ResponseEntity.ok(salvo);
    }
}