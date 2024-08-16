import { FAQ } from "../roadmap";

export interface AIResponseSectionProps {
    aiResponse: string;
}

export interface AIResponseDisplayProps {
    content: string;
}

export interface CodeBlockProps {
    code: string;
}

export interface RegularContentProps {
    content: string;
}

export interface TextComponentProps {
    content: string;
}

export interface NewAnswerInputProps {
    faqId: string;
    newAnswer: string;
    handleAnswerChange: (faqId: string, content: string) => void;
    submitAnswer: (faqId: string) => void;
    answerRef: (el: HTMLDivElement | null) => void;
}

export interface AnswerItemProps {
    answer: { _id: string; content: string };
    isFirst: boolean;
}

export interface FAQListProps {
    faqs: FAQ[];
    expandedFAQs: string[];
    toggleFAQ: (faqId: string) => void;
    newAnswers: { [key: string]: string };
    handleAnswerChange: (faqId: string, content: string) => void;
    submitAnswer: (faqId: string) => void;
    answerRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

export interface FAQItemProps {
    faq: FAQ;
    isExpanded: boolean;
    toggleFAQ: (faqId: string) => void;
    newAnswer: string;
    handleAnswerChange: (faqId: string, content: string) => void;
    submitAnswer: (faqId: string) => void;
    answerRef: (el: HTMLDivElement | null) => void;
}