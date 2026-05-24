"use client";

import { useState } from "react";

type HttpMethod = "GET" | "POST" | "DELETE";

interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Endpoint {
  method: HttpMethod;
  path: string;
  description: string;
  queryParams?: Param[];
  requestBody?: {
    contentType: string;
    fields: Param[];
    example: string;
  };
  response: {
    success: { status: number; description: string; example: string };
    errors: { status: number; body: string }[];
  };
}

interface ResourceGroup {
  id: string;
  label: string;
  icon: string;
  color: "amber" | "emerald" | "red" | "sky";
  endpoints: Endpoint[];
}

const METHOD_STYLE: Record<HttpMethod, string> = {
  GET:    "border-emerald-700/60 bg-emerald-950/40 text-emerald-400",
  POST:   "border-amber-700/60 bg-amber-950/40 text-amber-400",
  DELETE: "border-red-800/60 bg-red-950/40 text-red-400",
};

const GROUPS: ResourceGroup[] = [
  {
    id: "knowledge",
    label: "KNOWLEDGE BASE",
    icon: "◉",
    color: "amber",
    endpoints: [
      {
        method: "GET",
        path: "/api/knowledge",
        description: "List all knowledge documents, ordered newest first.",
        queryParams: [
          { name: "tag", type: "string", required: false, description: "Filter by tag (e.g. medical, engineering). Case-insensitive substring match." },
        ],
        response: {
          success: {
            status: 200,
            description: "Array of Knowledge objects.",
            example: `[
  {
    "id": "cm9x...",
    "title": "Water Purification Protocol",
    "description": "Step-by-step guide for field water treatment.",
    "filePath": "/uploads/1716000000-water.pdf",
    "tags": "survival,medical",
    "uploadedAt": "2026-05-24T10:30:00.000Z"
  }
]`,
          },
          errors: [
            { status: 500, body: '{ "error": "Failed to fetch documents" }' },
          ],
        },
      },
      {
        method: "POST",
        path: "/api/knowledge",
        description:
          "Upload a new knowledge document. Accepts either multipart/form-data (with optional file attachment) or JSON.",
        requestBody: {
          contentType: "multipart/form-data  OR  application/json",
          fields: [
            { name: "title",       type: "string", required: true,  description: "Document title." },
            { name: "description", type: "string", required: false, description: "Short summary." },
            { name: "tags",        type: "string", required: false, description: "Comma-separated tag list (e.g. medical,engineering)." },
            { name: "file",        type: "File",   required: false, description: "Binary attachment. Saved to /public/uploads/. (multipart only)" },
            { name: "filePath",    type: "string", required: false, description: "Pre-existing path string. (JSON only)" },
          ],
          example: `// JSON body
{
  "title": "Water Purification Protocol",
  "description": "Step-by-step guide for field water treatment.",
  "tags": "survival,medical",
  "filePath": ""
}`,
        },
        response: {
          success: {
            status: 201,
            description: "The created Knowledge object.",
            example: `{
  "id": "cm9x...",
  "title": "Water Purification Protocol",
  "description": "Step-by-step guide for field water treatment.",
  "filePath": "",
  "tags": "survival,medical",
  "uploadedAt": "2026-05-24T10:30:00.000Z"
}`,
          },
          errors: [
            { status: 400, body: '{ "error": "Title is required" }' },
            { status: 500, body: '{ "error": "Failed to create document" }' },
          ],
        },
      },
      {
        method: "GET",
        path: "/api/knowledge/[id]",
        description: "Retrieve a single knowledge document by its ID.",
        response: {
          success: {
            status: 200,
            description: "A single Knowledge object.",
            example: `{
  "id": "cm9x...",
  "title": "Water Purification Protocol",
  "description": "Step-by-step guide for field water treatment.",
  "filePath": "/uploads/1716000000-water.pdf",
  "tags": "survival,medical",
  "uploadedAt": "2026-05-24T10:30:00.000Z"
}`,
          },
          errors: [
            { status: 404, body: '{ "error": "Document not found" }' },
            { status: 500, body: '{ "error": "Failed to fetch document" }' },
          ],
        },
      },
      {
        method: "DELETE",
        path: "/api/knowledge/[id]",
        description:
          "Delete a knowledge document and remove its file from disk (if any).",
        response: {
          success: {
            status: 200,
            description: "Confirmation message.",
            example: '{ "message": "Deleted successfully" }',
          },
          errors: [
            { status: 404, body: '{ "error": "Document not found" }' },
            { status: 500, body: '{ "error": "Failed to delete document" }' },
          ],
        },
      },
    ],
  },
  {
    id: "survivors",
    label: "SURVIVOR REGISTRY",
    icon: "◎",
    color: "emerald",
    endpoints: [
      {
        method: "GET",
        path: "/api/survivors",
        description: "List all registered survivors with their skills, ordered newest first.",
        queryParams: [
          { name: "skill", type: "string", required: false, description: "Filter by skill category (e.g. medical, engineering)." },
        ],
        response: {
          success: {
            status: 200,
            description: "Array of Survivor objects, each including a nested skills array.",
            example: `[
  {
    "id": "cm9y...",
    "name": "Aria Voss",
    "age": 29,
    "sector": "PULSE",
    "registeredAt": "2026-05-24T09:00:00.000Z",
    "skills": [
      { "id": "cm9z...", "name": "Field Surgery", "category": "medical", "survivorId": "cm9y..." }
    ]
  }
]`,
          },
          errors: [
            { status: 500, body: '{ "error": "Failed to fetch survivors" }' },
          ],
        },
      },
      {
        method: "POST",
        path: "/api/survivors",
        description: "Register a new survivor and optionally attach skills in the same request.",
        requestBody: {
          contentType: "application/json",
          fields: [
            { name: "name",   type: "string",                        required: true,  description: "Full name of the survivor." },
            { name: "age",    type: "number",                        required: true,  description: "Age (converted to integer)." },
            { name: "sector", type: "string",                        required: true,  description: "Home sector designation." },
            { name: "skills", type: "{ name: string; category: string }[]", required: false, description: "Optional array of skills to attach." },
          ],
          example: `{
  "name": "Aria Voss",
  "age": 29,
  "sector": "PULSE",
  "skills": [
    { "name": "Field Surgery", "category": "medical" },
    { "name": "Radio Comms",   "category": "tech" }
  ]
}`,
        },
        response: {
          success: {
            status: 201,
            description: "The created Survivor object with nested skills.",
            example: `{
  "id": "cm9y...",
  "name": "Aria Voss",
  "age": 29,
  "sector": "PULSE",
  "registeredAt": "2026-05-24T09:00:00.000Z",
  "skills": [
    { "id": "cm9z...", "name": "Field Surgery", "category": "medical", "survivorId": "cm9y..." }
  ]
}`,
          },
          errors: [
            { status: 400, body: '{ "error": "Name, age, and sector are required" }' },
            { status: 500, body: '{ "error": "Failed to register survivor" }' },
          ],
        },
      },
      {
        method: "GET",
        path: "/api/survivors/[id]",
        description: "Retrieve a single survivor with all their skills.",
        response: {
          success: {
            status: 200,
            description: "A single Survivor object with nested skills.",
            example: `{
  "id": "cm9y...",
  "name": "Aria Voss",
  "age": 29,
  "sector": "PULSE",
  "registeredAt": "2026-05-24T09:00:00.000Z",
  "skills": [
    { "id": "cm9z...", "name": "Field Surgery", "category": "medical", "survivorId": "cm9y..." }
  ]
}`,
          },
          errors: [
            { status: 404, body: '{ "error": "Survivor not found" }' },
            { status: 500, body: '{ "error": "Failed to fetch survivor" }' },
          ],
        },
      },
    ],
  },
  {
    id: "skills",
    label: "SKILLS",
    icon: "◈",
    color: "amber",
    endpoints: [
      {
        method: "GET",
        path: "/api/skills",
        description: "List all skills across all survivors, sorted alphabetically by name.",
        queryParams: [
          { name: "category", type: "string", required: false, description: "Filter by category (e.g. medical, tech, engineering)." },
        ],
        response: {
          success: {
            status: 200,
            description: "Array of Skill objects.",
            example: `[
  {
    "id": "cm9z...",
    "name": "Field Surgery",
    "category": "medical",
    "survivorId": "cm9y..."
  }
]`,
          },
          errors: [
            { status: 500, body: '{ "error": "Failed to fetch skills" }' },
          ],
        },
      },
    ],
  },
  {
    id: "shelters",
    label: "SHELTER LOCATIONS",
    icon: "◆",
    color: "sky",
    endpoints: [
      {
        method: "GET",
        path: "/api/shelters",
        description: "List all shelter locations, ordered newest first.",
        response: {
          success: {
            status: 200,
            description: "Array of ShelterLocation objects.",
            example: `[
  {
    "id": "cmaa...",
    "name": "Bunker Delta-7",
    "description": "Underground shelter near the eastern ridge.",
    "lat": 48.8566,
    "lng": 2.3522,
    "capacity": 120,
    "status": "active",
    "createdAt": "2026-05-20T12:00:00.000Z"
  }
]`,
          },
          errors: [
            { status: 500, body: '{ "error": "Failed to fetch shelters" }' },
          ],
        },
      },
      {
        method: "POST",
        path: "/api/shelters",
        description: "Add a new shelter location.",
        requestBody: {
          contentType: "application/json",
          fields: [
            { name: "name",        type: "string",  required: true,  description: "Shelter name." },
            { name: "description", type: "string",  required: false, description: "Optional description." },
            { name: "lat",         type: "number",  required: true,  description: "Latitude coordinate." },
            { name: "lng",         type: "number",  required: true,  description: "Longitude coordinate." },
            { name: "capacity",    type: "number",  required: true,  description: "Maximum occupancy (minimum 1)." },
            { name: "status",      type: "string",  required: false, description: "One of: active | full | abandoned. Defaults to active." },
          ],
          example: `{
  "name": "Bunker Delta-7",
  "description": "Underground shelter near the eastern ridge.",
  "lat": 48.8566,
  "lng": 2.3522,
  "capacity": 120,
  "status": "active"
}`,
        },
        response: {
          success: {
            status: 201,
            description: "The created ShelterLocation object.",
            example: `{
  "id": "cmaa...",
  "name": "Bunker Delta-7",
  "description": "Underground shelter near the eastern ridge.",
  "lat": 48.8566,
  "lng": 2.3522,
  "capacity": 120,
  "status": "active",
  "createdAt": "2026-05-20T12:00:00.000Z"
}`,
          },
          errors: [
            { status: 400, body: '{ "error": "Name, lat, lng, and capacity are required" }' },
            { status: 400, body: '{ "error": "Status must be active, full, or abandoned" }' },
            { status: 400, body: '{ "error": "Capacity must be at least 1" }' },
            { status: 500, body: '{ "error": "Failed to create shelter" }' },
          ],
        },
      },
      {
        method: "GET",
        path: "/api/shelters/[id]",
        description: "Retrieve a single shelter by its ID.",
        response: {
          success: {
            status: 200,
            description: "A single ShelterLocation object.",
            example: `{
  "id": "cmaa...",
  "name": "Bunker Delta-7",
  "description": "Underground shelter near the eastern ridge.",
  "lat": 48.8566,
  "lng": 2.3522,
  "capacity": 120,
  "status": "active",
  "createdAt": "2026-05-20T12:00:00.000Z"
}`,
          },
          errors: [
            { status: 404, body: '{ "error": "Shelter not found" }' },
            { status: 500, body: '{ "error": "Failed to fetch shelter" }' },
          ],
        },
      },
    ],
  },
  {
    id: "tutorials",
    label: "TUTORIALS",
    icon: "◇",
    color: "amber",
    endpoints: [
      {
        method: "GET",
        path: "/api/tutorials",
        description: "List all tutorials, ordered newest first.",
        queryParams: [
          {
            name: "category",
            type: "string",
            required: false,
            description: "Filter by category. Allowed values: first-aid | survival | shelter | food | defense.",
          },
        ],
        response: {
          success: {
            status: 200,
            description: "Array of Tutorial objects.",
            example: `[
  {
    "id": "cmab...",
    "title": "Tourniquet Application",
    "category": "first-aid",
    "content": "## Step 1\\nPlace tourniquet 2 inches above wound...",
    "difficulty": "beginner",
    "createdAt": "2026-05-22T08:00:00.000Z"
  }
]`,
          },
          errors: [
            { status: 400, body: '{ "error": "Invalid category. Use first-aid, survival, shelter, food, or defense" }' },
            { status: 500, body: '{ "error": "Failed to fetch tutorials" }' },
          ],
        },
      },
      {
        method: "POST",
        path: "/api/tutorials",
        description: "Create a new tutorial. Content is stored as raw Markdown.",
        requestBody: {
          contentType: "application/json",
          fields: [
            { name: "title",      type: "string", required: true,  description: "Tutorial title." },
            { name: "category",   type: "string", required: true,  description: "One of: first-aid | survival | shelter | food | defense." },
            { name: "content",    type: "string", required: true,  description: "Tutorial body in Markdown." },
            { name: "difficulty", type: "string", required: false, description: "One of: beginner | intermediate | advanced. Defaults to beginner." },
          ],
          example: `{
  "title": "Tourniquet Application",
  "category": "first-aid",
  "content": "## Step 1\\nPlace tourniquet 2 inches above wound...",
  "difficulty": "beginner"
}`,
        },
        response: {
          success: {
            status: 201,
            description: "The created Tutorial object.",
            example: `{
  "id": "cmab...",
  "title": "Tourniquet Application",
  "category": "first-aid",
  "content": "## Step 1\\nPlace tourniquet 2 inches above wound...",
  "difficulty": "beginner",
  "createdAt": "2026-05-22T08:00:00.000Z"
}`,
          },
          errors: [
            { status: 400, body: '{ "error": "Title, category, and content are required" }' },
            { status: 400, body: '{ "error": "Category must be first-aid, survival, shelter, food, or defense" }' },
            { status: 400, body: '{ "error": "Difficulty must be beginner, intermediate, or advanced" }' },
            { status: 500, body: '{ "error": "Failed to create tutorial" }' },
          ],
        },
      },
      {
        method: "GET",
        path: "/api/tutorials/[id]",
        description: "Retrieve a single tutorial by its ID.",
        response: {
          success: {
            status: 200,
            description: "A single Tutorial object.",
            example: `{
  "id": "cmab...",
  "title": "Tourniquet Application",
  "category": "first-aid",
  "content": "## Step 1\\nPlace tourniquet 2 inches above wound...",
  "difficulty": "beginner",
  "createdAt": "2026-05-22T08:00:00.000Z"
}`,
          },
          errors: [
            { status: 404, body: '{ "error": "Tutorial not found" }' },
            { status: 500, body: '{ "error": "Failed to fetch tutorial" }' },
          ],
        },
      },
    ],
  },
  {
    id: "stats",
    label: "STATS",
    icon: "◌",
    color: "emerald",
    endpoints: [
      {
        method: "GET",
        path: "/api/stats",
        description: "Return aggregate counts and the 5 most recent documents and survivors. Used by the dashboard.",
        response: {
          success: {
            status: 200,
            description: "Stats object with counts and recent-activity arrays.",
            example: `{
  "totalDocuments": 14,
  "totalSurvivors": 32,
  "totalSkills": 87,
  "totalShelters": 6,
  "totalTutorials": 11,
  "recentDocuments": [
    {
      "id": "cm9x...",
      "title": "Water Purification Protocol",
      "description": "...",
      "filePath": "",
      "tags": "survival",
      "uploadedAt": "2026-05-24T10:30:00.000Z"
    }
  ],
  "recentSurvivors": [
    {
      "id": "cm9y...",
      "name": "Aria Voss",
      "age": 29,
      "sector": "PULSE",
      "registeredAt": "2026-05-24T09:00:00.000Z",
      "skills": []
    }
  ]
}`,
          },
          errors: [
            { status: 500, body: '{ "error": "Failed to fetch stats" }' },
          ],
        },
      },
    ],
  },
  {
    id: "chat",
    label: "ARCHIVE AI / CHAT",
    icon: "◌",
    color: "emerald",
    endpoints: [
      {
        method: "POST",
        path: "/api/chat",
        description:
          "Relay a conversation to the Archive AI (OpenAI backend). Requires OPENAI_API_KEY to be set. Accepts up to 20 messages; the last message must be from the user. Each message content is capped at 4000 characters.",
        requestBody: {
          contentType: "application/json",
          fields: [
            {
              name: "messages",
              type: '{ role: "user" | "assistant"; content: string }[]',
              required: true,
              description: "Ordered conversation history. Must be non-empty and end with a user message.",
            },
          ],
          example: `{
  "messages": [
    { "role": "user", "content": "What are safe water sources post-fallout?" }
  ]
}`,
        },
        response: {
          success: {
            status: 200,
            description: "The AI reply string.",
            example: '{ "reply": "Post-fallout, prioritise moving water sources such as..." }',
          },
          errors: [
            { status: 400, body: '{ "error": "Messages array is required" }' },
            { status: 400, body: '{ "error": "Last message must be from the user" }' },
            { status: 503, body: '{ "error": "Archive AI is offline — set OPENAI_API_KEY in your .env file" }' },
            { status: 502, body: '{ "error": "<relay error message>" }' },
          ],
        },
      },
    ],
  },
];

