"use server";

const SUPPORTED_LANGUAGES = ["javascript", "typescript", "python", "java", "cpp"];

export async function executeCodeAction({
  language,
  sourceCode,
}: {
  language: string;
  sourceCode: string;
}) {
  try {
    if (!language || !sourceCode) {
      throw new Error("Missing required fields");
    }

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      throw new Error("Unsupported language");
    }

    if (sourceCode.length > 10_000) {
      throw new Error("Code too long");
    }

    const res = await fetch(`${process.env.EXECUTION_SERVER_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.EXECUTION_SERVER_API_KEY!,
      },
      body: JSON.stringify({ language, sourceCode }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Execution failed: ${text}`);
    }

    const data = await res.json();

    return {
      success: true,
      output: data.output || "",
      stderr: "",
      stdout: data.output || "",
    };
  } catch (error: any) {
    console.error("CODE EXECUTION ERROR:", error);
    return {
      success: false,
      error: error?.message || "Execution failed",
    };
  }
}