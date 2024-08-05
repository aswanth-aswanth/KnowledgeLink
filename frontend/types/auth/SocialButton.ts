import { ReactNode } from "react";

export interface SocialButton {
    name: string;
    icon: ReactNode;
    color: string;
    onClick: () => void;
}