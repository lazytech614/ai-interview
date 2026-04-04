"use client";

import { useEffect, useCallback, useState } from "react";
import {
  StreamTheme,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
  CallingState,
  CallControls,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Window,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, Loader2, Code2, X } from "lucide-react";
import type { Channel as StreamChannel } from "stream-chat";
import AIQuestionsPanel from "./ai-questions";
import { ProblemPanel } from "./problem-panel";
import CodeEditor from "./code-editor";

export default function CallUI({
  callId,
  isInterviewer,
  booking,
  onLeave,
  apiKey,
  token,
  currentUser,
}: any) {
  const { useCallCallingState } = useCallStateHooks();
  const call = useCall();
  const callingState = useCallCallingState();

  const [activeTab, setActiveTab] = useState("chat");
  const [showEditor, setShowEditor] = useState(false);

  const handleLeave = useCallback(async () => {
    try {
      if (call) {
        const isRecording = call.state?.recording;
        if (isRecording) {
          await call.stopRecording().catch(() => {});
        }
        await call.leave().catch(() => {});
      }
    } finally {
      onLeave();
    }
  }, [call, onLeave]);

  const chatClient = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: {
      id: currentUser.id,
      name: currentUser.name,
      image: currentUser.imageUrl,
    },
  });

  const [chatChannel, setChatChannel] = useState<StreamChannel | null>(null);

  useEffect(() => {
    if (!chatClient) return;

    const channel = chatClient.channel("messaging", callId, {
      members: [
        booking.interviewer.clerkUserId,
        booking.interviewee.clerkUserId,
      ],
    });

    channel
      .watch()
      .then(() => setChatChannel(channel))
      .catch(console.error);

    return () => {
      channel.stopWatching().catch(() => {});
    };
  }, [chatClient, callId, booking]);

  if (callingState === CallingState.LEFT) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-3">
        <p className="text-stone-400 text-sm">Leaving call…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col overflow-hidden">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-white/10 text-stone-500 text-xs"
          >
            {booking.interviewer.name}
            <span className="text-stone-700 mx-1.5">×</span>
            {booking.interviewee.name}
          </Badge>
          {isInterviewer && (
            <Badge
              variant="outline"
              className="border-amber-400/20 bg-amber-400/5 text-amber-400 text-xs"
            >
              Interviewer
            </Badge>
          )}
        </div>

        <Button
          variant={showEditor ? "gold" : "outline"}
          size="sm"
          onClick={() => setShowEditor((v) => !v)}
          className={`gap-2 text-xs ${
            showEditor
              ? ""
              : "border-white/10 bg-white/3 text-stone-400 hover:text-stone-200 hover:border-white/20"
          }`}
        >
          <Code2 size={13} />
          {showEditor ? "Hide Editor" : "Code Editor"}
        </Button>
      </div>

      {/* ── Main body ── */}
      {!showEditor ? (
        /* ── DEFAULT MODE: video left, chat/ai right ── */
        <div className="flex flex-col md:flex-row flex-1 min-h-0">

          {/* Video */}
          <div className="flex flex-col md:flex-1 min-w-0">
            <StreamTheme>
              <SpeakerLayout />
              <CallControls onLeave={handleLeave} />
            </StreamTheme>
          </div>

          {/* Chat / AI panel */}
          <div className="w-full md:w-85 shrink-0 flex flex-col border-l border-white/8 bg-[#0a0a0b]">
            <div className="flex border-b border-white/8 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${
                  activeTab === "chat"
                    ? "text-amber-400 border-b-2 border-amber-400"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                <MessageSquare size={13} />
                Chat
              </button>

              {isInterviewer && (
                <button
                  type="button"
                  onClick={() => setActiveTab("ai")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${
                    activeTab === "ai"
                      ? "text-amber-400 border-b-2 border-amber-400"
                      : "text-stone-500 hover:text-stone-300"
                  }`}
                >
                  <Sparkles size={13} />
                  AI Questions
                </button>
              )}
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              {activeTab === "chat" ? (
                chatClient && chatChannel ? (
                  <Chat client={chatClient} theme="str-chat__theme-dark">
                    <Channel channel={chatChannel}>
                      <Window>
                        <MessageList />
                        <MessageInput focus />
                      </Window>
                    </Channel>
                  </Chat>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 size={18} className="text-stone-600 animate-spin" />
                  </div>
                )
              ) : (
                <div className="p-4 h-full overflow-y-scroll max-h-screen">
                  <AIQuestionsPanel categories={booking.categories} />
                </div>
              )}
            </div>
          </div>
        </div>

      ) : (
        /* ── EDITOR MODE: problem + code editor dominate, videos shrink to strip ── */
        <div className="flex flex-1 min-h-0">

          {/* LEFT: problem panel + code editor (takes majority) */}
          <div className="flex flex-col flex-1 min-w-0 min-h-0">

            {/* Problem + Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] flex-1 min-h-0 overflow-hidden">
              <div className="border-r border-white/8 overflow-y-auto">
                <ProblemPanel isInterviewer={isInterviewer} />
              </div>
              <div className="overflow-y-auto">
                <CodeEditor />
              </div>
            </div>

            {/* Mini call controls strip at bottom */}
            <div className="shrink-0 border-t border-white/8 px-4 py-2 flex items-center justify-center">
              <StreamTheme>
                <CallControls onLeave={handleLeave} />
              </StreamTheme>
            </div>
          </div>

          {/* RIGHT: compact video strip */}
          <div className="w-64 shrink-0 flex flex-col border-l border-white/8 bg-[#0a0a0b]">

            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/8 shrink-0">
              <span className="text-[11px] text-stone-600 font-medium tracking-wide uppercase">
                Participants
              </span>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="text-stone-600 hover:text-stone-400 transition-colors"
              >
                <X size={13} />
              </button>
            </div>

            {/* Compact speaker layout */}
            <div className="flex-1 min-h-0 overflow-hidden [&_.str-video]:h-full [&_.str-video__speaker-layout]:flex-col [&_.str-video__speaker-layout]:gap-1 [&_.str-video__speaker-layout]:p-2">
              <StreamTheme>
                <SpeakerLayout />
              </StreamTheme>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}