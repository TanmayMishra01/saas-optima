import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

// Initialize Express
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));

// Custom lightweight zero-dependency CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Lazy-loaded Gemini initialization helper to prevent startup crashes if key is initially empty
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY environment variable is not configured or holds placeholder. Please add your key in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// Core API: SaaS Auditor (Gemini Cost Optimizer Engine)
// -------------------------------------------------------------
app.post('/api/audit', async (req, res) => {
  try {
    const { expenses } = req.body;
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of active subscriptions for analysis.' });
    }

    const ai = getGeminiClient();

    const formattedExpenses = expenses.map(sub => ({
      service_name: sub.service_name,
      cost: sub.cost,
      billing_cycle: sub.billing_cycle,
      category: sub.category,
      active_seats: sub.active_seats,
      total_seats: sub.total_seats,
      status: sub.status,
    }));

    const systemInstruction = `You are "SaaS-Optima Auditor", a world-class autonomous B2B SaaS subscription auditor and cost-rationalization agent.
Your objective is to inspect a list of company subscriptions and identify three major categories of waste and optimization opportunities:

1. REDUNDANT SOFTWARE OVERLAPS:
   Identify duplicate high-premium products operating in the exact same business categories.
   Common overlaps include:
   - Communication/Video: Zoom vs. Microsoft Teams vs. Slack vs. Google Workspace (Meet).
   - Project Management: Asana vs. Jira vs. Monday.com.
   - Design: Figma vs. Canva vs. Adobe CC.
   Recommend consolidation on a single platform.

2. INACTIVE SEAT LEAKAGE:
   Compare "total_seats" vs "active_seats". For any subscription where total_seats is significantly higher than active_seats, calculate the wasted money and recommend downgrading the seat count.
   Cost wasted = ((total_seats - active_seats) * (total_cost_per_billing_cycle / total_seats)).

3. TIER DOWNGRADE OR BILLING OPTIMIZATIONS:
   Evaluate if certain services are better suited for annual commitments (which usually give a 20% discount) or if specific usage patterns suggest downgrading to a lower pricing tier.

Calculate cost savings values carefully. Offer highly strategic and context-aware action items.`;

    const promptText = `Analyze these SaaS expenses for our organization and identify optimizations:
${JSON.stringify(formattedExpenses, null, 2)}

Provide a strict, professional audit in JSON format. Calculate precise potential monthly/annual savings and return the recommended structured JSON object.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              description: 'List of detected anomalies, redundant software licenses, and direct cost-saving actions.',
              items: {
                type: Type.OBJECT,
                properties: {
                  tool: {
                    type: Type.STRING,
                    description: 'Name of the software tool or service analyzed.',
                  },
                  issue: {
                    type: Type.STRING,
                    description: 'Detailed description of the leakage, duplicate overlap, or downgrade opportunity.',
                  },
                  potential_savings: {
                    type: Type.NUMBER,
                    description: 'The estimated dollar savings from taking the suggested action (normalize to a monthly or billing-period value).',
                  },
                  action_item: {
                    type: Type.STRING,
                    description: 'A direct, professional, clear step-by-step action the administrator should execute.',
                  },
                  severity: {
                    type: Type.STRING,
                    description: 'The level of savings / urgency. Must be one of: "high", "medium", "low".',
                  },
                },
                required: ['tool', 'issue', 'potential_savings', 'action_item', 'severity'],
              },
            },
          },
          required: ['insights'],
        },
      },
    });

    const parsedResponse = JSON.parse(response.text || '{}');
    res.json(parsedResponse);
  } catch (error: any) {
    console.error('Gemini SaaS Auditor execution error:', error.message);
    res.status(500).json({
      error: 'Failed to run SaaS Auditor analysis. If your API Key is missing or invalid, SaaS-Optima will operate using its intelligent local simulation engine.',
      details: error.message
    });
  }
});

// -------------------------------------------------------------
// Core API: Unstructured Invoice OCR Parser
// -------------------------------------------------------------
app.post('/api/parse-invoice', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide raw invoice/email text for parser processing.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a high-accuracy B2B optical scanner and bill ingestion engine. 
Your job is to read unstructured raw text (receipts, subscription email receipts, PDF extracts) and extract the subscription variables for standard B2B entry.

Extract:
1. service_name: Clean brand name of the SaaS/software provider (e.g., Slack, AWS, Datadog, GitHub, Salesforce).
2. cost: Total cost mentioned in the bill as a clean number.
3. billing_cycle: Must be either "monthly" or "annual". Deduce from context (if invoice lists 'per year' or 'yearly', or covers a full year, set 'annual'. Else default 'monthly').
4. category: Group the service into one of these strict values: "Infrastructure", "Communication", "Collaboration", "Sales & Marketing", "Productivity", "Security", "Analytics", or "Other".
5. total_seats: Number of seats, licenses, users, or members billed. If not found, default to 1.
6. active_seats: Estimated active seats. If not found, default to the extracted total_seats value.

Return a strict, valid JSON format.`;

    const promptText = `Parse the following raw billing documentation text:
\"\"\"
${text}
\"\"\"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            service_name: { type: Type.STRING, description: 'SaaS product brand name.' },
            cost: { type: Type.NUMBER, description: 'The total bill value.' },
            billing_cycle: { type: Type.STRING, description: 'Billing cycle. Must be "monthly" or "annual".' },
            category: { type: Type.STRING, description: 'Strict classification category.' },
            total_seats: { type: Type.INTEGER, description: 'Total paid user licenses.' },
            active_seats: { type: Type.INTEGER, description: 'Currently active user seats.' },
          },
          required: ['service_name', 'cost', 'billing_cycle', 'category', 'total_seats', 'active_seats'],
        },
      },
    });

    const parsedResponse = JSON.parse(response.text || '{}');
    res.json(parsedResponse);
  } catch (error: any) {
    console.error('Gemini invoice parser execution error:', error.message);
    res.status(500).json({
      error: 'Failed to execute invoice parsing. Operating via local heuristic engine fallback.',
      details: error.message
    });
  }
});

// -------------------------------------------------------------
// Vite Dev / Prod Frontend Asset Handler
// -------------------------------------------------------------
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    // In development mode: Mount the Vite dev server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development server mounted as middleware.');
  } else {
    // In production mode: Serve static output files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static client handler mounted.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SaaS-Optima Server successfully running at http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap fullstack service:', err);
});
