/**
 * Alap AI Live Chat Integration Utility
 * Client ID: 2c8b94ad-421a-4a4e-a029-f86d59d21330
 */

export function openAlapaiChat(): boolean {
  try {
    const root = document.getElementById('alapai-widget-root');
    if (root && root.shadowRoot) {
      const chatWindow = root.shadowRoot.querySelector('.alapai-chat-window');
      const chatButton = root.shadowRoot.querySelector<HTMLElement>('.alapai-chat-button');
      if (chatButton) {
        if (!chatWindow || !chatWindow.classList.contains('open')) {
          chatButton.click();
        }
        return true;
      }
    } else {
      // If widget is still loading, retry after short intervals
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const el = document.getElementById('alapai-widget-root');
        if (el && el.shadowRoot) {
          const btn = el.shadowRoot.querySelector<HTMLElement>('.alapai-chat-button');
          const win = el.shadowRoot.querySelector('.alapai-chat-window');
          if (btn) {
            if (!win || !win.classList.contains('open')) {
              btn.click();
            }
            clearInterval(interval);
          }
        }
        if (attempts >= 15) {
          clearInterval(interval);
        }
      }, 200);
    }
  } catch (err) {
    console.error('Error opening Alap AI chat:', err);
  }
  return false;
}

export function isAlapaiChatOpen(): boolean {
  try {
    const root = document.getElementById('alapai-widget-root');
    if (root && root.shadowRoot) {
      const chatWindow = root.shadowRoot.querySelector('.alapai-chat-window');
      return chatWindow ? chatWindow.classList.contains('open') : false;
    }
  } catch (_) {}
  return false;
}
