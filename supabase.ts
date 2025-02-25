import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mlrkhwcpysblsffmgctw.supabase.co/"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1scmtod2NweXNibHNmZm1nY3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MDE5MjksImV4cCI6MjA1NTk3NzkyOX0.gBg3b2o93U1uLndUUHLR3L6j0oXSBj-0yfaHEO9lU6Y"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})