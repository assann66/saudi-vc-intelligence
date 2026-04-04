"use client";

import { forwardRef } from "react";

interface TemplateContent {
  title: string;
  subtitle: string;
  body: string;
  bullets: string[];
  footer: string;
}

interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface TemplatePreviewProps {
  content: TemplateContent;
  colorScheme: TemplateColors;
  fonts: { heading: string; body: string };
  layout: string;
  isRTL: boolean;
  scale?: number;
}

export const TemplatePreview = forwardRef<HTMLDivElement, TemplatePreviewProps>(
  function TemplatePreview({ content, colorScheme, fonts, layout, isRTL, scale = 0.4 }, ref) {
    const width = 1080;
    const height = 1350;

    const alignClass = isRTL ? "text-right" : "text-left";
    const dirAttr = isRTL ? "rtl" : "ltr";

    return (
      <div
        style={{
          width: width * scale,
          height: height * scale,
          overflow: "hidden",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          ref={ref}
          dir={dirAttr}
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            background: `linear-gradient(135deg, ${colorScheme.background} 0%, ${colorScheme.primary}33 50%, ${colorScheme.background} 100%)`,
            color: colorScheme.text,
            fontFamily: fonts.body,
            padding: 80,
            display: "flex",
            flexDirection: "column",
            justifyContent: layout === "centered" ? "center" : "flex-start",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: "absolute",
              top: -100,
              right: isRTL ? -100 : "auto",
              left: isRTL ? "auto" : -100,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colorScheme.secondary}15 0%, transparent 70%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -50,
              left: isRTL ? -50 : "auto",
              right: isRTL ? "auto" : -50,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colorScheme.accent}10 0%, transparent 70%)`,
            }}
          />

          {/* Top accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: `linear-gradient(90deg, ${colorScheme.secondary}, ${colorScheme.accent})`,
            }}
          />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: layout === "centered" ? "center" : "space-between" }}>
            {/* Header */}
            <div className={alignClass}>
              <h1
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 64,
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: 16,
                  background: `linear-gradient(135deg, ${colorScheme.text}, ${colorScheme.secondary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {content.title}
              </h1>
              <p
                style={{
                  fontSize: 28,
                  color: colorScheme.secondary,
                  fontWeight: 500,
                  marginBottom: 40,
                  opacity: 0.9,
                }}
              >
                {content.subtitle}
              </p>
            </div>

            {/* Body */}
            <div className={alignClass} style={{ flex: layout === "centered" ? 0 : 1 }}>
              <p
                style={{
                  fontSize: 30,
                  lineHeight: 1.7,
                  color: `${colorScheme.text}CC`,
                  marginBottom: 40,
                }}
              >
                {content.body}
              </p>

              {/* Bullets */}
              <div style={{ marginBottom: 40 }}>
                {content.bullets.map((bullet, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 20,
                      flexDirection: isRTL ? "row-reverse" : "row",
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: i % 2 === 0 ? colorScheme.secondary : colorScheme.accent,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 26, color: `${colorScheme.text}BB` }}>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: `2px solid ${colorScheme.secondary}33`,
                paddingTop: 24,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ fontSize: 22, color: `${colorScheme.text}88` }}>{content.footer}</p>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${colorScheme.secondary}, ${colorScheme.accent})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                VC
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
