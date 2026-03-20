export async function sendMessage(apiKey, systemPrompt, history, userMessage, attachment) {
  const url = 'https://openrouter.ai/api/v1/chat/completions'

  // Build user content — image gets multipart array, PDF appends text, plain is string
  let userContent
  if (attachment?.type === 'image') {
    userContent = [
      { type: 'text', text: userMessage || '请分析这张图片' },
      { type: 'image_url', image_url: { url: attachment.content } },
    ]
  } else if (attachment?.type === 'pdf') {
    userContent = `${userMessage}\n\n[PDF文件: ${attachment.name}]\n${attachment.content}`
  } else {
    userContent = userMessage
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.text,
    })),
    { role: 'user', content: userContent },
  ]

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'BookChat',
    },
    body: JSON.stringify({
      model: 'arcee-ai/trinity-large-preview:free',
      messages,
      temperature: 0.8,
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || `HTTP ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}
