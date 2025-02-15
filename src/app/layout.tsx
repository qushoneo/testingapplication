'use client';

import '@/styles/globals.css';

import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthProvider';
import { useEffect, useState } from 'react';
import testPlansRequest from './requests/testPlans';
import testCasesRequest from './requests/testCases';
import folderRequests from './requests/folders';
import projectsRequest from './requests/projects';
import { useProjectStorageStore } from '@/stores/useProjectStorageStore';
import { useFoldersStore } from '@/stores/useFoldersStore';
import { useTestCasesStore } from '@/stores/useTestCasesStore';
import { useProjectsStore } from '@/stores/useProjectsStore';
import Loading from '@/components/Loading';

const inter = Inter({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  preload: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`w-[100%] h-[100%] bg-gray ${inter.className} overflow-hidden`}
      lang='en'
      suppressHydrationWarning
    >
      <body className='w-[100%] h-[100%] text-textPrimary'>
        <AuthProvider>{<>{children}</>}</AuthProvider>
      </body>
    </html>
  );
}
