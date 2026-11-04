/**
 * Conversation provider adapter.
 * v0.1: 'external-chatgpt' – the user copies the prompt and talks in ChatGPT;
 * completion is confirmed manually. A future 'in-app' provider can implement
 * the same interface with an integrated AI chat.
 */
import { externalLinks } from '../config/appConfig';

export interface ConversationProvider {
  readonly kind: 'external-chatgpt' | 'in-app';
  /** Make the prompt available to the conversation partner. */
  deliverPrompt(prompt: string): Promise<'copied' | 'failed'>;
  /** URL to open, if the conversation happens elsewhere. */
  externalUrl?: string;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through to legacy path */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

export const chatGptProvider: ConversationProvider = {
  kind: 'external-chatgpt',
  externalUrl: externalLinks.chatgpt,
  async deliverPrompt(prompt) {
    return (await copyText(prompt)) ? 'copied' : 'failed';
  },
};
