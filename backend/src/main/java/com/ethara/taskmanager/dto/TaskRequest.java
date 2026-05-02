package com.ethara.taskmanager.dto;

import com.ethara.taskmanager.entity.Priority;
import com.ethara.taskmanager.entity.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskRequest {
    @NotBlank
    private String title;

    private String description;

    @NotNull
    private LocalDate dueDate;

    @NotNull
    private Priority priority;

    @NotNull
    private Status status;

    @NotNull
    private Long projectId;

    @NotNull
    private Long assignedToId;
}
