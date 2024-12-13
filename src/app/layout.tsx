import type { Metadata } from 'next';

import './globals.css';
import { ConfigProvider } from 'antd';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A simple todo app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1d3557',
              colorInfo: '#1d3557',
              wireframe: false,
              colorTextBase: '#001027',
              colorBgBase: '#f1faee',
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
