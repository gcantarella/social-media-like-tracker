
import React from 'react';
import { SocialPlatform } from '../types';
import { FacebookIcon, InstagramIcon, TiktokIcon, LinkedinIcon, XIcon } from './Icons';

interface SocialTabsProps {
    activePlatform: SocialPlatform;
    onPlatformChange: (platform: SocialPlatform) => void;
}

const platformConfig = {
    [SocialPlatform.Facebook]: { icon: FacebookIcon, color: 'bg-blue-600', hoverColor: 'hover:bg-blue-700', ringColor: 'focus:ring-blue-500' },
    [SocialPlatform.Instagram]: { icon: InstagramIcon, color: 'bg-pink-600', hoverColor: 'hover:bg-pink-700', ringColor: 'focus:ring-pink-500' },
    [SocialPlatform.TikTok]: { icon: TiktokIcon, color: 'bg-black', hoverColor: 'hover:bg-gray-800', ringColor: 'focus:ring-white' },
    [SocialPlatform.LinkedIn]: { icon: LinkedinIcon, color: 'bg-sky-700', hoverColor: 'hover:bg-sky-800', ringColor: 'focus:ring-sky-500' },
    [SocialPlatform.X]: { icon: XIcon, color: 'bg-gray-800', hoverColor: 'hover:bg-gray-900', ringColor: 'focus:ring-gray-400' },
};

const SocialTabs: React.FC<SocialTabsProps> = ({ activePlatform, onPlatformChange }) => {
    return (
        <div className="bg-white p-2 rounded-lg flex justify-around shadow-sm max-w-4xl mx-auto">
            {Object.values(SocialPlatform).map(platform => {
                const { icon: Icon, color, hoverColor, ringColor } = platformConfig[platform];
                const isActive = platform === activePlatform;
                return (
                    <button
                        key={platform}
                        onClick={() => onPlatformChange(platform)}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${ringColor} ${
                            isActive ? `${color} text-white shadow-md` : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="hidden sm:inline">{platform}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default SocialTabs;
