package com.ethara.taskmanager.controller;

import com.ethara.taskmanager.dto.ProjectRequest;
import com.ethara.taskmanager.entity.Project;
import com.ethara.taskmanager.security.UserDetailsImpl;
import com.ethara.taskmanager.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectRequest request, 
                                          @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Project project = projectService.createProject(request.getName(), request.getDescription(), userDetails.getId());
        return ResponseEntity.ok(project);
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        if (role.equals("ROLE_ADMIN")) {
            return ResponseEntity.ok(projectService.getAllProjects());
        } else {
            return ResponseEntity.ok(projectService.getProjectsByUser(userDetails.getId()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addMember(@PathVariable Long id,
                                       @RequestBody Map<String, Long> body,
                                       @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Project project = projectService.addMember(id, body.get("userId"), userDetails.getId());
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> removeMember(@PathVariable Long id,
                                          @PathVariable Long userId,
                                          @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Project project = projectService.removeMember(id, userId, userDetails.getId());
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
