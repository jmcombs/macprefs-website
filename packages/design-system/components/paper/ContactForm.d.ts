import React from 'react';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  title?: React.ReactNode;
  blurb?: React.ReactNode;
  submitLabel?: string;
  /** 'path' or any Catppuccin Latte accent name (submit button). */
  accent?: string;
  align?: 'center' | 'left';
  onSubmit?: (data: ContactFormData) => void;
}

export function ContactForm(props: ContactFormProps): JSX.Element;
