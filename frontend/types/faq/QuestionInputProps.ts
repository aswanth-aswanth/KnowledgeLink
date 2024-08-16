export interface QuestionInputProps {
    newQuestion: string;
    setNewQuestion: (question: string) => void;
    submitQuestion: () => void;
    isAILoading: boolean;
    activeTab: 'faq' | 'ai';
}