import React from 'react';

export interface AIAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
}