'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type OutputMode = 'text' | 'speech' | 'both';
type Language = 'bn' | 'en' | 'hi';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(true); // Show settings initially
  const [outputMode, setOutputMode] = useState<OutputMode>('both');
  const [language, setLanguage] = useState<Language>('bn');
  const [isRecording, setIsRecording] = useState(false);
  const [isPreferencesSet, setIsPreferencesSet] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [lastAudioUrl, setLastAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handlePlay = () => setIsAudioPlaying(true);
      const handlePause = () => setIsAudioPlaying(false);
      const handleEnded = () => setIsAudioPlaying(false);

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        // Set language based on selection
        const langMap: { [key in Language]: string } = {
          'bn': 'bn-BD',
          'en': 'en-US',
          'hi': 'hi-IN'
        };
        recognitionRef.current.lang = langMap[language];

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
        };

        recognitionRef.current.onerror = () => {
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, [language]);

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleStartChat = () => {
    setIsPreferencesSet(true);
    setShowSettings(false);
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const replayAudio = () => {
    if (audioRef.current && lastAudioUrl) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages,
          language: language,
          outputMode: outputMode
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Add assistant message (only if text mode or both)
      if (outputMode === 'text' || outputMode === 'both') {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      }

      // Play audio (only if speech mode or both)
      if ((outputMode === 'speech' || outputMode === 'both') && data.audioUrl && audioRef.current) {
        setLastAudioUrl(data.audioUrl);
        audioRef.current.src = data.audioUrl;
        audioRef.current.play();

        // If speech only, show a visual indicator
        if (outputMode === 'speech') {
          setMessages(prev => [...prev, { role: 'assistant', content: '🔊 Playing audio response...' }]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'দুঃখিত, একটি ত্রুটি হয়েছে। (Sorry, an error occurred.)'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#F5F1E8] via-[#E8F4F8] to-[#FFF5E6]">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl">📡</div>
        <div className="absolute top-40 right-20 text-6xl">📶</div>
        <div className="absolute bottom-20 left-20 text-7xl">📱</div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="bg-white rounded-sm shadow-2xl max-w-md w-full p-8 border-4 border-[#006D77] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button (only show if preferences are already set) */}
            {isPreferencesSet && (
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
                title="Close"
              >
                ×
              </button>
            )}
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">📡</div>
              <h2 className="text-2xl font-bold text-[#006D77] mb-2">Welcome to Horizon Telecom</h2>
              <p className="text-sm text-gray-600">Set your preferences before we start</p>
            </div>

            <div className="space-y-6">
              {/* Language Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Response Language</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setLanguage('bn')}
                    className={`px-4 py-3 rounded-sm border-2 font-medium transition-all ${
                      language === 'bn'
                        ? 'bg-[#006D77] text-white border-[#006D77]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#006D77]'
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-3 rounded-sm border-2 font-medium transition-all ${
                      language === 'en'
                        ? 'bg-[#006D77] text-white border-[#006D77]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#006D77]'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`px-4 py-3 rounded-sm border-2 font-medium transition-all ${
                      language === 'hi'
                        ? 'bg-[#006D77] text-white border-[#006D77]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#006D77]'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              {/* Output Mode Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Response Format</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setOutputMode('both')}
                    className={`w-full px-4 py-3 rounded-sm border-2 font-medium transition-all text-left ${
                      outputMode === 'both'
                        ? 'bg-[#D81B60] text-white border-[#D81B60]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#D81B60]'
                    }`}
                  >
                    <span className="block font-bold">💬 Text + Voice</span>
                    <span className="text-xs opacity-90">Get both text and audio responses</span>
                  </button>
                  <button
                    onClick={() => setOutputMode('text')}
                    className={`w-full px-4 py-3 rounded-sm border-2 font-medium transition-all text-left ${
                      outputMode === 'text'
                        ? 'bg-[#D81B60] text-white border-[#D81B60]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#D81B60]'
                    }`}
                  >
                    <span className="block font-bold">📝 Text Only</span>
                    <span className="text-xs opacity-90">Read responses without audio</span>
                  </button>
                  <button
                    onClick={() => setOutputMode('speech')}
                    className={`w-full px-4 py-3 rounded-sm border-2 font-medium transition-all text-left ${
                      outputMode === 'speech'
                        ? 'bg-[#D81B60] text-white border-[#D81B60]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#D81B60]'
                    }`}
                  >
                    <span className="block font-bold">🔊 Voice Only</span>
                    <span className="text-xs opacity-90">Listen to audio responses</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handleStartChat}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#006D77] to-[#0A7A8A] text-white rounded-sm font-bold text-lg hover:from-[#005860] hover:to-[#006D77] transition-all shadow-lg"
              >
                Start Chat 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#006D77] to-[#0A7A8A] shadow-lg px-6 py-5 border-b-4 border-[#D81B60]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📡</span>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-md">
                Horizon Telecom
              </h1>
              <p className="text-sm text-[#A8DADC] mt-0.5">
                AI-Powered Customer Support • Available 24/7
              </p>
            </div>
          </div>
          {isPreferencesSet && (
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-sm font-medium transition-all border border-white/30"
            >
              ⚙️ Settings
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 relative">
        {messages.length === 0 && (
          <div className="text-center mt-16 max-w-2xl mx-auto">
            <div className="text-7xl mb-4">📡</div>
            <h2 className="text-3xl font-bold text-[#006D77] mb-3">স্বাগতম!</h2>
            <p className="text-lg text-[#457B9D] mb-6">Welcome to Horizon Telecom Support</p>
            <div className="bg-white/80 backdrop-blur-sm rounded-sm p-6 shadow-xl border-2 border-[#52B788]/30">
              <p className="text-sm text-gray-700 font-medium mb-3">Try asking:</p>
              <div className="space-y-2 text-left">
                <div className="bg-gradient-to-r from-[#FFE5EC] to-[#FFF0F5] px-4 py-3 rounded-sm border-l-4 border-[#D81B60]">
                  <p className="text-sm text-gray-800">"আপনাদের কি কি প্ল্যান আছে?"</p>
                  <p className="text-xs text-gray-600 mt-1">What plans do you have?</p>
                </div>
                <div className="bg-gradient-to-r from-[#E0F7F4] to-[#F0FBFA] px-4 py-3 rounded-sm border-l-4 border-[#006D77]">
                  <p className="text-sm text-gray-800">"কোনো অফার আছে কি?"</p>
                  <p className="text-xs text-gray-600 mt-1">Are there any offers?</p>
                </div>
                <div className="bg-gradient-to-r from-[#FFF8E1] to-[#FFFBF0] px-4 py-3 rounded-sm border-l-4 border-[#FFA726]">
                  <p className="text-sm text-gray-800">"আমার বিল কত?"</p>
                  <p className="text-xs text-gray-600 mt-1">What is my bill?</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md px-5 py-3.5 rounded-sm shadow-lg ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#D81B60] to-[#C2185B] text-white border-2 border-[#AD1457]/20'
                  : 'bg-white/90 backdrop-blur-sm text-gray-800 border-2 border-[#006D77]/20'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#006D77]/20">
                  <span className="text-xl">📡</span>
                  <span className="text-xs font-semibold text-[#006D77]">Horizon AI</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/90 backdrop-blur-sm px-5 py-4 rounded-sm shadow-lg border-2 border-[#006D77]/20">
              <div className="flex items-center gap-3">
                <span className="text-xl">📡</span>
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 bg-[#D81B60] rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-[#006D77] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2.5 h-2.5 bg-[#52B788] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audio Controls */}
      {lastAudioUrl && (outputMode === 'speech' || outputMode === 'both') && (
        <div className="bg-gradient-to-r from-[#006D77]/10 to-[#52B788]/10 backdrop-blur-sm border-t border-[#006D77]/20 px-6 py-3">
          <div className="flex items-center justify-center gap-3 max-w-4xl mx-auto">
            <span className="text-sm font-medium text-[#006D77]">🎧 Audio Controls:</span>
            <button
              onClick={playAudio}
              disabled={isAudioPlaying}
              className="px-4 py-2 bg-[#006D77] hover:bg-[#005860] text-white rounded-sm font-medium transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>▶️</span>
              <span className="text-sm">Play</span>
            </button>
            <button
              onClick={pauseAudio}
              disabled={!isAudioPlaying}
              className="px-4 py-2 bg-[#D81B60] hover:bg-[#C2185B] text-white rounded-sm font-medium transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>⏸</span>
              <span className="text-sm">Pause</span>
            </button>
            <button
              onClick={replayAudio}
              className="px-4 py-2 bg-[#52B788] hover:bg-[#40916C] text-white rounded-sm font-medium transition-all shadow-md flex items-center gap-2"
            >
              <span>🔄</span>
              <span className="text-sm">Replay</span>
            </button>
            {isAudioPlaying && (
              <div className="flex items-center gap-2 text-[#006D77] animate-pulse">
                <div className="w-1 h-3 bg-[#D81B60] rounded-full animate-bounce"></div>
                <div className="w-1 h-4 bg-[#006D77] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-3 bg-[#52B788] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-xs font-medium ml-1">Playing...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="relative bg-white/80 backdrop-blur-md border-t-2 border-[#006D77]/30 px-6 py-5 shadow-2xl">
        <div className="flex space-x-3 max-w-4xl mx-auto">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
            className={`px-4 py-3.5 rounded-sm font-semibold shadow-lg transition-all ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-[#52B788] hover:bg-[#40916C] text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            {isRecording ? '🔴' : '🎤'}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder={isRecording ? 'Listening...' : 'আপনার প্রশ্ন লিখুন... (Type your question...)'}
            className="flex-1 px-5 py-3.5 border-2 border-[#006D77]/30 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D81B60] focus:border-transparent bg-white/90 text-gray-800 placeholder-gray-500 shadow-sm"
            disabled={loading || isRecording}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-7 py-3.5 bg-gradient-to-r from-[#D81B60] to-[#C2185B] text-white rounded-sm hover:from-[#C2185B] hover:to-[#AD1457] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Send
          </button>
        </div>
      </div>

      {/* Hidden audio player */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
