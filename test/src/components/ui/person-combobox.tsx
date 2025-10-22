import React from 'react';
import { ChevronDown, Search, X, Filter } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import type { PersonFromExcel } from '../../utils/excelParser';
import { usePersonCombobox } from '../../hooks/usePersonCombobox';

interface PersonComboboxProps {
  people: PersonFromExcel[];
  selectedPerson: PersonFromExcel | null;
  onSelectPerson: (person: PersonFromExcel | null) => void;
  placeholder?: string;
  className?: string;
  excludePeople?: PersonFromExcel[]; // Уже добавленные люди
}

export const PersonCombobox: React.FC<PersonComboboxProps> = ({
  people,
  selectedPerson,
  onSelectPerson,
  placeholder = "Выберите человека...",
  className = "",
  excludePeople = []
}) => {
  const {
    isOpen,
    searchQuery,
    selectedRole,
    filteredPeople,
    availableRoles,
    comboboxRef,
    inputRef,
    setSearchQuery,
    setSelectedRole,
    handleToggle,
    handleSelectPerson,
    handleClearSelection,
    handleKeyDown,
    clearFilters
  } = usePersonCombobox({ people, excludePeople });

  return (
    <div ref={comboboxRef} className={`relative ${className}`}>
      {/* Триггер */}
      <Button
        type="button"
        variant="outline"
        onClick={handleToggle}
        className="w-full justify-between h-10 px-3 py-2 text-left font-normal bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-colors duration-200"
      >
        <span className="truncate">
          {selectedPerson ? (
            <div className="flex flex-col items-start">
              <span className="font-medium">{selectedPerson.name}</span>
              {selectedPerson.role && (
                <span className="text-xs text-gray-500">{selectedPerson.role}</span>
              )}
            </div>
          ) : (
            placeholder
          )}
        </span>
        <div className="flex items-center gap-1">
          {selectedPerson && (
            <X
              className="h-4 w-4 text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                handleClearSelection(onSelectPerson);
              }}
            />
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </Button>

      {/* Выпадающий список */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background/95 backdrop-blur-sm border border-border/50 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Фильтры */}
          <div className="p-2 border-b border-gray-100">
            {/* Поиск */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Поиск по имени, должности, отделу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-colors duration-200"
              />
            </div>
            
            {/* Фильтр по должности */}
            {availableRoles.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-border/50 rounded bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
                >
                  <option value="">Все должности</option>
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {selectedRole && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Список людей */}
          <div className="max-h-48 overflow-y-auto">
            {filteredPeople.length > 0 ? (
              filteredPeople.map((person) => (
                <div
                  key={person.id}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelectPerson(person, onSelectPerson)}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{person.name}</span>
                      {person.phone && (
                        <span className="text-xs text-muted-foreground">{person.phone}</span>
                      )}
                    </div>
                    {person.role && (
                      <span className="text-sm text-muted-foreground">{person.role}</span>
                    )}
                    {person.department && (
                      <span className="text-xs text-muted-foreground">{person.department}</span>
                    )}
                    {person.email && (
                      <span className="text-xs text-muted-foreground">{person.email}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-muted-foreground text-center">
                {searchQuery || selectedRole ? 'Ничего не найдено по заданным фильтрам' : 'Нет доступных людей'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};