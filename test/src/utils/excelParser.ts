import * as XLSX from 'xlsx';

export interface PersonFromExcel {
  id: string;
  name: string;
  role?: string;
  department?: string;
  phone?: string;
  email?: string;
}

export class ExcelParser {
  private static instance: ExcelParser;
  private peopleData: PersonFromExcel[] = [];

  private constructor() {}

  public static getInstance(): ExcelParser {
    if (!ExcelParser.instance) {
      ExcelParser.instance = new ExcelParser();
    }
    return ExcelParser.instance;
  }

  public async parseExcelFile(filePath: string): Promise<PersonFromExcel[]> {
    try {
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Получаем первый лист
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Конвертируем в JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (!jsonData || jsonData.length === 0) {
        return [];
      }
      
      // Парсим данные (предполагаем, что первая строка - заголовки)
      const headers = jsonData[0] as string[];
      const dataRows = jsonData.slice(1) as any[][];
      
      if (!headers || headers.length === 0) {
        return [];
      }
      
      this.peopleData = dataRows
        .filter(row => row && row.length > 0) // Фильтруем пустые строки
        .map((row, index) => {
          const person: PersonFromExcel = {
            id: `person_${index}`,
            name: '',
            role: '',
            department: '',
            phone: '',
            email: ''
          };

          // Маппим колонки на поля - более гибкий подход
          headers.forEach((header, colIndex) => {
            const value = row[colIndex]?.toString().trim() || '';
            
            if (value) {
              const headerLower = header ? header.toLowerCase() : '';
              
              // Сначала проверяем первую колонку как имя (даже если заголовок пустой)
              if (colIndex === 0) {
                person.name = value;
              }
              // Должность
              else if (headerLower.includes('должность') || headerLower.includes('роль') || 
                       headerLower.includes('позиция') || headerLower.includes('position') ||
                       headerLower.includes('должн')) {
                person.role = value;
              } 
              // Отдел
              else if (headerLower.includes('отдел') || headerLower.includes('департамент') || 
                       headerLower.includes('подразделение') || headerLower.includes('department') ||
                       headerLower.includes('команда') || headerLower.includes('team')) {
                person.department = value;
              } 
              // Телефон
              else if (headerLower.includes('телефон') || headerLower.includes('тел') || 
                       headerLower.includes('phone') || headerLower.includes('мобильный') ||
                       headerLower.includes('контакт')) {
                person.phone = value;
              } 
              // Email
              else if (headerLower.includes('почта') || headerLower.includes('email') || 
                       headerLower.includes('e-mail') || headerLower.includes('mail') ||
                       headerLower.includes('электронная почта')) {
                person.email = value;
              }
              // Если имя еще не заполнено, используем любую колонку с именем в заголовке
              else if (!person.name && (headerLower.includes('имя') || headerLower.includes('фио') || 
                  headerLower.includes('фамилия') || headerLower.includes('name') ||
                  headerLower.includes('ф.и.о') || headerLower.includes('полное имя'))) {
                person.name = value;
              }
            }
          });

          return person;
        })
        .filter(person => person.name && person.name.length > 0); // Фильтруем записи без имени

      return this.peopleData;
    } catch (error) {
      console.error('Ошибка при парсинге Excel файла:', error);
      return [];
    }
  }

  public getPeopleData(): PersonFromExcel[] {
    return this.peopleData;
  }

  public searchPeople(query: string): PersonFromExcel[] {
    if (!query.trim()) {
      return this.peopleData;
    }

    const searchTerm = query.toLowerCase();
    return this.peopleData.filter(person => 
      person.name.toLowerCase().includes(searchTerm) ||
      (person.role && person.role.toLowerCase().includes(searchTerm)) ||
      (person.department && person.department.toLowerCase().includes(searchTerm)) ||
      (person.phone && person.phone.includes(searchTerm)) ||
      (person.email && person.email.toLowerCase().includes(searchTerm))
    );
  }
}
