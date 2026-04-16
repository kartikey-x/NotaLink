import { Sparkles, Zap, SpellCheck } from 'lucide-react';
import type { AIAction } from '../utils/aiActions';

export const AI_ACTIONS: AIAction[] = [
  {
    id: 'summarize',
    label: 'Summarize',
    icon: <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />,
    prompt: 'Summarize the following text concisely:\n\n',
  },
  {
    id: 'punchy',
    label: 'Make it Punchy',
    icon: <Zap className="w-3.5 h-3.5" strokeWidth={1.5} />,
    prompt:
      'Rewrite the following text to be more concise, impactful, and punchy while keeping the same meaning:\n\n',
  },
  {
    id: 'grammar',
    label: 'Fix Grammar',
    icon: <SpellCheck className="w-3.5 h-3.5" strokeWidth={1.5} />,
    prompt:
      'Fix any grammar, spelling, and punctuation errors in the following text. Return only the corrected text:\n\n',
  },
];