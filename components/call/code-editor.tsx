"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useCall } from "@stream-io/video-react-sdk";
import { Code2, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const LANGUAGES = ["javascript", "python", "typescript", "java", "cpp"];

const STARTER_CODE: Record<string, string> = {
  javascript: `// Write your solution here\nfunction solution() {\n  \n}\n`,
  python: `# Write your solution here\ndef solution():\n    pass\n`,
  typescript: `// Write your solution here\nfunction solution(): void {\n  \n}\n`,
  java: `// Write your solution here\nclass Solution {\n  public void solve() {\n    \n  }\n}\n`,
  cpp: `// Write your solution here\n#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solution() {\n  \n}\n`,
};

export function CodeEditor() {
  const call = useCall();
  const [code, setCode] = useState(STARTER_CODE.javascript);
  const [language, setLanguage] = useState("javascript");
  const isBroadcasting = useRef(false); // prevent echo loop

  // Listen for incoming code changes from the other participant
  useEffect(() => {
    if (!call) return;

    const unsubscribe = call.on("custom", (event: any) => {
      if (event.custom?.type === "code-change") {
        isBroadcasting.current = true;
        setCode(event.custom.code);
        setTimeout(() => { isBroadcasting.current = false; }, 50);
      }
      if (event.custom?.type === "language-change") {
        setLanguage(event.custom.language);
        setCode(STARTER_CODE[event.custom.language]);
      }
    });

    return () => unsubscribe();
  }, [call]);

  // Broadcast code changes to other participant
  const handleCodeChange = (value: string | undefined) => {
    const newCode = value ?? "";
    setCode(newCode);
    if (!isBroadcasting.current && call) {
      call.sendCustomEvent({ type: "code-change", code: newCode });
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(STARTER_CODE[lang]);
    call?.sendCustomEvent({ type: "language-change", language: lang });
  };

  const handleReset = () => {
    const fresh = STARTER_CODE[language];
    setCode(fresh);
    call?.sendCustomEvent({ type: "code-change", code: fresh });
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-[#0f0f11]">
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-amber-400" />
          <span className="text-xs font-semibold text-stone-400 tracking-wide uppercase">
            Code Editor
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="text-xs bg-white/5 border border-white/10 text-stone-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400/40 cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l} className="bg-[#0f0f11]">
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </option>
            ))}
          </select>

          {/* Reset */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-7 px-2.5 gap-1.5 border-white/10 bg-white/3 text-stone-500 hover:text-stone-300 text-xs"
          >
            <RotateCcw size={11} />
            Reset
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "line",
            padding: { top: 16, bottom: 16 },
            tabSize: 2,
            wordWrap: "on",
            automaticLayout: true,
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
}