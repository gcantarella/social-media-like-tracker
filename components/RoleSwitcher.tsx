import React from 'react';
import { UserRole } from '../types';

interface RoleSwitcherProps {
    userRole: UserRole;
    onRoleChange: (role: UserRole) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ userRole, onRoleChange }) => {
    return (
        <div className="flex justify-center">
            <div className="bg-gray-200 p-1 rounded-lg flex items-center space-x-1" role="radiogroup" aria-label="User Role">
                <button
                    onClick={() => onRoleChange(UserRole.Admin)}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors duration-200 ${
                        userRole === UserRole.Admin ? 'bg-white text-gray-900 shadow' : 'bg-transparent text-gray-600 hover:bg-gray-300'
                    }`}
                    role="radio"
                    aria-checked={userRole === UserRole.Admin}
                >
                    Admin
                </button>
                <button
                    onClick={() => onRoleChange(UserRole.Moderator)}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors duration-200 ${
                        userRole === UserRole.Moderator ? 'bg-white text-gray-900 shadow' : 'bg-transparent text-gray-600 hover:bg-gray-300'
                    }`}
                    role="radio"
                    aria-checked={userRole === UserRole.Moderator}
                >
                    Moderator
                </button>
            </div>
        </div>
    );
};

export default RoleSwitcher;
