import { useCallback, useState } from 'react';
import api from '@/lib/api';
import type { LeadPriority, Message } from '@/types';

// ─── AI Reply ──────────────────────────────────────────────────────────────

interface AiReplyResult {
  reply: string;
  confidence: number;
  intent?: string;
  sentiment?: string;
}

export function useGenerateAiReply() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiReplyResult | null>(null);

  const generate = useCallback(async (
    conversationId: string,
    messageHistory: { role: string; text: string }[],
    persona?: string,
  ): Promise<AiReplyResult | null> => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await api.post<AiReplyResult>('/ai/reply', {
        conversationId,
        messageHistory,
        persona,
      });
      setLoading(false);
      setResult(response);
      return response;
    } catch (err: unknown) {
      const axiosErr = err as any;
      const message = axiosErr?.response?.data?.error || axiosErr?.message || 'Failed to generate AI reply';
      setError(message);
      setLoading(false);
      return null;
    }
  }, []);

  return { generate, loading, error, result };
}

// ─── Lead Scoring ──────────────────────────────────────────────────────────

interface LeadScoreResult {
  score: number;
  priority: LeadPriority;
  summary: string;
  suggestedAction: string;
}

export function useAiLeadScore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LeadScoreResult | null>(null);

  const score = useCallback(async (
    leadId: string,
    conversationHistory: { role: string; text: string }[],
  ): Promise<LeadScoreResult | null> => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await api.post<LeadScoreResult>('/ai/score-lead', {
        leadId,
        conversationHistory,
      });
      setLoading(false);
      setResult(response);
      return response;
    } catch (err: unknown) {
      const axiosErr = err as any;
      const message = axiosErr?.response?.data?.error || axiosErr?.message || 'Failed to score lead';
      setError(message);
      setLoading(false);
      return null;
    }
  }, []);

  return { score, loading, error, result };
}

// ─── Conversation Summary ──────────────────────────────────────────────────

export function useAiSummary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const generate = useCallback(async (conversationId: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const response = await api.post<{ summary: string }>('/ai/conversation-summary', {
        conversationId,
      });
      setLoading(false);
      setSummary(response.summary);
      return response.summary;
    } catch (err: unknown) {
      const axiosErr = err as any;
      const message = axiosErr?.response?.data?.error || axiosErr?.message || 'Failed to generate summary';
      setError(message);
      setLoading(false);
      return null;
    }
  }, []);

  return { generate, loading, error, summary };
}

// ─── Suggested Responses ───────────────────────────────────────────────────

export function useSuggestedResponses() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generate = useCallback(async (
    conversationId: string,
    messageHistory?: { role: string; text: string }[],
    count?: number,
  ): Promise<string[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<{ suggestions: string[] }>('/ai/suggested-responses', {
        conversationId,
        messageHistory,
        count,
      });
      const list = response.suggestions ?? [];
      setSuggestions(list);
      setLoading(false);
      return list;
    } catch (err: unknown) {
      const axiosErr = err as any;
      const message = axiosErr?.response?.data?.error || axiosErr?.message || 'Failed to generate suggestions';
      setError(message);
      setLoading(false);
      return [];
    }
  }, []);

  return { generate, loading, error, suggestions };
}

// ─── Combined Sentiment & Intent Analysis ──────────────────────────────────

export function useSentimentAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    intent: string;
    sentiment: string;
    confidence: number;
  } | null>(null);

  const analyze = useCallback(async (messages: Message[]): Promise<void> => {
    if (messages.length === 0) return;
    setLoading(true);
    setError(null);

    const messageHistory = messages.map((m) => ({ role: m.from, text: m.text }));

    try {
      const response = await api.post<AiReplyResult>('/ai/reply', {
        conversationId: messages[0].conversationId,
        messageHistory,
      });
      setAnalysis({
        intent: response.intent || 'other',
        sentiment: response.sentiment || 'neutral',
        confidence: response.confidence,
      });
      setLoading(false);
    } catch (err: unknown) {
      const axiosErr = err as any;
      const message = axiosErr?.response?.data?.error || axiosErr?.message || 'Analysis failed';
      setError(message);
      setLoading(false);
    }
  }, []);

  return { analyze, loading, error, analysis };
}

// ─── Campaign Message Generator ────────────────────────────────────────────

export function useGenerateCampaignMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (params: {
      campaignName: string;
      campaignType: string;
      audienceDescription: string;
    }): Promise<string | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post<{ message: string }>('/ai/campaign-message', params);
        setLoading(false);
        return response.message;
      } catch (err: unknown) {
        const axiosErr = err as any;
        const message =
          axiosErr?.response?.data?.error ||
          axiosErr?.message ||
          'Failed to generate campaign message';
        setError(message);
        setLoading(false);
        return null;
      }
    },
    [],
  );

  return { generate, loading, error };
}
