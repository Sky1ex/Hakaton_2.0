package com.example.search_agregator.service;


import com.example.search_agregator.model.DocumentLink;
import com.example.search_agregator.model.ProjectCard;
import com.example.search_agregator.model.ResponsiblePerson;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

@Service
@Slf4j
public class ExcelUrlParserServiceImpl implements  ExcelUrlParserService{
    @Override
    public List<ProjectCard> parseFromUrl(String fileUrl) throws MalformedURLException {
        List<ProjectCard> projectCards = new ArrayList<>();

        // 1. Открываем соединение по URL и получаем поток данных
        URL url = new URL(fileUrl);
        try (InputStream inputStream = url.openStream()) {
            // 2. Передаем поток данных в Apache POI
            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
            Sheet sheet = workbook.getSheetAt(0); // Берем первый лист

            int firstRow = sheet.getFirstRowNum();
            int lastRow = sheet.getLastRowNum();

            for (int i = firstRow + 2; i <= lastRow; i++) {
                Row row = sheet.getRow(i);
                if (row == null || row.getCell(0) == null || row.getCell(0).toString().trim().isEmpty()) {
                    continue;
                }

                // Skip header rows - check if first cell contains header text
                String firstCellValue = getStringCellValue(row.getCell(0)).toLowerCase().trim();
                if (firstCellValue.equals("id") || firstCellValue.equals("title") || 
                    firstCellValue.equals("address") || firstCellValue.equals("startdate") ||
                    firstCellValue.equals("enddate") || firstCellValue.equals("status") ||
                    firstCellValue.equals("responsiblepersons") || firstCellValue.equals("documentlinks") ||
                    firstCellValue.equals("indicators")) {
                    log.debug("Skipping header row: " + firstCellValue);
                    continue;
                }

                ProjectCard card = new ProjectCard();
                card.setId(getStringCellValue(row.getCell(0)));
                card.setTitle(getStringCellValue(row.getCell(1)));
                card.setAddress(getStringCellValue(row.getCell(2)));
                card.setStartDate(getDateCellValue(row.getCell(3)));
                card.setEndDate(getDateCellValue(row.getCell(4)));
                card.setStatus(getStringCellValue(row.getCell(5)));
                card.setResponsiblePersons(parseResponsiblePersons(getStringCellValue(row.getCell(6))));
                card.setDocumentLinks(parseDocumentLinks(getStringCellValue(row.getCell(7))));
                String indicatorsRaw = getStringCellValue(row.getCell(8));
                card.setIndicators(parseIndicators(indicatorsRaw));

                projectCards.add(card);
            }
            return projectCards;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public String getStringCellValue(Cell cell) {// Вспомогательные методы для безопасного получения данных из ячеек
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                // Проверяем, является ли это датой
                if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
                    // Если это дата, возвращаем отформатированную строку
                    return cell.getDateCellValue().toString();
                } else {
                    // Преобразуем числовое значение в строку без ".0"
                    double numericValue = cell.getNumericCellValue();
                    if (numericValue == (long) numericValue) {
                        return String.valueOf((long) numericValue);
                    } else {
                        return String.valueOf(numericValue);
                    }
                }
            default:
                return cell.toString();
        }
    }

