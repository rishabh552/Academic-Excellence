import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '@/components/ui/poker-card';

const STORAGE_KEY = 'showcase_selected_projects';

interface ShowcaseContextType {
    selectedProjects: Project[];
    addProject: (project: Project) => void;
    removeProject: (projectCommon: string) => void;
    clearProjects: () => void;
    hasProjects: boolean;
}

const ShowcaseContext = createContext<ShowcaseContextType | null>(null);

export function ShowcaseProvider({ children }: { children: ReactNode }) {
    const [selectedProjects, setSelectedProjects] = useState<Project[]>(() => {
        // Initialize from localStorage
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Sync to localStorage whenever selectedProjects changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProjects));
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    }, [selectedProjects]);

    const addProject = (project: Project) => {
        setSelectedProjects(prev => {
            // Avoid duplicates
            if (prev.some(p => p.common === project.common)) {
                return prev;
            }
            return [...prev, project];
        });
    };

    const removeProject = (projectCommon: string) => {
        setSelectedProjects(prev => prev.filter(p => p.common !== projectCommon));
    };

    const clearProjects = () => {
        setSelectedProjects([]);
    };

    return (
        <ShowcaseContext.Provider
            value={{
                selectedProjects,
                addProject,
                removeProject,
                clearProjects,
                hasProjects: selectedProjects.length > 0
            }}
        >
            {children}
        </ShowcaseContext.Provider>
    );
}

export function useShowcase() {
    const context = useContext(ShowcaseContext);
    if (!context) {
        throw new Error('useShowcase must be used within a ShowcaseProvider');
    }
    return context;
}

// Hook to use in components outside provider (returns empty state if not wrapped)
export function useShowcaseOptional(): ShowcaseContextType {
    const context = useContext(ShowcaseContext);
    if (!context) {
        return {
            selectedProjects: [],
            addProject: () => { },
            removeProject: () => { },
            clearProjects: () => { },
            hasProjects: false
        };
    }
    return context;
}
