export interface User {
    _id: string;
    username: string;
    image: string;
}

export interface CreateGroupModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isDarkMode: boolean;
    groupName: string;
    setGroupName: (name: string) => void;
    modalSearchTerm: string;
    setModalSearchTerm: (term: string) => void;
    modalSearchResults: User[];
    selectedParticipants: string[];
    toggleParticipant: (userId: string) => void;
    handleCreateGroup: () => void;
}