    @Override
    public LocalDate getDateCellValue(Cell cell) {
        if (cell == null) return null;
        
        try {
            // Сначала проверяем, является ли ячейка датой в Excel
            if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC && 
                org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
                // Это числовая дата в Excel - используем встроенный метод POI
                return cell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            } else if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC) {
                // Это числовое значение, но не дата - возможно, это серийный номер даты Excel
                double numericValue = cell.getNumericCellValue();
                if (numericValue > 0) {
                    // Преобразуем серийный номер Excel в дату
                    java.util.Date excelDate = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(numericValue);
                    return excelDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                }
            } else if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.STRING) {
                // Это строка - пытаемся распарсить как дату
                String dateString = cell.getStringCellValue().trim();
                if (dateString.isEmpty()) {
                    return null;
                }
                
                // Пробуем разные форматы дат
                String[] patterns = {"M/d/yyyy", "MM/dd/yyyy", "d/M/yyyy", "dd/MM/yyyy", "yyyy-MM-dd"};
                for (String pattern : patterns) {
                    try {
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
                        return LocalDate.parse(dateString, formatter);
                    } catch (Exception ignored) {
                        // Продолжаем с следующим форматом
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Не удалось преобразовать ячейку '" + cell.toString() + "' в дату: " + e.getMessage());
        }
        
        return null;
    }

    @Override
    public List<ResponsiblePerson> parseResponsiblePersons(String data) {// Эти методы парсинга строк с разделителями остаются такими же
        if (data == null || data.trim().isEmpty()) {
            return Collections.emptyList();
        }
        String[] personsStr = data.split("\\s*;\\s*|\\s*\\n\\s*"); // Разделитель ; или перенос строки
        List<ResponsiblePerson> persons = new ArrayList<>();
        for (String pStr : personsStr) {
            String[] parts = pStr.split("\\s*\\|\\s*");
            if (parts.length >= 4) {
                persons.add(new ResponsiblePerson(parts[0], parts[1], parts[2], parts[3], ""));
            }
        }
        return persons;
    }

    @Override
    public List<DocumentLink> parseDocumentLinks(String data) {
        if (data == null || data.trim().isEmpty()) {
            return Collections.emptyList();
        }
        String[] linksStr = data.split("\\s*;\\s*|\\s*\\n\\s*");
        List<DocumentLink> links = new ArrayList<>();
        for (String lStr : linksStr) {
            String[] parts = lStr.split("\\s*\\|\\s*");
            if (parts.length >= 2) {
                links.add(new DocumentLink(parts[0], parts[1]));
            }
        }
        return links;
    }

    @Override
    public java.util.Map<String, java.util.Map<String, String>> parseIndicators(String data) {
        if (data == null || data.trim().isEmpty()) {
            log.debug("indicators data is null or empty");
            return java.util.Collections.emptyMap();
        }
        
        log.debug("Raw indicators data: '" + data + "'");
        
        try {
            String cleanedData = cleanJsonString(data);
            log.debug("Cleaned indicators data: '" + cleanedData + "'");
            
            ObjectMapper mapper = new ObjectMapper();
            
            // Try to parse as array of indicator objects first
            if (cleanedData.trim().startsWith("[")) {
                java.util.List<java.util.Map<String, Object>> indicatorsArray = mapper.readValue(
                        cleanedData,
                        new TypeReference<java.util.List<java.util.Map<String, Object>>>() {}
                );
                
                java.util.Map<String, java.util.Map<String, String>> result = new java.util.HashMap<>();
                
                for (java.util.Map<String, Object> indicator : indicatorsArray) {
                    String indicatorName = (String) indicator.get("indicator_name");
                    if (indicatorName != null) {
                        java.util.Map<String, String> sections = new java.util.HashMap<>();
                        
                        // Add sections
                        @SuppressWarnings("unchecked")
                        java.util.List<java.util.Map<String, Object>> sectionsList = 
                            (java.util.List<java.util.Map<String, Object>>) indicator.get("sections");
                        if (sectionsList != null) {
                            for (java.util.Map<String, Object> section : sectionsList) {
                                String sectionNumber = (String) section.get("number");
                                String amount = (String) section.get("amount");
                                if (sectionNumber != null && amount != null) {
                                    sections.put(sectionNumber, amount);
                                }
                            }
                        }
                        
                        // Add total
                        String total = (String) indicator.get("total");
                        if (total != null) {
                            sections.put("total", total);
                        }
                        
                        result.put(indicatorName, sections);
                    }
                }
                
                log.debug("Successfully parsed indicators from array format: " + result);
                return result;
            } else {
                // Try to parse as the old object format
                java.util.Map<String, java.util.Map<String, String>> result = mapper.readValue(
                        cleanedData,
                        new TypeReference<java.util.Map<String, java.util.Map<String, String>>>() {}
                );
                log.debug("Successfully parsed indicators from object format: " + result);
                return result;
            }
        } catch (Exception e) {
            log.error("Failed to parse indicators JSON: " + e.getMessage());
            log.error("Raw data was: '" + data + "'");
            return java.util.Collections.emptyMap();
        }
    }
    
    private String cleanJsonString(String json) {
        if (json == null) return null;
        
        // Remove trailing commas before closing brackets/braces
        String cleaned = json.replaceAll(",\\s*([\\}\\]])", "$1");
        
        // Fix specific issue: "amount": "- } -> "amount": "-" }
        cleaned = cleaned.replaceAll("\"amount\":\\s*\"-\\s+\\}", "\"amount\": \"-\"}");
        
        return cleaned;
    }
}
