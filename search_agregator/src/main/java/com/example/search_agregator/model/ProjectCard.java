package com.example.search_agregator.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "project_cards")
public class ProjectCard {
    @Id
    private String id; // Уникальный идентификатор

    @Field(type = FieldType.Text, name = "title", analyzer = "russian")
    private String title; // Название (крупно), например "г.Киров, ЖК Знак, МЖД №35"

    @Field(type = FieldType.Text, name = "address", analyzer = "russian")
    private String address; // Адрес фактический

    @Field(type = FieldType.Date, name = "startDate")
    private LocalDate startDate; // Начало строительства

    @Field(type = FieldType.Date, name = "endDate")
    private LocalDate endDate; // Окончание строительства

    @Field(type = FieldType.Text, name = "status", analyzer = "russian")
    private String status; // Статус

    // Для таблицы с показателями. Простая реализация для хакатона.
    // Ключ - название показателя, значение - Map, где ключ - "Секция N", а значение - сам показатель.
    @Field(type = FieldType.Object, name = "indicators")
    private Map<String, Map<String, String>> indicators;

    // Вложенный список ответственных лиц
    @Field(type = FieldType.Nested, name = "responsiblePersons")
    private List<ResponsiblePerson> responsiblePersons;

    // Вложенный список ссылок на документы
    @Field(type = FieldType.Nested, name = "documentLinks")
    private List<DocumentLink> documentLinks;
}
