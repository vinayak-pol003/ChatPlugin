
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const embedScript = `
(function() {
  // Prevent multiple instances
  if (window.ChatbotWidgetLoaded) return;
  window.ChatbotWidgetLoaded = true;

  // Create container
  const container = document.createElement('div');
  container.id = 'chatbot-widget-container';
  container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';
  document.body.appendChild(container);

  // Load React and render
  const script = document.createElement('script');
  script.src = '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/embed-widget.js';
  script.onload = function() {
    if (window.ChatbotWidgetApp) {
      window.ChatbotWidgetApp.render(container);
    }
  };
  document.head.appendChild(script);
})();
`;

  return new NextResponse(embedScript, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
