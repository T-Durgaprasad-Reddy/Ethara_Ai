package com.ethara.taskmanager.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardStats {
    private long totalTasks;
    private Map<String, Long> tasksByStatus;
    private Map<String, Long> tasksPerUser;
    private long overdueTasks;
}
