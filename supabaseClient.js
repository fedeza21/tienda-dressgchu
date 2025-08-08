// Archivo: supabaseClient.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://ediquvutfdaecbjtccfh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkaXF1dnV0ZmRhZWNianRjY2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTgxOTAsImV4cCI6MjA2ODI5NDE5MH0.F6fM_iTmU6D8g-DKffLX3zmC6HepkNYk5ll15CYTg-8"
);

export { supabase };
