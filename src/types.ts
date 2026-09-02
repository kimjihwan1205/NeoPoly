/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Asset {
  id: number;
  title: string;
  author: string;
  avatar: string;
  likes: string;
  views: string;
  image: string;
  badge: 'M' | 'A';
  category?: string;
}

export interface CompletedProject {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  status: string;
  progress: number;
  completedAt: string;
  tags: string[];
}

export interface UserProfile {
  username: string;
  nickname: string;
  avatar: string;
  email: string;
  bio: string;
  role: string;
  credits: number;
  instagramUrl?: string;
  youtubeUrl?: string;
  completedProjects: CompletedProject[];
}

export type ThemeMode = 'dark' | 'light';
