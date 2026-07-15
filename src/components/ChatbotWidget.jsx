import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HiChatBubbleLeftRight,
  HiPaperAirplane,
  HiSparkles,
  HiXMark,
} from 'react-icons/hi2';
import api from '../utils/api';

const starterPrompts = [
  'Tell me about Saikat',
  'Show his best projects',
  'What skills does he have?',
  'How can I contact him?',
];

const welcomeMessage = {
  id: 'welcome-message',
  role: 'assistant',
  content:
    "Hi, I'm Saikat's AI portfolio assistant. Ask me about his projects, skills, resume, experience, or contact details.",
};

const buildMessage = (role, content) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
});

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  'The assistant is unavailable right now. Please try again soon.';

const ChatbotWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isOpen]);

  const sendMessage = async (messageText = inputValue) => {
    const cleanMessage = messageText.trim();
    if (!cleanMessage || isSending) return;

    const history = messages
      .filter((message) => ['user', 'assistant'].includes(message.role))
      .slice(-8)
      .map(({ role, content }) => ({ role, content }));

    const userMessage = buildMessage('user', cleanMessage);
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInputValue('');
    setIsOpen(true);
    setIsSending(true);

    try {
      const response = await api.post(
        '/chatbot/message',
        {
          message: cleanMessage,
          history,
          page: `${location.pathname}${location.search}`,
        },
        { retry: false, cache: false }
      );

      setMessages((currentMessages) => [
        ...currentMessages,
        buildMessage(
          'assistant',
          response.data?.data?.reply ||
            'I found your question, but I could not create a clear answer.'
        ),
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        buildMessage('assistant', getErrorMessage(error)),
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`chatbot-widget ${isOpen ? 'chatbot-widget--open' : ''}`}>
      {isOpen && (
        <section
          className="chatbot-panel"
          aria-label="Saikat portfolio chatbot"
        >
          <div className="chatbot-panel__header">
            <div className="chatbot-panel__identity">
              <span className="chatbot-panel__avatar">
                <HiSparkles />
              </span>
              <div>
                <p>Talk with Me</p>
              </div>
            </div>
            <button
              type="button"
              className="chatbot-panel__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <HiXMark />
            </button>
          </div>

          <div className="chatbot-panel__messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-message chatbot-message--${message.role}`}
              >
                <p>{message.content}</p>
              </div>
            ))}

            {isSending && (
              <div className="chatbot-message chatbot-message--assistant">
                <div className="chatbot-typing" aria-label="Assistant typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-panel__prompts" aria-label="Suggested questions">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                disabled={isSending}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="chatbot-panel__form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <label className="sr-only" htmlFor="portfolio-chatbot-input">
              Ask a question about Saikat
            </label>
            <input
              id="portfolio-chatbot-input"
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Ask about projects, skills, resume..."
              maxLength={900}
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              aria-label="Send chatbot message"
            >
              <HiPaperAirplane />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chatbot-fab"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
        aria-expanded={isOpen}
      >
        {isOpen ? <HiXMark /> : <HiChatBubbleLeftRight />}
        <span className="chatbot-fab__pulse" />
      </button>
    </div>
  );
};

export default ChatbotWidget;
