import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  padding?: string;
  margin?: string;
  elevation?: 'low' | 'medium' | 'high';
}

const StyledCard = styled.div<CardProps>`
  background-color: white;
  border-radius: 12px;
  padding: ${({ padding = '24px' }) => padding};
  margin: ${({ margin = '0' }) => margin};
  
  ${({ elevation = 'medium' }) => {
    switch (elevation) {
      case 'low':
        return `
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        `;
      case 'medium':
        return `
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        `;
      case 'high':
        return `
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        `;
      default:
        return '';
    }
  }}
`;

export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>;
}; 