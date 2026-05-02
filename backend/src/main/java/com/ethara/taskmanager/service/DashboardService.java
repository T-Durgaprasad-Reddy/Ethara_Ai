package com.ethara.taskmanager.service;

import com.ethara.taskmanager.dto.DashboardStats;
import com.ethara.taskmanager.entity.Status;
import com.ethara.taskmanager.entity.Task;
import com.ethara.taskmanager.repository.TaskRepository;
import com.ethara.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    @Autowired
    private TaskRepository taskRepository;

    public DashboardStats getStats() {
        List<Task> allTasks = taskRepository.findAll();

        Map<String, Long> tasksByStatus = allTasks.stream()
                .collect(Collectors.groupingBy(t -> t.getStatus().name(), Collectors.counting()));

        Map<String, Long> tasksPerUser = allTasks.stream()
                .collect(Collectors.groupingBy(t -> t.getAssignedTo().getName(), Collectors.counting()));

        long overdueTasks = allTasks.stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now()) && t.getStatus() != Status.DONE)
                .count();

        return DashboardStats.builder()
                .totalTasks(allTasks.size())
                .tasksByStatus(tasksByStatus)
                .tasksPerUser(tasksPerUser)
                .overdueTasks(overdueTasks)
                .build();
    }
}
