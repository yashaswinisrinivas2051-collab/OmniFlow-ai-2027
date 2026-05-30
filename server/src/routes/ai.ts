import { Router } from 'express';
import { generateReply, scoreLead, generateSummary, generateSuggestedResponses, generateCampaignMessage } from '../services/gemini.js';
import { getMessages, getConversationById, updateLead, getSettings } from '../services/dataService.js';
import type { ApiResponse, AiReplyRequest, AiLeadScoreRequest } from '../types/index.js';

const router = Router();

/**
 * POST /api/ai/reply
 * Generate an AI reply for a conversation.
 */
router.post('/reply', async (req, res, next) => {
  try {
    const { conversationId, messageHistory, persona } = req.body as AiReplyRequest;

    if (!conversationId || !messageHistory || !Array.isArray(messageHistory)) {
      res.status(400).json({
        success: false,
        error: 'conversationId and messageHistory array are required',
      } satisfies ApiResponse);
      return;
    }

    // Load workspace persona if not explicitly provided
    let aiPersona = persona;
    if (!aiPersona) {
      const settings = await getSettings();
      if (settings?.aiPersona) {
        aiPersona = settings.aiPersona;
      }
    }

    const response = await generateReply(messageHistory, aiPersona);

    res.json({
      success: true,
      data: response,
    } satisfies ApiResponse);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/score-lead
 * Score a lead using AI analysis of conversation history.
 */
router.post('/score-lead', async (req, res, next) => {
  try {
    const { leadId, conversationHistory } = req.body as AiLeadScoreRequest;

    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      res.status(400).json({
        success: false,
        error: 'conversationHistory array is required',
      } satisfies ApiResponse);
      return;
    }

    const result = await scoreLead(conversationHistory);

    // Update lead with AI score and priority if leadId provided
    if (leadId) {
      await updateLead(leadId, {
        aiScore: result.score,
        priority: result.priority,
      });
    }

    res.json({
      success: true,
      data: result,
      message: leadId ? 'Lead scored and updated' : 'Lead scored',
    } satisfies ApiResponse);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/conversation-summary
 * Generate an AI summary of a conversation.
 */
router.post('/conversation-summary', async (req, res, next) => {
  try {
    const { conversationId } = req.body as { conversationId: string };

    if (!conversationId) {
      res.status(400).json({
        success: false,
        error: 'conversationId is required',
      } satisfies ApiResponse);
      return;
    }

    const messages = await getMessages(conversationId);
    const history = messages.map((msg) => ({ role: msg.from, text: msg.text }));
    const summary = await generateSummary(history);

    res.json({
      success: true,
      data: { summary },
    } satisfies ApiResponse);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/suggested-responses
 * Generate 3 suggested reply options for an agent.
 */
router.post('/suggested-responses', async (req, res, next) => {
  try {
    const { conversationId, messageHistory, count } = req.body as {
      conversationId?: string;
      messageHistory?: { role: string; text: string }[];
      count?: number;
    };

    let history = messageHistory;

    // If conversationId provided, fetch messages from data service
    if (!history && conversationId) {
      const { getMessages } = await import('../services/dataService.js');
      const messages = await getMessages(conversationId);
      history = messages.map((msg) => ({ role: msg.from, text: msg.text }));
    }

    if (!history || !Array.isArray(history) || history.length === 0) {
      res.status(400).json({
        success: false,
        error: 'messageHistory array or conversationId is required',
      } satisfies ApiResponse);
      return;
    }

    const suggestions = await generateSuggestedResponses(history, count);

    res.json({
      success: true,
      data: { suggestions },
    } satisfies ApiResponse);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/auto-reply
 * One-shot: fetch conversation, generate AI reply, and save it.
 */
router.post('/auto-reply', async (req, res, next) => {
  try {
    const { conversationId } = req.body as { conversationId: string };

    if (!conversationId) {
      res.status(400).json({
        success: false,
        error: 'conversationId is required',
      } satisfies ApiResponse);
      return;
    }

    const conversation = await getConversationById(conversationId);
    if (!conversation) {
      res.status(404).json({
        success: false,
        error: 'Conversation not found',
      } satisfies ApiResponse);
      return;
    }

    const messages = await getMessages(conversationId);
    const history = messages.map((msg) => ({ role: msg.from, text: msg.text }));

    // Load workspace persona
    let aiPersona: string | undefined;
    try {
      const settings = await getSettings();
      if (settings?.aiPersona) {
        aiPersona = settings.aiPersona;
      }
    } catch {
      // Settings may not exist yet — use default persona
    }

    const response = await generateReply(history, aiPersona);

    res.json({
      success: true,
      data: response,
    } satisfies ApiResponse);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/campaign-message
 * Generate a WhatsApp broadcast message with {{name}} and {{company}} tokens.
 */
router.post('/campaign-message', async (req, res, next) => {
  try {
    const { campaignName, campaignType, audienceDescription } = req.body as {
      campaignName?: string;
      campaignType?: string;
      audienceDescription?: string;
    };

    if (!campaignName || !campaignType) {
      res.status(400).json({
        success: false,
        error: 'campaignName and campaignType are required',
      } satisfies ApiResponse);
      return;
    }

    const message = await generateCampaignMessage({
      campaignName,
      campaignType,
      audienceDescription: audienceDescription ?? 'All leads',
    });

    res.json({
      success: true,
      data: { message },
    } satisfies ApiResponse);
  } catch (error) {
    next(error);
  }
});

export default router;
