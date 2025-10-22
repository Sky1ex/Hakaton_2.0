import { useState, useEffect } from 'react';
import { ExcelParser, type PersonFromExcel } from '../utils/excelParser';

export const useExcelData = () => {
  const [people, setPeople] = useState<PersonFromExcel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExcelData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const parser = ExcelParser.getInstance();
      
      // Попробуем разные пути к файлу
      const possiblePaths = [
        '/Состав команд.xlsx',
        './Состав команд.xlsx',
        'Состав команд.xlsx'
      ];
      
      let peopleData: PersonFromExcel[] = [];
      
      for (const path of possiblePaths) {
        try {
          peopleData = await parser.parseExcelFile(path);
          if (peopleData.length > 0) {
            break;
          }
        } catch (err) {
          // Продолжаем попытки с другими путями
        }
      }
      
      // Если не удалось загрузить данные из Excel, используем тестовые данные
      if (peopleData.length === 0) {
        peopleData = [
          {
            id: 'test_1',
            name: 'Иванов Иван Иванович',
            role: 'Руководитель проекта',
            department: 'Отдел разработки',
            phone: '+7 (999) 123-45-67',
            email: 'ivanov@company.com'
          },
          {
            id: 'test_2',
            name: 'Петрова Анна Сергеевна',
            role: 'Аналитик',
            department: 'Отдел аналитики',
            phone: '+7 (999) 234-56-78',
            email: 'petrova@company.com'
          },
          {
            id: 'test_3',
            name: 'Сидоров Петр Александрович',
            role: 'Разработчик',
            department: 'Отдел разработки',
            phone: '+7 (999) 345-67-89',
            email: 'sidorov@company.com'
          },
          {
            id: 'test_4',
            name: 'Козлова Мария Дмитриевна',
            role: 'Дизайнер',
            department: 'Отдел дизайна',
            phone: '+7 (999) 456-78-90',
            email: 'kozlova@company.com'
          },
          {
            id: 'test_5',
            name: 'Морозов Алексей Владимирович',
            role: 'Тестировщик',
            department: 'Отдел тестирования',
            phone: '+7 (999) 567-89-01',
            email: 'morozov@company.com'
          }
        ];
      }
      
      setPeople(peopleData);
    } catch (err) {
      const errorMessage = `Ошибка при загрузке данных из Excel файла: ${err}`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExcelData();
  }, []);

  return {
    people,
    isLoading,
    error,
    reloadData: loadExcelData
  };
};