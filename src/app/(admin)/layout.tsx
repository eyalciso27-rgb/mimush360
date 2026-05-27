// Admin layout — no public header/footer, no WhatsApp button
export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
