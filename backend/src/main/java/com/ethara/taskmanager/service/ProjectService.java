package com.ethara.taskmanager.service;

import com.ethara.taskmanager.entity.Project;
import com.ethara.taskmanager.entity.User;
import com.ethara.taskmanager.repository.ProjectRepository;
import com.ethara.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public Project createProject(String name, String description, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setAdmin(admin);
        project.getMembers().add(admin); // Admin is also a member
        
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getProjectsByAdmin(Long adminId) {
        return projectRepository.findByAdminId(adminId);
    }

    public List<Project> getProjectsByUser(Long userId) {
        return projectRepository.findByMembers_Id(userId);
    }

    public Project addMember(Long projectId, Long userId, Long requestingAdminId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        if (!project.getAdmin().getId().equals(requestingAdminId)) {
            throw new RuntimeException("Only the project admin can add members");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!project.getMembers().contains(user)) {
            project.getMembers().add(user);
        }
        
        return projectRepository.save(project);
    }

    public Project removeMember(Long projectId, Long userId, Long requestingAdminId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        if (!project.getAdmin().getId().equals(requestingAdminId)) {
            throw new RuntimeException("Only the project admin can remove members");
        }

        if (project.getAdmin().getId().equals(userId)) {
            throw new RuntimeException("Cannot remove the project admin");
        }

        project.getMembers().removeIf(m -> m.getId().equals(userId));
        return projectRepository.save(project);
    }

    public Project getProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }
}
