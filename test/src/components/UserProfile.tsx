import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface UserProfileProps {
  firstName?: string;
  lastName?: string;
  position?: string;
  avatarUrl?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  firstName = "Иван",
  lastName = "Петров", 
  position = "Руководитель проекта",
  avatarUrl
}) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  
  return (
    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200/60 shadow-sm">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
        <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {/* Скрываем текст на мобильных устройствах */}
      <div className="hidden md:flex flex-col">
        <div className="font-semibold text-gray-900 text-sm">
          {lastName} {firstName}
        </div>
        <div className="text-xs text-gray-600">
          {position}
        </div>
      </div>
    </div>
  );
};
