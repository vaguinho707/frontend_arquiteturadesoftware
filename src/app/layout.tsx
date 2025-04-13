import './globals.css'


export const metadata = {
  title: 'Golzinho - Amateur Soccer Games',
  description: 'Schedule and manage amateur soccer games',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
