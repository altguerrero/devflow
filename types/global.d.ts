import type { NextResponse } from "next/server";

export interface Tag {
  _id: string;
  name: string;
}

export interface Author {
  _id: string;
  name: string;
  image?: string;
}

export interface Question {
  _id: string;
  title: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  answers: number;
  views: number;
}

export type ActionError = {
  message: string;
  details?: Record<string, string[]>;
};

export type SuccessResponse<T = null> = {
  success: true;
  data?: T;
  status?: number;
  error?: never;
};

export type ErrorResponse = {
  success: false;
  error: ActionError;
  status?: number;
  data?: never;
};

export type ActionResponse<T = null> = SuccessResponse<T> | ErrorResponse;

export type APIErrorResponse = NextResponse<ErrorResponse>;
export type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;
