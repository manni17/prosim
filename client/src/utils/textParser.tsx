import React from 'react';
import { WikiTooltip } from '@/components/meta/WikiTooltip';

/**
 * Parses a string for [[term]] patterns and replaces them with <WikiTooltip />
 */
export const parseWikiLinks = (text: string, wikiData: Record<string, any>) => {
  if (!text) return text;
  
  // Regex to find [[anything]]
  const regex = /\[\[(.*?)\]\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push the text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const termKey = match[1].toLowerCase();
    const definition = wikiData[termKey];

    if (definition) {
      parts.push(
        <WikiTooltip 
          key={`${termKey}-${match.index}`} 
          term={match[1]} 
          definition={definition} 
        />
      );
    } else {
      // If no definition found, just render the term without brackets
      parts.push(match[1]);
    }

    lastIndex = regex.lastIndex;
  }

  // Push the remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};
