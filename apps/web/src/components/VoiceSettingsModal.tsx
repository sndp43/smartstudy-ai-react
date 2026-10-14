// apps/web/src/components/VoiceSettingsModal.tsx
import React, { useState, useEffect } from "react";
import {
  VoiceConfig,
  VoicePersona,
  getVoiceConfig,
  saveVoiceConfig,
  DEFAULT_VOICE_CONFIG,
  getAvailableSystemVoices,
  previewVoice,
  stopSpeech,
  onVoiceConfigChange,
} from "../services/voiceService";

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<VoiceConfig>(getVoiceConfig);
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getVoiceConfig());
      setSystemVoices(getAvailableSystemVoices());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleVoiceList = () => {
      setSystemVoices(getAvailableSystemVoices());
    };
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = handleVoiceList;
    }
  }, []);

  if (!isOpen) return null;

  const handlePersonaSelect = (persona: VoicePersona) => {
    const updated = {
      ...config,
      persona,
      preferStudioAudio: persona === "lady_studio",
    };
    setConfig(updated);
  };

  const handleTestAudio = async () => {
    if (isPlayingTest) {
      stopSpeech();
      setIsPlayingTest(false);
      return;
    }
    setIsPlayingTest(true);
    try {
      await previewVoice(config, "Namaste! Welcome to SmartStudy! अ, आ, इ, ई... खूप छान काम करत आहात!");
    } finally {
      setIsPlayingTest(false);
    }
  };

  const handleSave = () => {
    saveVoiceConfig(config);
    stopSpeech();
    onClose();
  };

  const handleReset = () => {
    setConfig({ ...DEFAULT_VOICE_CONFIG });
    saveVoiceConfig(DEFAULT_VOICE_CONFIG);
  };

  return (
    <div
      className="student-modal-backdrop"
      role="presentation"
      onMouseDown={() => { stopSpeech(); onClose(); }}
      style={{ zIndex: 12000 }}
    >
      <div
        className="student-modal-card voice-settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ maxWidth: 560, width: "95%" }}
      >
        <div className="student-modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 id="voice-modal-title" style={{ margin: 0, fontSize: "1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
              <span>🔊</span> Voice Settings (आवाज सेटिंग)
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--muted, #64748b)" }}>
              Choose your preferred narrator voice for all skills, practice Q&A, and learning charts.
            </p>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={() => { stopSpeech(); onClose(); }}
            aria-label="Close voice settings"
            style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "var(--muted)" }}
          >
            ✕
          </button>
        </div>

        <div className="student-modal-body" style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "70vh", overflowY: "auto", padding: "16px 4px" }}>
          
          {/* Persona Selection */}
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.9rem", display: "block", marginBottom: 8 }}>
              Select Voice Persona:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              
              {/* Option 1: Lady Studio (Default) */}
              <button
                type="button"
                className={`voice-persona-card ${config.persona === "lady_studio" ? "active" : ""}`}
                onClick={() => handlePersonaSelect("lady_studio")}
                style={{
                  border: config.persona === "lady_studio" ? "2px solid #0d9488" : "1px solid #cbd5e1",
                  backgroundColor: config.persona === "lady_studio" ? "#f0fdfa" : "#fff",
                  padding: "12px",
                  borderRadius: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.4rem" }}>👩</span>
                  <span style={{ fontSize: "0.72rem", padding: "2px 6px", borderRadius: 6, background: "#ccfbf1", color: "#0f766e", fontWeight: 700 }}>
                    DEFAULT ⭐
                  </span>
                </div>
                <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>Lady Voice (14 Swar)</strong>
                <small style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  Authentic studio pronunciation as heard in 14 Swar Marathi & Indian English charts.
                </small>
              </button>

              {/* Option 2: Cheerful Kid Teacher */}
              <button
                type="button"
                className={`voice-persona-card ${config.persona === "kid_friendly" ? "active" : ""}`}
                onClick={() => handlePersonaSelect("kid_friendly")}
                style={{
                  border: config.persona === "kid_friendly" ? "2px solid #0d9488" : "1px solid #cbd5e1",
                  backgroundColor: config.persona === "kid_friendly" ? "#f0fdfa" : "#fff",
                  padding: "12px",
                  borderRadius: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.4rem" }}>👧</span>
                  <span style={{ fontSize: "0.72rem", padding: "2px 6px", borderRadius: 6, background: "#fef3c7", color: "#b45309", fontWeight: 700 }}>
                    KID-FRIENDLY
                  </span>
                </div>
                <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>Cheerful Teacher</strong>
                <small style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  Lively, high-pitch and friendly encouraging tone ideal for kindergarteners.
                </small>
              </button>

              {/* Option 3: Calm Male Voice */}
              <button
                type="button"
                className={`voice-persona-card ${config.persona === "male" ? "active" : ""}`}
                onClick={() => handlePersonaSelect("male")}
                style={{
                  border: config.persona === "male" ? "2px solid #0d9488" : "1px solid #cbd5e1",
                  backgroundColor: config.persona === "male" ? "#f0fdfa" : "#fff",
                  padding: "12px",
                  borderRadius: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.4rem" }}>👨</span>
                </div>
                <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>Gentle Narrator</strong>
                <small style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  Calm, deep storybook narrator voice for relaxed bedtime reading.
                </small>
              </button>

              {/* Option 4: Custom System Voice */}
              <button
                type="button"
                className={`voice-persona-card ${config.persona === "system_custom" ? "active" : ""}`}
                onClick={() => handlePersonaSelect("system_custom")}
                style={{
                  border: config.persona === "system_custom" ? "2px solid #0d9488" : "1px solid #cbd5e1",
                  backgroundColor: config.persona === "system_custom" ? "#f0fdfa" : "#fff",
                  padding: "12px",
                  borderRadius: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.4rem" }}>⚙️</span>
                </div>
                <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>Custom Device Voice</strong>
                <small style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  Select from any installed voice on your Windows or browser system.
                </small>
              </button>

            </div>
          </div>

          {/* Custom Voice Dropdown (Visible if system_custom or for fine-tuning) */}
          {config.persona === "system_custom" && (
            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: 6 }}>
                Select Installed System Voice ({systemVoices.length} available):
              </label>
              <select
                className="login-control"
                value={config.customVoiceURI || ""}
                onChange={(e) => {
                  const selected = systemVoices.find((v) => v.voiceURI === e.target.value);
                  setConfig({
                    ...config,
                    customVoiceURI: e.target.value,
                    customVoiceName: selected?.name || e.target.value,
                  });
                }}
                style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #cbd5e1" }}
              >
                <option value="">-- Choose Installed Voice --</option>
                {systemVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Speed & Pitch Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "#f8fafc", padding: "14px", borderRadius: 10, border: "1px solid #e2e8f0" }}>
            
            {/* Speed slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Speaking Speed:</span>
                <span style={{ color: "#0d9488", fontWeight: 700 }}>
                  {config.rate.toFixed(2)}x {config.rate <= 0.8 ? "🐢 (Gentle / Learner)" : config.rate >= 1.05 ? "🐇 (Fast)" : "🚶 (Natural)"}
                </span>
              </div>
              <input
                type="range"
                min="0.70"
                max="1.25"
                step="0.05"
                value={config.rate}
                onChange={(e) => setConfig({ ...config, rate: parseFloat(e.target.value) })}
                style={{ width: "100%", accentColor: "#0d9488" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#94a3b8" }}>
                <span>0.7x (Slow)</span>
                <span>0.88x (Recommended for Class 1)</span>
                <span>1.25x (Fast)</span>
              </div>
            </div>

            {/* Pitch slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Pitch / Tone:</span>
                <span style={{ color: "#0d9488", fontWeight: 700 }}>
                  {config.pitch.toFixed(2)}x {config.pitch >= 1.15 ? "👧 (High / Cute)" : config.pitch <= 0.95 ? "👨 (Deep)" : "👩 (Natural)"}
                </span>
              </div>
              <input
                type="range"
                min="0.80"
                max="1.35"
                step="0.05"
                value={config.pitch}
                onChange={(e) => setConfig({ ...config, pitch: parseFloat(e.target.value) })}
                style={{ width: "100%", accentColor: "#0d9488" }}
              />
            </div>

          </div>

          {/* Test Voice Sample Action */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              className="primary-btn"
              onClick={handleTestAudio}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "10px 16px",
                background: isPlayingTest ? "#dc2626" : "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <span>{isPlayingTest ? "⏹️ Stop Sample" : "▶️ Test Voice Sample (आवाज ऐका)"}</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="student-modal-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
          <button
            type="button"
            className="confirm-cancel"
            onClick={handleReset}
            style={{ fontSize: "0.85rem", background: "transparent", border: "1px solid #cbd5e1", borderRadius: 6, padding: "6px 12px", cursor: "pointer" }}
          >
            Reset to Default (14 Swar)
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="confirm-cancel"
              onClick={() => { stopSpeech(); onClose(); }}
              style={{ padding: "6px 14px", borderRadius: 6, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="login-continue"
              onClick={handleSave}
              style={{ width: "auto", margin: 0, padding: "8px 20px", background: "#0d9488", color: "#fff", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
            >
              Save Voice Settings ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VoiceSettingsButton: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<VoiceConfig>(getVoiceConfig);

  useEffect(() => {
    return onVoiceConfigChange((newConfig) => {
      setCurrentConfig(newConfig);
    });
  }, []);

  const personaLabel =
    currentConfig.persona === "lady_studio"
      ? "👩 Lady Voice"
      : currentConfig.persona === "kid_friendly"
      ? "👧 Kid Voice"
      : currentConfig.persona === "male"
      ? "👨 Male Voice"
      : "⚙️ Custom Voice";

  return (
    <>
      <button
        type="button"
        className={className || "voice-header-btn"}
        onClick={() => setIsOpen(true)}
        title="Voice & Audio Settings: Configure voice, speed & pitch for all skills and charts"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 20,
          background: "rgba(13, 148, 136, 0.12)",
          border: "1px solid rgba(13, 148, 136, 0.3)",
          color: "#0f766e",
          fontSize: "0.82rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s ease",
          ...style,
        }}
      >
        <span>🔊</span>
        <span>{personaLabel}</span>
      </button>

      <VoiceSettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
