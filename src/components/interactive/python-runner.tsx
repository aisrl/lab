'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, CheckCircle2, AlertCircle, Loader2, Award } from 'lucide-react';

interface PythonRunnerProps {
  labId: string;
  initialCode: string;
  testCode: string;
  points?: number;
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<any>;
    __pyodideInstance?: any;
    __pyodideLoadingPromise?: Promise<any>;
  }
}

export function PythonRunner({
  labId,
  initialCode,
  testCode,
  points = 20,
}: PythonRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState<'idle' | 'loading-runtime' | 'running' | 'passed' | 'failed'>('idle');
  const [output, setOutput] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check completion on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`aisrl_lab_${labId}`);
      if (saved === 'completed') {
        setIsCompleted(true);
      }
    }
  }, [labId]);

  // Load Pyodide from CDN lazily
  const getPyodide = async () => {
    if (window.__pyodideInstance) {
      return window.__pyodideInstance;
    }

    if (window.__pyodideLoadingPromise) {
      return await window.__pyodideLoadingPromise;
    }

    window.__pyodideLoadingPromise = new Promise(async (resolve, reject) => {
      try {
        if (!window.loadPyodide) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
          script.async = true;
          await new Promise((res, rej) => {
            script.onload = res;
            script.onerror = () => rej(new Error('Failed to load Pyodide WebAssembly runtime from CDN'));
            document.head.appendChild(script);
          });
        }

        const pyodide = await window.loadPyodide!({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
        });

        window.__pyodideInstance = pyodide;
        resolve(pyodide);
      } catch (err) {
        reject(err);
      }
    });

    return await window.__pyodideLoadingPromise;
  };

  const handleRun = async () => {
    setOutput('');
    setErrorDetails(null);

    try {
      if (!window.__pyodideInstance) {
        setStatus('loading-runtime');
      } else {
        setStatus('running');
      }

      const pyodide = await getPyodide();
      setStatus('running');

      // Python harness to capture stdout/stderr and run student code + tests
      const harness = `
import sys
import io

_stdout_buffer = io.StringIO()
_stderr_buffer = io.StringIO()
sys.stdout = _stdout_buffer
sys.stderr = _stderr_buffer

# 1. Execute Student Code
__student_code = ${JSON.stringify(code)}
exec(__student_code, globals())

# 2. Execute Autograder Test Suite
__test_code = ${JSON.stringify(testCode)}
exec(__test_code, globals())

_out = _stdout_buffer.getvalue()
_err = _stderr_buffer.getvalue()
_out + (_err if _err else '')
`;

      const result = await pyodide.runPythonAsync(harness);
      setOutput(result || '✓ All tests completed with no errors.');
      setStatus('passed');
      setIsCompleted(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`aisrl_lab_${labId}`, 'completed');
        window.dispatchEvent(new Event('aisrl_progress_updated'));
      }
    } catch (err: any) {
      setStatus('failed');
      const msg = err.message || String(err);
      setErrorDetails(msg);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setErrorDetails(null);
    setStatus('idle');
  };

  // Support Tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="my-8 rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-md overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-100 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="ml-2 font-mono text-xs text-zinc-700 dark:text-zinc-300 font-medium">
            solution.py (In-Browser WebAssembly)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/50 text-[11px] font-mono font-medium text-emerald-800 dark:text-emerald-300">
              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>+{points} pts earned</span>
            </span>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            title="Reset to starter template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Code Textarea - Keep dark code editor for high syntax legibility */}
      <div className="relative p-2 bg-[#0c1017]">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          rows={Math.max(12, code.split('\n').length + 2)}
          className="w-full bg-transparent text-xs sm:text-sm font-mono text-zinc-100 leading-relaxed p-3 focus:outline-none resize-y selection:bg-purple-600/40"
          placeholder="# Type your Python solution here..."
        />
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-medium">
          Runs locally via Pyodide • No server required
        </div>

        <button
          onClick={handleRun}
          disabled={status === 'loading-runtime' || status === 'running'}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading-runtime' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
              <span>Loading Python (~5s)...</span>
            </>
          ) : status === 'running' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
              <span>Running Autograder...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Autograder</span>
            </>
          )}
        </button>
      </div>

      {/* Output / Test Results Box */}
      {(output || errorDetails || status === 'passed' || status === 'failed') && (
        <div className="p-4 border-t border-zinc-300 dark:border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-100">
          {status === 'passed' && (
            <div className="mb-3 flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>All tests passed! Module challenge completed (+{points} points).</span>
            </div>
          )}

          {status === 'failed' && (
            <div className="mb-3 flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Autograder failed. See error output below:</span>
            </div>
          )}

          {output && (
            <div className="text-zinc-200 whitespace-pre-wrap leading-relaxed">
              {output}
            </div>
          )}

          {errorDetails && (
            <div className="mt-2 text-rose-200 whitespace-pre-wrap leading-relaxed p-3 rounded-lg bg-rose-950/60 border border-rose-800/60">
              {errorDetails}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
