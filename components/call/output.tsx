"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { executeCodeAction } from "@/actions/code";

const Output = ({ editorRef, language }: any) => {
  const [output, setOutput] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);

      const res = await executeCodeAction({
        language,
        sourceCode,
      });

      if (!res.success) {
        throw new Error(res.error);
      }

      setOutput(res.output.split("\n"));
      setIsError(!!res.stderr);
    } catch (err: any) {
      toast.error("Execution failed", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <Button onClick={runCode} disabled={isLoading} className="cursor-pointer">
        {isLoading ? "Running..." : "Run Code"}
      </Button>

      <div
        className={`h-full p-3 rounded-xl border ${
          isError ? "border-red-500 text-red-400" : "border-white/10"
        }`}
      >
        {output ? (
          output.map((line, i) => <div key={i}>{line}</div>)
        ) : (
          <p className="text-muted-foreground text-xs opacity-50">Run code to see output</p>
        )}
      </div>
    </div>
  );
};

export default Output;