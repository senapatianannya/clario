"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User } from "lucide-react"

interface AIAssistantChatProps {
  interviewId: string
  context?: string
}

export function AIAssistantChat({ interviewId, context }: AIAssistantChatProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/interview/ai-assistant",
    body: {
      interviewId,
      context,
    },
  })

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Bot className="h-4 w-4 mr-2" />
        AI Assistant
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            AI Assistant
          </CardTitle>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm" className="h-6 w-6 p-0">
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-full">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-4">
                Ask me anything about the interview or need help with your answers!
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && <Bot className="h-4 w-4 text-primary mt-1 flex-shrink-0" />}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/20 text-foreground"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && <User className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask for help..."
              className="flex-1 bg-input border-border"
              disabled={isLoading}
            />
            <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
