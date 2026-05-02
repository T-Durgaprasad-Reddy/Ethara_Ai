package com.ethara.taskmanager.service;

import com.ethara.taskmanager.dto.TaskRequest;
import com.ethara.taskmanager.entity.Project;
import com.ethara.taskmanager.entity.Task;
import com.ethara.taskmanager.entity.User;
import com.ethara.taskmanager.repository.ProjectRepository;
import com.ethara.taskmanager.repository.TaskRepository;
import com.ethara.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public Task createTask(TaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        User assignedTo = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setProject(project);
        task.setAssignedTo(assignedTo);

        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByUser(Long userId) {
        return taskRepository.findByAssignedToId(userId);
    }

    public Task updateTask(Long id, TaskRequest request, Long currentUserId, String role) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Permission check
        boolean isAdmin = role.equals("ROLE_ADMIN");
        boolean isAssignedUser = task.getAssignedTo().getId().equals(currentUserId);

        if (!isAdmin && !isAssignedUser) {
            throw new RuntimeException("Unauthorized to update this task");
        }

        if (isAdmin) {
            task.setTitle(request.getTitle());
            task.setDescription(request.getDescription());
            task.setDueDate(request.getDueDate());
            task.setPriority(request.getPriority());
            
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            task.setProject(project);
            task.setAssignedTo(assignedTo);
        }

        // Both Admin and Assigned User can update status
        task.setStatus(request.getStatus());

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
