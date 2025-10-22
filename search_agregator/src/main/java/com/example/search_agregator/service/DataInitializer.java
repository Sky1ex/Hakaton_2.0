package com.example.search_agregator.service;

import com.example.search_agregator.model.DocumentLink;
import com.example.search_agregator.model.ProjectCard;
import com.example.search_agregator.model.ResponsiblePerson;
import com.example.search_agregator.repository.ProjectCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.StreamSupport;


@Slf4j
@Service
public class DataInitializer implements CommandLineRunner {
    private final ProjectCardRepository projectCardRepository;
    private final ExcelUrlParserService excelUrlParserService;
    private final String SPREADSHEET_EXPORT_URL;
    public DataInitializer(ProjectCardRepository projectCardRepository,
                           ExcelUrlParserService excelUrlParserService,
                           @Value("${spreadsheet.link}") String spreadsheetExportUrl) {
        this.projectCardRepository = projectCardRepository;
        this.excelUrlParserService = excelUrlParserService;
        this.SPREADSHEET_EXPORT_URL = spreadsheetExportUrl;
    }
    @Override
    public void run(String... args) throws Exception {
       try {
           log.info("--- Начинаю парсинг Excel по URL: " + SPREADSHEET_EXPORT_URL);
           List<ProjectCard> cards = excelUrlParserService.parseFromUrl(SPREADSHEET_EXPORT_URL);

           if (cards.isEmpty()) {
               log.debug("--- Данные из Excel не получены или таблица пуста ---");
               return;
           }
           log.debug("--- Успешно загружено %d карточек из Excel ---\n", cards.size());

           projectCardRepository.deleteAll();
           log.info("--- Старый индекс очищен ---");

           projectCardRepository.saveAll(cards);
           log.info("--- Новые данные успешно загружены в Elasticsearch! ---");
       }
       catch (Exception e){
            log.error("ОШИБКА при загрузке данных из Excel по URL: " + e.getMessage());
       }
    }

    public String generateNextId() {
        Iterable<ProjectCard> iterable = projectCardRepository.findAll();
        List<ProjectCard> allProjects = StreamSupport.stream(iterable.spliterator(), false).toList();

        if (allProjects.isEmpty()) {
            return "1";
        }

        // Находим максимальный числовой ID
        int maxId = allProjects.stream()
                .map(ProjectCard::getId)
                .filter(id -> id != null && !id.trim().isEmpty())
                .mapToInt(id -> {
                    try {
                        return Integer.parseInt(id);
                    } catch (NumberFormatException e) {
                        return 0; // Игнорируем нечисловые ID
                    }
                })
                .max()
                .orElse(0);

        return String.valueOf(maxId + 1);
    }
}
