import React from 'react';
import type { MobileActiveTab } from '../App';
import { useTranslation } from '../contexts/LanguageContext';

interface BottomNavBarProps {
  activeTab: MobileActiveTab;
  setActiveTab: (tab: MobileActiveTab) => void;
}

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.69Z" />
    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
  </svg>
);

const CompassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12 2.25c.787 0 1.54.333 2.095.905a2.25 2.25 0 0 1 .905 2.095A2.25 2.25 0 0 1 13.095 7.5 2.25 2.25 0 0 1 12 5.25a2.25 2.25 0 0 1-.095-2.25 2.25 2.25 0 0 1 .905-2.095A2.25 2.25 0 0 1 12 2.25ZM12 7.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M1.5 13.5a.75.75 0 0 1 .75-.75h2.515a6.73 6.73 0 0 1 1.435-2.435l-1.48-1.48a.75.75 0 0 1 1.06-1.06l1.48 1.48A6.73 6.73 0 0 1 9 7.765V5.25a.75.75 0 0 1 1.5 0v2.515a6.73 6.73 0 0 1 2.435 1.435l1.48-1.48a.75.75 0 1 1 1.06 1.06l-1.48 1.48a6.73 6.73 0 0 1 1.435 2.435H21.75a.75.75 0 0 1 0 1.5h-2.515a6.73 6.73 0 0 1-1.435 2.435l1.48 1.48a.75.75 0 1 1-1.06 1.06l-1.48-1.48a6.73 6.73 0 0 1-2.435 1.435V21.75a.75.75 0 0 1-1.5 0v-2.515a6.73 6.73 0 0 1-2.435-1.435l-1.48 1.48a.75.75 0 1 1-1.06-1.06l1.48-1.48a6.73 6.73 0 0 1-1.435-2.435H2.25a.75.75 0 0 1-.75-.75Zm10.5 1.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
    </svg>
);

const LibraryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H10v-2h8v2zm-4-4H10V8h4v2z"/>
    </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" clipRule="evenodd" />
    </svg>
);

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button onClick={onClick} className={`bottom-nav-item ${isActive ? 'active' : ''}`}>
      <span className="w-6 h-6">{icon}</span>
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
};

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const navItems: { id: MobileActiveTab, label: string, icon: React.ReactNode }[] = [
    { id: 'home', label: t('home'), icon: <HomeIcon /> },
    { id: 'discover', label: t('discover'), icon: <CompassIcon /> },
    { id: 'my_library', label: t('myLibrary'), icon: <LibraryIcon /> },
    { id: 'profile', label: t('people'), icon: <UserIcon /> },
  ];

  return (
    <div className="bottom-nav lg:hidden">
        {navItems.map(item => (
            <NavItem 
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
            />
        ))}
    </div>
  );
};
