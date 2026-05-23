'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  codeContext: string;
  problemTitle: string;
  problemDescription: string;
  isIntegrated?: boolean;
}

export default function AIAssistant({ isOpen, onClose, codeContext, problemTitle, problemDescription, isIntegrated = false }: AIAssistantProps) {
  const { messages, input, handleInputChange, handleSubmit, append, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hi! I am your AI coding assistant. How can I help you with this problem today?'
      }
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = [
    { label: 'Explain Code', icon: 'description', prompt: 'Please explain my current code step by step.' },
    { label: 'Complexity', icon: 'speed', prompt: 'Analyze the time and space complexity of my current code.' },
    { label: 'Optimize', icon: 'bolt', prompt: 'How can I optimize this code? Please suggest improvements.' },
    { label: 'Revision Notes', icon: 'sticky_note_2', prompt: 'Generate short revision notes for this problem based on my code.' },
  ];

  const handleQuickAction = (prompt: string) => {
    append({
      role: 'user',
      content: prompt,
    }, {
      data: {
        codeContext,
        problemTitle,
        problemDescription,
      }
    });
  };

  const drawerVariants: Variants = {
    hidden: { x: '100%', opacity: 0.8 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }
    },
    exit: { 
      x: '100%', 
      opacity: 0.5,
      transition: { type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }
    }
  };

  const messageVariants: Variants = {
    hidden: { opacity: 0, y: 8, scale: 0.96 },
    visible: { 
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const chipVariants: Variants = {
    hidden: { opacity: 0, y: 6 },
    visible: (i: number) => ({ 
      opacity: 1, y: 0,
      transition: { delay: 0.1 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Backdrop (only when not integrated) */}
          {!isIntegrated && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[150] md:hidden"
              onClick={onClose}
            />
          )}
          
          {/* Sliding Drawer - inline or floating */}
          <motion.div
            variants={isIntegrated ? {
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.2 } },
              exit: { opacity: 0, transition: { duration: 0.1 } }
            } : drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={isIntegrated 
              ? "w-full h-full bg-card flex flex-col relative"
              : "fixed inset-y-0 right-0 w-full md:w-[380px] bg-card border-l border-border/40 shadow-2xl z-[100] flex flex-col"
            }
          >
            {/* Header */}
            <div className="h-12 border-b border-border/30 flex items-center justify-between px-4 bg-card shrink-0">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                </motion.div>
                <h2 className="font-heading font-bold text-foreground text-[14px]">AI Assistant</h2>
                <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Beta</span>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
              {messages.map((m, index) => (
                <motion.div
                  key={m.id}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${
                    m.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-br-md' 
                      : 'bg-muted/80 text-foreground border border-border/30 rounded-bl-md'
                  }`}>
                    {m.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="material-symbols-outlined text-[12px] text-primary">smart_toy</span>
                        <span className="font-subheading text-[9px] uppercase tracking-wider font-bold text-primary">Keeps AI</span>
                      </div>
                    )}
                    
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-[13px] prose-p:my-1 prose-pre:bg-background prose-pre:border prose-pre:border-border/20 prose-pre:text-[12px] prose-headings:text-[14px] prose-headings:mb-1 prose-headings:mt-2 prose-li:text-[13px] prose-code:text-[12px]">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          code({node, inline, className, children, ...props}: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus as any}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{ fontSize: '12px', borderRadius: '8px', margin: '4px 0' }}
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="bg-background/60 px-1 py-0.5 rounded text-[12px] font-mono text-primary" {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Loading indicator */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted/80 border border-border/30 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                      <motion.div 
                        className="w-1.5 h-1.5 bg-primary rounded-full"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div 
                        className="w-1.5 h-1.5 bg-primary rounded-full"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                      />
                      <motion.div 
                        className="w-1.5 h-1.5 bg-primary rounded-full"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-3 text-[12px] flex gap-2 items-start"
                  >
                    <span className="material-symbols-outlined text-[16px] mt-0.5">error</span>
                    <p>{error.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom: Quick Actions + Input */}
            <div className="px-3 py-3 bg-card border-t border-border/20 shrink-0">
              {/* Quick Action Chips */}
              <div className="flex gap-1.5 overflow-x-auto custom-scrollbar pb-2">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={action.label}
                    custom={i}
                    variants={chipVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleQuickAction(action.prompt)}
                    disabled={isLoading}
                    className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-accent/80 hover:bg-primary/10 text-[11px] font-semibold text-foreground transition-colors border border-border/30 disabled:opacity-40 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px] text-primary">{action.icon}</span>
                    {action.label}
                  </motion.button>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e, {
                  data: {
                    codeContext,
                    problemTitle,
                    problemDescription,
                  }
                });
              }} className="mt-2 relative">
                <input
                  value={input}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="Ask about your code..."
                  className="w-full bg-background border border-border/40 rounded-xl pl-3 pr-10 py-2.5 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all disabled:opacity-50"
                />
                <motion.button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-30 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </motion.button>
              </form>
              <p className="text-center mt-1.5 text-[9px] text-muted-foreground">AI can make mistakes. Verify important algorithms.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
