package com.example.search_agregator.repository;

import com.example.search_agregator.model.ProjectCard;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface ProjectCardRepository extends ElasticsearchRepository<ProjectCard, String> {
    /**
     * Комбинированный "умный" поиск, который ищет:
     * 1. Текстовые совпадения в основных полях (title, address, status).
     * 2. Текстовые совпадения во вложенных полях ответственных лиц (fio).
     * 3. Точные совпадения для email и телефона.
     */
    @Query("""
    {
      "bool": {
        "should": [
          {
            "multi_match": {
              "query": "?0",
              "fields": ["title", "address", "status"],
              "fuzziness": "AUTO"
            }
          },
          {
            "nested": {
              "path": "responsiblePersons",
              "query": {
                "multi_match": {
                  "query": "?0",
                  "fields": ["responsiblePersons.fio", "responsiblePersons.position"],
                  "fuzziness": "AUTO"
                }
              }
            }
          },
          {
            "nested": {
              "path": "responsiblePersons",
              "query": {
                "multi_match": {
                  "query": "?0",
                  "fields": ["responsiblePersons.phone", "responsiblePersons.email"],
                  "type": "phrase"
                }
              }
            }
          }
        ]
      }
    }
    """)
    List<ProjectCard> findByQuery(String query);
}
