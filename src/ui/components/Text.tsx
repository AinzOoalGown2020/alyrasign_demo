import React from 'react';
import styled, { DefaultTheme } from 'styled-components';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

interface StyledTextProps {
  $variant?: TextProps['variant'];
  $color?: string;
  $align?: TextProps['align'];
  $weight?: TextProps['weight'];
}

const StyledText = styled.span<StyledTextProps>`
  display: block;
  color: ${({ $color, theme }) => $color || theme.colors.text.primary};
  text-align: ${({ $align }) => $align || 'left'};
  font-weight: ${({ $weight }) => {
    switch ($weight) {
      case 'bold':
        return '700';
      case 'semibold':
        return '600';
      case 'medium':
        return '500';
      default:
        return '400';
    }
  }};

  ${({ $variant }) => {
    switch ($variant) {
      case 'h1':
        return `
          font-size: 2.5rem;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        `;
      case 'h2':
        return `
          font-size: 2rem;
          line-height: 1.3;
          margin-bottom: 1.25rem;
        `;
      case 'h3':
        return `
          font-size: 1.75rem;
          line-height: 1.4;
          margin-bottom: 1rem;
        `;
      case 'h4':
        return `
          font-size: 1.5rem;
          line-height: 1.4;
          margin-bottom: 0.75rem;
        `;
      case 'body':
        return `
          font-size: 1rem;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        `;
      case 'caption':
        return `
          font-size: 0.875rem;
          line-height: 1.4;
          margin-bottom: 0.25rem;
        `;
      default:
        return `
          font-size: 1rem;
          line-height: 1.5;
        `;
    }
  }}
`;

export const Text: React.FC<TextProps> = ({
  children,
  variant,
  color,
  align,
  weight,
}) => {
  return (
    <StyledText
      $variant={variant}
      $color={color}
      $align={align}
      $weight={weight}
    >
      {children}
    </StyledText>
  );
}; 