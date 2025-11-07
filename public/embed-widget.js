(function() {
  window.ChatbotWidgetApp = {
    render: function(container) {
      // Create iframe for isolation
      const iframe = document.createElement('iframe');
      iframe.style.cssText = `
        width: 384px;
        height: 600px;
        border: none;
        border-radius: 12px;
        box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
      `;
      
      container.appendChild(iframe);

      // Set iframe content
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        </head>
        <body style="margin: 0; padding: 0; background: transparent;">
          <div id="root" style="height: 100%; display: flex;"></div>
          <script src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/chatbot.js"><\/script>
        </body>
        </html>
      `);
    }
  };
})();
