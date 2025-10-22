package com.example.search_agregator.service;

import com.example.search_agregator.model.ProjectCard;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class GoogleSheetsService {
    
    @Value("${spreadsheet.link}")
    private String spreadsheetUrl;
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    public GoogleSheetsService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(30))
                .build();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Adds a new project to Google Sheets
     * This implementation uses a webhook approach - you can create a Google Apps Script
     * that receives POST requests and adds data to your sheet
     */
    public boolean addProjectToSheets(ProjectCard project) {
        try {
            log.info("Attempting to add project to Google Sheets: {}", project.getTitle());
            
            // Convert project to the format expected by your Google Sheets
            Map<String, Object> rowData = convertProjectToRowData(project);
            
            // Option 1: Send to a webhook endpoint (Google Apps Script)
            String webhookUrl = getWebhookUrl();
            if (webhookUrl != null && !webhookUrl.isEmpty()) {
                return sendToWebhook(webhookUrl, rowData);
            }
            
            // Option 2: Log the data for manual addition (fallback)
            log.info("Project data for Google Sheets (manual addition):");
            log.info("ID: {}", rowData.get("id"));
            log.info("Title: {}", rowData.get("title"));
            log.info("Address: {}", rowData.get("address"));
            log.info("Start Date: {}", rowData.get("startDate"));
            log.info("End Date: {}", rowData.get("endDate"));
            log.info("Status: {}", rowData.get("status"));
            log.info("Responsible Persons: {}", rowData.get("responsiblePersons"));
            log.info("Document Links: {}", rowData.get("documentLinks"));
            log.info("Indicators: {}", rowData.get("indicators"));
            
            log.info("Project data prepared for Google Sheets: {}", objectMapper.writeValueAsString(rowData));
            return true;
            
        } catch (Exception e) {
            log.error("Failed to add project to Google Sheets: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Get webhook URL from environment variable or configuration
     */
    private String getWebhookUrl() {
        // You can set this in application.yml or environment variable
        // For example: GOOGLE_SHEETS_WEBHOOK_URL
        return System.getenv("GOOGLE_SHEETS_WEBHOOK_URL");
    }
    
    /**
     * Send data to webhook (Google Apps Script endpoint)
     */
    private boolean sendToWebhook(String webhookUrl, Map<String, Object> rowData) {
        try {
            String jsonPayload = objectMapper.writeValueAsString(rowData);
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(webhookUrl))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(30))
                    .build();
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Successfully sent project to Google Sheets webhook");
                return true;
            } else {
                log.error("Failed to send to Google Sheets webhook. Status: {}, Response: {}", 
                         response.statusCode(), response.body());
                return false;
            }
            
        } catch (Exception e) {
            log.error("Error sending to Google Sheets webhook: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Converts ProjectCard to the row format expected by Google Sheets
     */
    private Map<String, Object> convertProjectToRowData(ProjectCard project) {
        Map<String, Object> rowData = new HashMap<>();
        
        rowData.put("id", project.getId());
        rowData.put("title", project.getTitle());
        rowData.put("address", project.getAddress());
        rowData.put("startDate", project.getStartDate() != null ? project.getStartDate().toString() : "");
        rowData.put("endDate", project.getEndDate() != null ? project.getEndDate().toString() : "");
        rowData.put("status", project.getStatus());
        
        // Convert responsible persons to string format
        if (project.getResponsiblePersons() != null && !project.getResponsiblePersons().isEmpty()) {
            StringBuilder personsStr = new StringBuilder();
            for (int i = 0; i < project.getResponsiblePersons().size(); i++) {
                var person = project.getResponsiblePersons().get(i);
                if (i > 0) personsStr.append("; ");
                personsStr.append(person.getFio()).append(" | ")
                         .append(person.getPosition()).append(" | ")
                         .append(person.getPhone()).append(" | ")
                         .append(person.getEmail());
            }
            rowData.put("responsiblePersons", personsStr.toString());
        } else {
            rowData.put("responsiblePersons", "");
        }
        
        // Convert document links to string format
        if (project.getDocumentLinks() != null && !project.getDocumentLinks().isEmpty()) {
            StringBuilder linksStr = new StringBuilder();
            for (int i = 0; i < project.getDocumentLinks().size(); i++) {
                var link = project.getDocumentLinks().get(i);
                if (i > 0) linksStr.append("; ");
                linksStr.append(link.getDocumentType()).append(" | ").append(link.getUrl());
            }
            rowData.put("documentLinks", linksStr.toString());
        } else {
            rowData.put("documentLinks", "");
        }
        
        // Convert indicators to JSON string
        if (project.getIndicators() != null && !project.getIndicators().isEmpty()) {
            try {
                rowData.put("indicators", objectMapper.writeValueAsString(project.getIndicators()));
            } catch (Exception e) {
                log.error("Failed to convert indicators to JSON: {}", e.getMessage());
                rowData.put("indicators", "");
            }
        } else {
            rowData.put("indicators", "");
        }
        
        return rowData;
    }
}
