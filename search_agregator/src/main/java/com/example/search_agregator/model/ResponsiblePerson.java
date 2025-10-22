package com.example.search_agregator.model;

import lombok.*;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponsiblePerson {
    @Field(type = FieldType.Text, name = "fio", analyzer = "russian")
    private String fio;

    @Field(type = FieldType.Text, name = "position", analyzer = "russian")
    private String position;

    // Доп. поля, которые будут видны при "развороте"
    @Field(type = FieldType.Keyword, name = "phone")
    private String phone;

    @Field(type = FieldType.Keyword, name = "email")
    private String email;

    @Field(type = FieldType.Text, name = "description")
    private String description;
}
