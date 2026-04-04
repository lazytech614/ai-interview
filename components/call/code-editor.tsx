"use client";

import { useRef, useState } from "react";
import { Editor, BeforeMount } from "@monaco-editor/react";
import { CODE_SNIPPETS } from "@/lib/data";
import LanguageSelector from "./laguage-selector";
import Output from "./output";

const defineTheme: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("rich-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment",        foreground: "6A9955", fontStyle: "italic" },
      { token: "keyword",        foreground: "C586C0", fontStyle: "bold"   },
      { token: "string",         foreground: "CE9178"                      },
      { token: "number",         foreground: "B5CEA8"                      },
      { token: "type",           foreground: "4EC9B0"                      },
      { token: "class",          foreground: "4EC9B0"                      },
      { token: "function",       foreground: "DCDCAA"                      },
      { token: "variable",       foreground: "9CDCFE"                      },
      { token: "variable.other", foreground: "9CDCFE"                      },
      { token: "constant",       foreground: "4FC1FF"                      },
      { token: "operator",       foreground: "D4D4D4"                      },
      { token: "delimiter",      foreground: "D4D4D4"                      },
      { token: "tag",            foreground: "4EC9B0"                      },
      { token: "attribute.name", foreground: "9CDCFE"                      },
      { token: "attribute.value",foreground: "CE9178"                      },
    ],
    colors: {
      // Editor core
      "editor.background":                "#0D0D0F",
      "editor.foreground":                "#D4D4D4",
      "editor.lineHighlightBackground":   "#1A1A2E",
      "editor.lineHighlightBorder":       "#2A2A4A",
      "editor.selectionBackground":       "#264F78",
      "editor.inactiveSelectionBackground":"#3A3D41",
      "editor.selectionHighlightBackground": "#ADD6FF26",

      // Line numbers
      "editorLineNumber.foreground":      "#4A4A6A",
      "editorLineNumber.activeForeground":"#C6C6C6",

      // Cursor
      "editorCursor.foreground":          "#AEAFAD",

      // Gutter
      "editorGutter.background":          "#0D0D0F",

      // Indent guides
      "editorIndentGuide.background":     "#2A2A3A",
      "editorIndentGuide.activeBackground":"#4A4A6A",

      // Bracket match
      "editorBracketMatch.background":    "#0064001A",
      "editorBracketMatch.border":        "#888888",

      // Scrollbar
      "scrollbarSlider.background":       "#4A4A6A44",
      "scrollbarSlider.hoverBackground":  "#4A4A6A88",
      "scrollbarSlider.activeBackground": "#4A4A6AAA",

      // Minimap
      "minimap.background":               "#0D0D0F",

      // Widget (autocomplete dropdown)
      "editorWidget.background":          "#1E1E2E",
      "editorWidget.border":              "#454545",
      "editorSuggestWidget.background":   "#1E1E2E",
      "editorSuggestWidget.border":       "#454545",
      "editorSuggestWidget.selectedBackground": "#2A2D2E",

      // Matching brackets highlight
      "editorBracketHighlight.foreground1": "FFD700",
      "editorBracketHighlight.foreground2": "DA70D6",
      "editorBracketHighlight.foreground3": "87CEEB",
    },
  });
};

type Language = keyof typeof CODE_SNIPPETS;

const CodeEditor = () => {
  const editorRef = useRef<any>(null);
  const [value, setValue] = useState<string>(
    CODE_SNIPPETS["javascript"]
  );
  const [language, setLanguage] = useState<Language>("javascript");

  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (lang: Language) => {
    setLanguage(lang);
    setValue(CODE_SNIPPETS[lang]);
  };

  return (
    <div className="flex flex-col h-full p-3 gap-3">
      
      {/* Language selector */}
      <div className="shrink-0">
        <LanguageSelector language={language} onSelect={onSelect} />
      </div>

      {/* Editor + Output — fill remaining height */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 flex-1 min-h-0">
        
        {/* Editor */}
        <div className="border border-white/10 rounded-xl overflow-hidden h-full p-2">
          <Editor
            height="100%"
            theme="rich-dark"
            beforeMount={defineTheme}
            language={language}
            value={value}
            onMount={onMount}
            onChange={(val) => setValue(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
              fontLigatures: true,
              automaticLayout: true,
              lineHeight: 24,
              letterSpacing: 0.5,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              renderLineHighlight: "all",
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
              tabSize: 2,
              wordWrap: "on",
              suggest: {
                showKeywords: true,
                showSnippets: true,
              },
            }}
          />
        </div>

        {/* Output */}
        <div className="border border-white/10 rounded-xl p-2 bg-[#0f0f11] overflow-y-auto">
          <Output editorRef={editorRef} language={language} />
        </div>

      </div>
    </div>
  );
};

export default CodeEditor;