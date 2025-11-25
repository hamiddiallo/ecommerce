import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function TodosPage() {
  const supabase = await createServerSupabaseClient()
  const { data: todos } = await supabase!.from('todos').select()

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.title || todo}</li>
      ))}
    </ul>
  )
}
