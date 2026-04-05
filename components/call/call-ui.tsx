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
import { MessageSquare, Sparkles, Loader2, Code2, X, ChevronDown, ChevronUp } from "lucide-react";
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

  // "chat" | "ai" in default mode; "problem" | "editor" in editor mode
  const [activeTab, setActiveTab] = useState("chat");
  const [showEditor, setShowEditor] = useState(false);
  // On mobile, side panel (chat/ai) is collapsed by default
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  const handleToggleEditor = useCallback((val: boolean) => {
    setShowEditor(val);
    // On mobile default to the code editor tab when opening editor mode
    setActiveTab(val ? "editor" : "chat");
  }, []);

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

  // ── Shared chat/ai panel content ──
  const SidePanelContent = () => (
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
  );

  // ── Shared tab bar ──
  const TabBar = ({ onTabChange }: { onTabChange?: (tab: string) => void }) => (
    <div className="flex border-b border-white/8 shrink-0">
      <button
        type="button"
        onClick={() => {
          setActiveTab("chat");
          onTabChange?.("chat");
        }}
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
          onClick={() => {
            setActiveTab("ai");
            onTabChange?.("ai");
          }}
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
  );

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col overflow-hidden">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-white/8 shrink-0 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden">
          <Badge
            variant="outline"
            className="border-white/10 text-stone-500 text-[10px] sm:text-xs truncate max-w-35 sm:max-w-none"
          >
            <span className="truncate">{booking.interviewer.name}</span>
            <span className="text-stone-700 mx-1 sm:mx-1.5 shrink-0">×</span>
            <span className="truncate">{booking.interviewee.name}</span>
          </Badge>
          {isInterviewer && (
            <Badge
              variant="outline"
              className="border-amber-400/20 bg-amber-400/5 text-amber-400 text-[10px] sm:text-xs shrink-0"
            >
              Interviewer
            </Badge>
          )}
        </div>

        <Button
          variant={showEditor ? "gold" : "outline"}
          size="sm"
          onClick={() => handleToggleEditor(!showEditor)}
          className={`gap-1.5 text-[10px] sm:text-xs shrink-0 px-2 sm:px-3 ${
            showEditor
              ? ""
              : "border-white/10 bg-white/3 text-stone-400 hover:text-stone-200 hover:border-white/20"
          }`}
        >
          <Code2 size={12} />
          <span className="hidden sm:inline">{showEditor ? "Hide Editor" : "Code Editor"}</span>
          <span className="sm:hidden">{showEditor ? "Hide" : "Editor"}</span>
        </Button>
      </div>

      {/* ── Main body ── */}
      {!showEditor ? (
        /* ── DEFAULT MODE ── */
        <div className="flex flex-col flex-1 min-h-0">

          {/* Video — takes available space, but leaves room for collapsed panel toggle on mobile */}
          <div className="flex flex-col md:flex-row flex-1 min-h-0">

            {/* Video area */}
            <div className="flex flex-col flex-1 min-w-0 min-h-0">
              <StreamTheme>
                <SpeakerLayout />
                <CallControls onLeave={handleLeave} />
              </StreamTheme>
            </div>

            {/* ── DESKTOP: side panel (always visible) ── */}
            <div className="hidden md:flex w-85 shrink-0 flex-col border-l border-white/8 bg-[#0a0a0b]">
              <TabBar />
              <SidePanelContent />
            </div>
          </div>

          {/* ── MOBILE: collapsible bottom panel ── */}
          <div className="md:hidden shrink-0 border-t border-white/8 bg-[#0a0a0b] flex flex-col">

            {/* Toggle header */}
            <button
              type="button"
              onClick={() => setSidePanelOpen((v) => !v)}
              className="flex items-center justify-between px-4 py-2.5 w-full"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-400 font-medium">
                  {activeTab === "chat" ? "Chat" : "AI Questions"}
                </span>
                {/* Tab pills inline */}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab("chat"); setSidePanelOpen(true); }}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                      activeTab === "chat"
                        ? "bg-amber-400/15 text-amber-400"
                        : "text-stone-600 hover:text-stone-400"
                    }`}
                  >
                    Chat
                  </button>
                  {isInterviewer && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setActiveTab("ai"); setSidePanelOpen(true); }}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                        activeTab === "ai"
                          ? "bg-amber-400/15 text-amber-400"
                          : "text-stone-600 hover:text-stone-400"
                      }`}
                    >
                      AI
                    </button>
                  )}
                </div>
              </div>
              {sidePanelOpen
                ? <ChevronDown size={14} className="text-stone-500" />
                : <ChevronUp size={14} className="text-stone-500" />
              }
            </button>

            {/* Expandable panel body */}
            {sidePanelOpen && (
              <div className="h-64 flex flex-col border-t border-white/8">
                <SidePanelContent />
              </div>
            )}
          </div>
        </div>

      ) : (
        /* ── EDITOR MODE ── */
        <div className="flex flex-col md:flex-row flex-1 min-h-0">

          {/* LEFT / TOP: problem + editor */}
          <div className="flex flex-col flex-1 min-w-0 min-h-0">

            {/* ── MOBILE: tab switcher between Problem and Editor ── */}
            <div className="md:hidden flex border-b border-white/8 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("problem")}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === "problem"
                    ? "text-amber-400 border-b-2 border-amber-400"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                Problem
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("editor")}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === "editor"
                    ? "text-amber-400 border-b-2 border-amber-400"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                Code Editor
              </button>
            </div>

            {/* ── MOBILE: show only active tab panel ── */}
            <div className="md:hidden overflow-auto" style={{ height: 'calc(100dvh - 160px)' }}>
              {activeTab === "problem" ? (
                <ProblemPanel isInterviewer={isInterviewer} />
              ) : (
                <CodeEditor />
              )}
            </div>

            {/* ── DESKTOP: side-by-side problem + editor ── */}
            <div className="hidden md:grid md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] flex-1 min-h-0 overflow-hidden">
              <div className="border-r border-white/8 overflow-y-auto">
                <ProblemPanel isInterviewer={isInterviewer} />
              </div>
              <div className="min-h-0 overflow-auto">
                <CodeEditor />
              </div>
            </div>

            {/* Mini call controls */}
            <div className="shrink-0 border-t border-white/8 px-4 py-2 flex items-center justify-center">
              <StreamTheme>
                <CallControls onLeave={handleLeave} />
              </StreamTheme>
            </div>
          </div>

          {/* Desktop: fixed right video sidebar */}
          <div className="hidden md:flex w-56 lg:w-64 shrink-0 flex-col border-l border-white/8 bg-[#0a0a0b]">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/8 shrink-0">
              <span className="text-[11px] text-stone-600 font-medium tracking-wide uppercase">
                Participants
              </span>
              <button
                type="button"
                onClick={() => handleToggleEditor(false)}
                className="text-stone-600 hover:text-stone-400 transition-colors"
              >
                <X size={13} />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden [&_.str-video]:h-full [&_.str-video__speaker-layout]:flex-col [&_.str-video__speaker-layout]:gap-1 [&_.str-video__speaker-layout]:p-2">
              <StreamTheme>
                <SpeakerLayout />
              </StreamTheme>
            </div>
          </div>

          {/* Mobile: floating mini video pip (top-right) */}
          <div className="md:hidden fixed top-11 right-2 z-30 w-24">
            <div className="rounded-lg overflow-hidden border border-white/10 bg-[#0a0a0b] shadow-xl">
              <div className="flex items-center justify-between px-1.5 py-1 border-b border-white/8">
                <span className="text-[9px] text-stone-600 uppercase tracking-wide">Live</span>
                <button
                  type="button"
                  onClick={() => handleToggleEditor(false)}
                  className="text-stone-600 hover:text-stone-400"
                >
                  <X size={10} />
                </button>
              </div>
              <div className="h-16 overflow-hidden [&_.str-video]:h-full [&_.str-video__speaker-layout]:flex-col [&_.str-video__speaker-layout]:gap-0 [&_.str-video__speaker-layout]:p-0.5">
                <StreamTheme>
                  <SpeakerLayout />
                </StreamTheme>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}