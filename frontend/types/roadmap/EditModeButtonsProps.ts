export interface EditModeButtonsProps {
    pathname: string;
    isEditMode: boolean;
    setIsEditMode: (value: boolean) => void;
    contributions: Record<string, string>;
    handleSubmit: () => void;
}