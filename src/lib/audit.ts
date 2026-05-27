import { createServiceClient } from '@/lib/supabase/server'

export async function createAuditLog({
  userId,
  action,
  entityType,
  entityId,
  metadata,
}: {
  userId: string
  action: string
  entityType: string
  entityId?: string
  metadata?: Record<string, unknown>
}) {
  try {
    const supabase = await createServiceClient()
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId ?? null,
      metadata: metadata ?? null,
    })
  } catch (err) {
    console.error('Audit log error:', err)
  }
}
