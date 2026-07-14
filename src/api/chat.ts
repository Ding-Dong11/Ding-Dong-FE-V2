import { apiFetch, apiStream } from "./client";
import type { ChatHistoryResponse, ChatInitRequest, ChatMessageRequest, ChatStreamChunk } from "./types";

export const chatApi = {
  getHistory: () => apiFetch<ChatHistoryResponse>("/api/v1/chat/history"),

  /**
   * 채팅 화면 진입 시 첫 메시지 대신 호출. 주변 상가/QR 인증 이력 기반 맞춤 환영 메시지를
   * SSE로 스트리밍하며, 서버의 기존 대화 이력을 초기화한다.
   */
  init: (data: ChatInitRequest, onChunk: (chunk: ChatStreamChunk) => void, signal?: AbortSignal) =>
    apiStream<ChatStreamChunk>("/api/v1/chat/init", data, onChunk, signal),

  /** SSE 스트림을 청크 단위로 받아 onChunk에 전달한다. done:true가 오면 스트림 종료. */
  sendMessage: (data: ChatMessageRequest, onChunk: (chunk: ChatStreamChunk) => void, signal?: AbortSignal) =>
    apiStream<ChatStreamChunk>("/api/v1/chat/message", data, onChunk, signal),
};
