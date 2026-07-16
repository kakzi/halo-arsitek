'use client';

import React, { useState, useRef } from 'react';
import { Bold, Italic, Heading, List, ListOrdered, TextQuote, Link as LinkIcon, Eye, Edit3 } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  required?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write content right here...',
  rows = 6,
  label,
  required = false,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertSyntax = (prefix: string, suffix = '', defaultText = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  const renderPreviewHtml = (text: string) => {
    if (!text.trim()) return <p style={{ color: 'var(--admin-text-secondary)', fontStyle: 'italic', margin: 0 }}>No content to preview yet...</p>;

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content: React.ReactNode = line;

      if (line.startsWith('### ')) {
        return <h4 key={idx} style={{ fontSize: '1.125rem', fontWeight: 700, margin: '12px 0 6px', color: 'var(--admin-text-primary)' }}>{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} style={{ fontSize: '1.25rem', fontWeight: 700, margin: '14px 0 8px', color: 'var(--admin-text-primary)' }}>{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} style={{ fontSize: '1.5rem', fontWeight: 700, margin: '16px 0 8px', color: 'var(--admin-text-primary)' }}>{line.replace('# ', '')}</h2>;
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} style={{ borderLeft: '3px solid var(--admin-primary)', paddingLeft: '12px', margin: '8px 0', fontStyle: 'italic', color: 'var(--admin-text-secondary)' }}>
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={idx} style={{ marginLeft: '20px', marginBottom: '4px', color: 'var(--admin-text-primary)' }}>{line.replace(/^[-*]\s+/, '')}</li>;
      }
      if (/^\d+\.\s+/.test(line)) {
        return <li key={idx} style={{ marginLeft: '20px', marginBottom: '4px', listStyleType: 'decimal', color: 'var(--admin-text-primary)' }}>{line.replace(/^\d+\.\s+/, '')}</li>;
      }

      return <p key={idx} style={{ margin: '0 0 8px', color: 'var(--admin-text-primary)', lineHeight: 1.6 }}>{content}</p>;
    });
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.6875rem',
    color: 'var(--admin-text-secondary)',
    fontFamily: 'var(--font-outfit), sans-serif',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
  };

  return (
    <div style={{ marginBottom: '24px', fontFamily: 'var(--font-outfit), sans-serif' }}>
      {label && <label style={labelStyle}>{label}</label>}

      <div
        style={{
          border: '1px solid var(--admin-border)',
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'var(--admin-bg-card)',
        }}
      >
        {/* Header Tabs & Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--admin-bg-page)',
            borderBottom: '1px solid var(--admin-border)',
            padding: '8px 12px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {/* Mode Switch Tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'write' ? 'var(--admin-bg-card)' : 'transparent',
                color: activeTab === 'write' ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeTab === 'write' ? 'var(--admin-shadow)' : 'none',
              }}
            >
              <Edit3 size={14} /> Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'preview' ? 'var(--admin-bg-card)' : 'transparent',
                color: activeTab === 'preview' ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeTab === 'preview' ? 'var(--admin-shadow)' : 'none',
              }}
            >
              <Eye size={14} /> Live Preview
            </button>
          </div>

          {/* Formatting Buttons (Only active in Write mode) */}
          {activeTab === 'write' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <button
                type="button"
                onClick={() => insertSyntax('**', '**', 'bold text')}
                title="Bold (**text**)"
                style={{ padding: '6px', background: 'transparent', border: 'none', borderRadius: '4px', color: 'var(--admin-text-secondary)', cursor: 'pointer' }}
              >
                <Bold size={15} />
              </button>
              <button
                type="button"
                onClick={() => insertSyntax('*', '*', 'italic text')}
                title="Italic (*text*)"
                style={{ padding: '6px', background: 'transparent', border: 'none', borderRadius: '4px', color: 'var(--admin-text-secondary)', cursor: 'pointer' }}
              >
                <Italic size={15} />
              </button>
              <button
                type="button"
                onClick={() => insertSyntax('## ', '', 'Heading')}
                title="Heading (## Heading)"
                style={{ padding: '6px', background: 'transparent', border: 'none', borderRadius: '4px', color: 'var(--admin-text-secondary)', cursor: 'pointer' }}
              >
                <Heading size={15} />
              </button>
              <div style={{ width: '1px', height: '18px', background: 'var(--admin-border)', margin: '0 4px' }} />
              <button
                type="button"
                onClick={() => insertSyntax('- ', '', 'List item')}
                title="Bullet List (- item)"
                style={{ padding: '6px', background: 'transparent', border: 'none', borderRadius: '4px', color: 'var(--admin-text-secondary)', cursor: 'pointer' }}
              >
                <List size={15} />
              </button>
              <button
                type="button"
                onClick={() => insertSyntax('1. ', '', 'Numbered item')}
                title="Numbered List (1. item)"
                style={{ padding: '6px', background: 'transparent', border: 'none', borderRadius: '4px', color: 'var(--admin-text-secondary)', cursor: 'pointer' }}
              >
                <ListOrdered size={15} />
              </button>
              <button
                type="button"
                onClick={() => insertSyntax('> ', '', 'Quote text')}
                title="Quote (> quote)"
                style={{ padding: '6px', background: 'transparent', border: 'none', borderRadius: '4px', color: 'var(--admin-text-secondary)', cursor: 'pointer' }}
              >
                <TextQuote size={15} />
              </button>
              <button
                type="button"
                onClick={() => insertSyntax('[link text](', ')', 'url')}
                title="Link ([text](url))"
                style={{ padding: '6px', background: 'transparent', border: 'none', borderRadius: '4px', color: 'var(--admin-text-secondary)', cursor: 'pointer' }}
              >
                <LinkIcon size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        {activeTab === 'write' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            style={{
              width: '100%',
              padding: '16px',
              background: 'transparent',
              border: 'none',
              color: 'var(--admin-text-primary)',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-outfit), sans-serif',
              outline: 'none',
              resize: 'vertical',
              lineHeight: 1.6,
            }}
          />
        ) : (
          <div
            style={{
              padding: '16px 20px',
              minHeight: `${rows * 24}px`,
              background: 'var(--admin-bg-page)',
            }}
          >
            {renderPreviewHtml(value)}
          </div>
        )}
      </div>
    </div>
  );
}
