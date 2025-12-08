import { createContext, useContext, useState, ReactNode } from 'react';

export interface ProjectWizardData {
    // Step 1: Project Selection
    projectType: string | null;
    projectCategory: string | null;

    // Step 2: Project Details (from case study)
    projectTitle: string | null;
    projectDescription: string | null;

    // Step 3: Package Selection
    selectedPackage: 'basic' | 'professional' | 'enterprise' | null;
    billingCycle: 'monthly' | 'annually';

    // Step 4: Contact Info
    name: string;
    email: string;
    phone: string;
    message: string;

    // Wizard State
    currentStep: number;
    completedSteps: number[];
}

interface ProjectWizardContextType {
    data: ProjectWizardData;
    updateData: (updates: Partial<ProjectWizardData>) => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
    resetWizard: () => void;
    canProceed: () => boolean;
}

const initialData: ProjectWizardData = {
    projectType: null,
    projectCategory: null,
    projectTitle: null,
    projectDescription: null,
    selectedPackage: null,
    billingCycle: 'monthly',
    name: '',
    email: '',
    phone: '',
    message: '',
    currentStep: 1,
    completedSteps: [],
};

const ProjectWizardContext = createContext<ProjectWizardContextType | null>(null);

export function ProjectWizardProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<ProjectWizardData>(initialData);

    const updateData = (updates: Partial<ProjectWizardData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        setData(prev => ({
            ...prev,
            currentStep: Math.min(prev.currentStep + 1, 4),
            completedSteps: prev.completedSteps.includes(prev.currentStep)
                ? prev.completedSteps
                : [...prev.completedSteps, prev.currentStep],
        }));
    };

    const prevStep = () => {
        setData(prev => ({
            ...prev,
            currentStep: Math.max(prev.currentStep - 1, 1),
        }));
    };

    const goToStep = (step: number) => {
        // Can only go to completed steps or current step + 1
        if (step <= data.currentStep || data.completedSteps.includes(step - 1)) {
            setData(prev => ({ ...prev, currentStep: step }));
        }
    };

    const resetWizard = () => {
        setData(initialData);
    };

    const canProceed = (): boolean => {
        switch (data.currentStep) {
            case 1:
                return data.projectType !== null;
            case 2:
                return data.projectTitle !== null;
            case 3:
                return data.selectedPackage !== null;
            case 4:
                return !!(data.name && data.email && data.message);
            default:
                return false;
        }
    };

    return (
        <ProjectWizardContext.Provider
            value={{ data, updateData, nextStep, prevStep, goToStep, resetWizard, canProceed }}
        >
            {children}
        </ProjectWizardContext.Provider>
    );
}

export function useProjectWizard() {
    const context = useContext(ProjectWizardContext);
    if (!context) {
        throw new Error('useProjectWizard must be used within a ProjectWizardProvider');
    }
    return context;
}
