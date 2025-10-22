import { useState, useRef, useEffect } from 'react';
import type { PersonFromExcel } from '../utils/excelParser';

interface UsePersonComboboxProps {
  people: PersonFromExcel[];
  excludePeople?: PersonFromExcel[];
}

export const usePersonCombobox = ({ people, excludePeople = [] }: UsePersonComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [filteredPeople, setFilteredPeople] = useState<PersonFromExcel[]>(people);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Получаем уникальные должности из всех людей
  const availableRoles = Array.from(new Set(people.map(person => person.role).filter(role => role && role.trim())));

  // Фильтрация людей по поисковому запросу и должности
  useEffect(() => {
    let filtered = people;

    // Исключаем уже добавленных людей
    if (excludePeople.length > 0) {
      filtered = filtered.filter(person => 
        !excludePeople.some(excluded => 
          excluded.name === person.name && 
          excluded.role === person.role &&
          excluded.phone === person.phone
        )
      );
    }

    // Фильтр по должности
    if (selectedRole) {
      filtered = filtered.filter(person => person.role === selectedRole);
    }

    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(person => 
        person.name.toLowerCase().includes(query) ||
        (person.role && person.role.toLowerCase().includes(query)) ||
        (person.department && person.department.toLowerCase().includes(query)) ||
        (person.phone && person.phone.includes(query)) ||
        (person.email && person.email.toLowerCase().includes(query))
      );
    }

    setFilteredPeople(filtered);
  }, [searchQuery, selectedRole, people, excludePeople]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setSelectedRole('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      setSearchQuery('');
      setSelectedRole('');
    }
  };

  const handleSelectPerson = (person: PersonFromExcel, onSelectPerson: (person: PersonFromExcel | null) => void) => {
    onSelectPerson(person);
    setIsOpen(false);
    setSearchQuery('');
    setSelectedRole('');
  };

  const handleClearSelection = (onSelectPerson: (person: PersonFromExcel | null) => void) => {
    onSelectPerson(null);
    setSearchQuery('');
    setSelectedRole('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
      setSelectedRole('');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRole('');
  };

  return {
    // State
    isOpen,
    searchQuery,
    selectedRole,
    filteredPeople,
    availableRoles,
    
    // Refs
    comboboxRef,
    inputRef,
    
    // Actions
    setIsOpen,
    setSearchQuery,
    setSelectedRole,
    handleToggle,
    handleSelectPerson,
    handleClearSelection,
    handleKeyDown,
    clearFilters
  };
};
