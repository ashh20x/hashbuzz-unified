import React from 'react';
import * as SC from './styled';

const parseText = (text: string) => {
  const parts = text.split(/(\{[^{}]+?\})/g); // Updated regex to avoid nested curly braces
  return parts.map((part, index) => {
    if (part.startsWith('{') && part.endsWith('}')) {
      const tagContent = part.slice(1, -1); // Remove curly braces
      const [tag, ...contentParts] = tagContent.split(':'); // Split tag and content
      const content = contentParts.join(':'); // Join in case ':' is in the content
      switch (tag) {
        case 'b':
          return <b key={index}>{content}</b>;
        case 'i':
          return <i key={index}>{content}</i>;
        case 'u':
          return <u key={index}>{content}</u>;
        case 's':
          return <s key={index}>{content}</s>;
        case 'em':
          return <em key={index}>{content}</em>;
        case 'strong':
          return <strong key={index}>{content}</strong>;
        case 'mark':
          return <mark key={index}>{content}</mark>;
        case 'small':
          return <small key={index}>{content}</small>;
        case 'del':
          return <del key={index}>{content}</del>;
        case 'ins':
          return <ins key={index}>{content}</ins>;
        case 'sub':
          return <sub key={index}>{content}</sub>;
        case 'sup':
          return <sup key={index}>{content}</sup>;
        default:
          return content; // Render content as plain text if tag isn't supported
      }
    }
    return part; // Render plain text
  });
};

type ContentItem =
  | { type: 'p'; text: string; style?: React.CSSProperties }
  | { type: 'img'; src: string; alt: string; style?: React.CSSProperties }
  | { type: 'ul'; items: { text: string; style?: React.CSSProperties }[] }
  | { type: 'h1'; text: string; style?: React.CSSProperties }
  | { type: 'h2'; text: string; style?: React.CSSProperties }
  | { type: 'h3'; text: string; style?: React.CSSProperties }
  | { type: 'h4'; text: string; style?: React.CSSProperties }
  | { type: 'h5'; text: string; style?: React.CSSProperties }
  | { type: 'h6'; text: string; style?: React.CSSProperties }
  | { type: 'blockquote'; text: string; style?: React.CSSProperties }
  | { type: 'pre'; text: string; style?: React.CSSProperties }
  | { type: 'code'; text: string; style?: React.CSSProperties };

type Section = {
  heading: string;
  content: ContentItem[];
  id?: string;
};

interface Meta {
  title: string;
  description: string;
  keywords: string;
  effectDate: string;
}

interface ContentCreatorProps {
  title: string;
  subtitle?: string;
  meta: Meta;
  sections: Section[];
}
const ContentCreator: React.FC<{ data: ContentCreatorProps }> = ({ data }) => {
  return (
    <SC.ContentContainer>
      <SC.ContentTitle>{data.title}</SC.ContentTitle>
      {data.subtitle && <p> {parseText(data.subtitle || '')}</p>}
      {data.meta.effectDate && (
        <SC.DefaultStyledParagraph>
          Effective Date:{' '}
          {new Date(data.meta.effectDate).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </SC.DefaultStyledParagraph>
      )}
      {data.sections.map((section, index) => (
        <SC.ContentSection key={index}>
          <h2>{section.heading}</h2>
          {section.content.map((item, idx) => {
            if (item.type === 'p') {
              return (
                <SC.DefaultStyledParagraph key={idx} style={item.style}>
                  {parseText(item.text || '')}
                </SC.DefaultStyledParagraph>
              );
            } else if (item.type === 'img') {
              return (
                <SC.DefaultStyledImage
                  key={idx}
                  src={item.src}
                  alt={item.alt}
                  style={item.style}
                />
              );
            } else if (item.type === 'ul') {
              return (
                <ul key={idx}>
                  {item.items &&
                    item.items.map((listItem, listIdx) => (
                      <li key={listIdx} style={listItem.style}>
                        {listItem.text}
                      </li>
                    ))}
                </ul>
              );
            }
            return null;
          })}
        </SC.ContentSection>
      ))}
    </SC.ContentContainer>
  );
};

export default ContentCreator;
