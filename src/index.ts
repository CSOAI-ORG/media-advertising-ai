/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * @csoai/media-advertising-ai
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Copyright (c) 2026 CSGA Global. All rights reserved.
 * Part of the CSGA Global MCP Ecosystem.
 *
 * LEGAL NOTICE: This software is provided for informational and advisory
 * purposes only. It does not constitute legal, regulatory, or professional
 * compliance advice. Users should consult qualified legal counsel for
 * jurisdiction-specific compliance requirements.
 *
 * License: CC0-1.0 (Creative Commons Zero v1.0 Universal)
 * SPDX-License-Identifier: CC0-1.0
 *
 * Build Timestamp: 2026-02-26T06:00:00Z
 * Last Modified:   2026-02-26T06:00:00Z
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { handleMediaAiCompliance } from "./tools/media-ai-compliance.js";

const server = new McpServer({
  name: "csoai-media-advertising-ai-mcp",
  version: "1.0.0"
});

// Schemas extracted to avoid TS2589 deep instantiation
const MediaAiComplianceShape = {
  system_name: z.string().describe("Name of the media AI system"),
  ai_function: z.string().describe("Function (programmatic ad targeting, content recommendation, synthetic media, political ads, influencer matching)"),
  content_types: z.string().describe("Content types (video, audio, text, image, interactive)"),
  audience_targeting: z.string().describe("Targeting methods (behavioral, contextual, demographic, lookalike, retargeting)"),
  jurisdiction: z.string().describe("Operating jurisdiction (EU/DSA, US/FTC, UK/ASA, etc.)"),
};

// ─── Tool 1: media_ai_compliance ───
(server.tool as any)(
  "media_ai_compliance",
  "Assess regulatory compliance for AI in media and advertising. Covers programmatic ads, content moderation, deepfakes, and transparency requirements.",
  MediaAiComplianceShape,
  async (args: any) => {
    const result = handleMediaAiCompliance(args.system_name, args.ai_function, args.content_types, args.audience_targeting, args.jurisdiction);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
