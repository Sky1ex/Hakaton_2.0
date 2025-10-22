package com.example.search_agregator.model;

import lombok.*;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentLink {
    @Field(type = FieldType.Text, name = "documentType")
    private String documentType; // Например, "Готовые ПВОР" или "Бренд-лист"

    @Field(type = FieldType.Keyword, name = "url")
    private String url;
}
