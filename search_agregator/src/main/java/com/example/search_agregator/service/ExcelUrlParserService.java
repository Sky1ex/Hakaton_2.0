package com.example.search_agregator.service;

import com.example.search_agregator.model.DocumentLink;
import com.example.search_agregator.model.ProjectCard;
import com.example.search_agregator.model.ResponsiblePerson;
import org.apache.poi.ss.usermodel.Cell;

import java.net.MalformedURLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface ExcelUrlParserService {
    List<ProjectCard> parseFromUrl(String fileUrl) throws MalformedURLException;
    String getStringCellValue(Cell cell);
    LocalDate getDateCellValue(Cell cell);
    List<ResponsiblePerson> parseResponsiblePersons(String data);
    List<DocumentLink> parseDocumentLinks(String data);
    Map<String, Map<String, String>> parseIndicators(String data);
}
