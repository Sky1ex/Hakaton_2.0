package com.example.search_agregator.controller;

import com.example.search_agregator.model.ProjectCard;
import com.example.search_agregator.repository.ProjectCardRepository;
import com.example.search_agregator.service.DataInitializer;
import com.example.search_agregator.service.GoogleSheetsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.StreamSupport;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/projects")
public class SearchController {
    private final ProjectCardRepository projectCardRepository;
    private final DataInitializer dataInitializer;
    private final GoogleSheetsService googleSheetsService;
    @GetMapping("/search")
    public List<ProjectCard> searchProjects(@RequestParam(name = "q", required = false) String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return projectCardRepository.findByQuery(query);
    }

    @PostMapping
    public ResponseEntity<ProjectCard> createProject(@RequestBody ProjectCard projectCard) {
        try {
            if (projectCard.getId() == null || projectCard.getId().trim().isEmpty()) {
                String newId = dataInitializer.generateNextId();
                projectCard.setId(newId);
            }
            
            ProjectCard savedProject = projectCardRepository.save(projectCard);
            
            boolean sheetsSuccess = googleSheetsService.addProjectToSheets(savedProject);
            if (!sheetsSuccess) {
                log.error("Warning: Failed to add project to Google Sheets, but saved to Elasticsearch");
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    

    @GetMapping
    public List<ProjectCard> getAllProjects() {
        Iterable<ProjectCard> iterable = projectCardRepository.findAll();
        return StreamSupport.stream(iterable.spliterator(), false)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectCard> getProjectById(@PathVariable String id) {
        return projectCardRepository.findById(id)
                .map(project -> ResponseEntity.ok().body(project))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        try {
            if (projectCardRepository.existsById(id)) {
                projectCardRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