const STATUS_COLOR: Record<number, string> = {
  200: "text-emerald-400",
  201: "text-emerald-400",
  400: "text-amber-400",
  404: "text-amber-400",
  500: "text-red-400",
  502: "text-red-400",
  503: "text-amber-400",
};

function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span
      className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest ${METHOD_STYLE[method]}`}
    >
      {method}
    </span>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded border border-zinc-800 bg-zinc-950 p-3 text-[11px] font-mono leading-relaxed text-zinc-400">
      {code}
    </pre>
  );
}

function ParamTable({ params }: { params: Param[] }) {
  return (
    <table className="w-full text-[11px] font-mono">
      <thead>
        <tr className="border-b border-zinc-800">
          <th className="py-1 pr-4 text-left text-[10px] tracking-widest text-zinc-600">PARAM</th>
          <th className="py-1 pr-4 text-left text-[10px] tracking-widest text-zinc-600">TYPE</th>
          <th className="py-1 pr-4 text-left text-[10px] tracking-widest text-zinc-600">REQ</th>
          <th className="py-1 text-left text-[10px] tracking-widest text-zinc-600">DESCRIPTION</th>
        </tr>
      </thead>
      <tbody>
        {params.map((p) => (
          <tr key={p.name} className="border-b border-zinc-900">
            <td className="py-1.5 pr-4 text-amber-400">{p.name}</td>
            <td className="py-1.5 pr-4 text-sky-500">{p.type}</td>
            <td className="py-1.5 pr-4">
              {p.required ? (
                <span className="text-red-400">yes</span>
              ) : (
                <span className="text-zinc-600">no</span>
              )}
            </td>
            <td className="py-1.5 text-zinc-400">{p.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EndpointCard({ ep }: { ep: Endpoint }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();

    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    // Secure context (HTTPS / localhost) → modern API
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(ep.path).then(done);
      return;
    }

    // HTTP fallback → textarea + execCommand
    const el = document.createElement("textarea");
    el.value = ep.path;
    el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
    document.body.appendChild(el);
    el.focus();
    el.select();
    try { document.execCommand("copy"); done(); } catch { /* silent */ }
    document.body.removeChild(el);
  }

  return (
    <div className="rounded border border-zinc-800/70 bg-zinc-900/30 transition-all duration-200 hover:border-zinc-700/70">
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <MethodBadge method={ep.method} />
        <span className="flex-1 font-mono text-sm text-zinc-200">{ep.path}</span>
        {/* Copy button */}
        <span
          role="button"
          onClick={handleCopy}
          title="Copy path"
          className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-mono tracking-widest transition-colors cursor-pointer select-none
            ${copied
              ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-400"
              : "border-zinc-700/50 bg-zinc-800/40 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
            }`}
        >
          {copied ? "✓ COPIED" : "COPY"}
        </span>
        <span className="hidden text-xs text-zinc-600 sm:block">{ep.description.slice(0, 60)}{ep.description.length > 60 ? "…" : ""}</span>
        <span className={`ml-2 shrink-0 text-xs font-mono transition-transform ${open ? "rotate-90" : ""} text-zinc-600`}>
          ▶
        </span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="space-y-5 border-t border-zinc-800/60 px-4 py-4">
          <p className="text-xs text-zinc-400 leading-relaxed">{ep.description}</p>

          {/* Query params */}
          {ep.queryParams && ep.queryParams.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] tracking-[0.2em] text-zinc-600">QUERY PARAMETERS</p>
              <ParamTable params={ep.queryParams} />
            </div>
          )}

          {/* Request body */}
          {ep.requestBody && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <p className="text-[10px] tracking-[0.2em] text-zinc-600">REQUEST BODY</p>
                <span className="rounded border border-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-500">
                  {ep.requestBody.contentType}
                </span>
              </div>
              <ParamTable params={ep.requestBody.fields} />
              <div>
                <p className="mb-1.5 text-[10px] tracking-[0.2em] text-zinc-600">EXAMPLE</p>
                <CodeBlock code={ep.requestBody.example} />
              </div>
            </div>
          )}

          {/* Response */}
          <div className="space-y-3">
            <p className="text-[10px] tracking-[0.2em] text-zinc-600">RESPONSE</p>

            {/* Success */}
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <span className={`font-mono text-xs font-bold ${STATUS_COLOR[ep.response.success.status]}`}>
                  {ep.response.success.status}
                </span>
                <span className="text-xs text-zinc-500">{ep.response.success.description}</span>
              </div>
              <CodeBlock code={ep.response.success.example} />
            </div>

            {/* Errors */}
            <div className="space-y-1.5">
              {ep.response.errors.map((err, i) => (
                <div key={i} className="flex items-start gap-3 rounded border border-zinc-900 bg-zinc-950/60 px-3 py-2">
                  <span className={`shrink-0 font-mono text-xs font-bold ${STATUS_COLOR[err.status] ?? "text-red-400"}`}>
                    {err.status}
                  </span>
                  <code className="text-[11px] text-zinc-500">{err.body}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const GROUP_COLOR_CLASSES = {
  amber:   { icon: "text-amber-500",   heading: "text-amber-500",   border: "border-amber-900/30",   dot: "bg-amber-500"  },
  emerald: { icon: "text-emerald-500", heading: "text-emerald-400", border: "border-emerald-900/30", dot: "bg-emerald-500" },
  red:     { icon: "text-red-500",     heading: "text-red-400",     border: "border-red-900/30",     dot: "bg-red-500"     },
  sky:     { icon: "text-sky-500",     heading: "text-sky-400",     border: "border-sky-900/30",     dot: "bg-sky-500"     },
};

function ResourceSection({ group }: { group: ResourceGroup }) {
  const cls = GROUP_COLOR_CLASSES[group.color];

  return (
    <section id={group.id} className={`rounded border ${cls.border} bg-zinc-900/20 p-5`}>
      <div className="mb-4 flex items-center gap-2">
        <span className={cls.icon}>{group.icon}</span>
        <h3 className={`font-mono text-xs font-bold tracking-[0.25em] ${cls.heading}`}>
          {group.label}
        </h3>
        <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-500`}>
          {group.endpoints.length} endpoint{group.endpoints.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="space-y-2">
        {group.endpoints.map((ep, i) => (
          <EndpointCard key={i} ep={ep} />
        ))}
      </div>
    </section>
  );
}

export default function ApiDocsPage() {
  const totalEndpoints = GROUPS.reduce((n, g) => n + g.endpoints.length, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-amber-700 text-xs">◈</span>
          <h2 className="font-mono text-base font-bold tracking-widest text-amber-500 glow-amber">
            API REFERENCE
          </h2>
        </div>
        <p className="mt-0.5 text-xs text-zinc-600">
          {totalEndpoints} endpoints — base URL: <span className="font-mono text-zinc-500">http://69.28.90.158:3001</span>
          &nbsp;// all responses are JSON
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 rounded border border-zinc-800/60 bg-zinc-900/30 px-4 py-3">
        <span className="text-[10px] tracking-[0.2em] text-zinc-600">METHODS</span>
        {(["GET", "POST", "DELETE"] as HttpMethod[]).map((m) => (
          <span key={m} className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${METHOD_STYLE[m]}`}>
            {m}
          </span>
        ))}
        <span className="ml-4 text-[10px] tracking-[0.2em] text-zinc-600">CLICK ANY ROUTE TO EXPAND</span>
      </div>

      {/* Quick-jump index */}
      <div className="rounded border border-zinc-800/60 bg-zinc-900/20 px-4 py-3">
        <p className="mb-2 text-[10px] tracking-[0.2em] text-zinc-600">JUMP TO</p>
        <div className="flex flex-wrap gap-2">
          {GROUPS.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1 text-[11px] font-mono text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
            >
              {g.label}
            </a>
          ))}
        </div>
      </div>

      {/* Resource sections */}
      {GROUPS.map((g) => (
        <ResourceSection key={g.id} group={g} />
      ))}

      {/* Base error note */}
      <div className="rounded border border-zinc-800/60 bg-zinc-950/60 px-4 py-3">
        <p className="mb-1 text-[10px] tracking-[0.2em] text-zinc-600">COMMON ERROR SHAPE</p>
        <code className="font-mono text-[11px] text-zinc-500">
          {`{ "error": "<human-readable message>" }`}
        </code>
        <p className="mt-2 text-[11px] text-zinc-600 leading-relaxed">
          All error responses follow the same envelope. 4xx errors indicate a client problem (missing fields, invalid
          enum values, not found). 5xx errors indicate an internal failure — check server logs.
        </p>
      </div>
    </div>
  );
}
