
export interface SectionItem {
    id: string;
    icon: React.ReactNode;
    title: string;
    desc: string;
}

export interface SectionData {
    sectionId: string;
    heading: string;
    paragraphs: string[];
    items: SectionItem[];
}