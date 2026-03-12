import { createClient } from '@supabase/supabase-js';

// Replace these with your actual keys from Supabase Settings > API
const supabaseUrl = 'https://jccngyggkfhovcnoupcu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjY25neWdna2Zob3Zjbm91cGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTU1NTIsImV4cCI6MjA4ODg5MTU1Mn0.aDod-u3vzbVzJBicBkhfS5IzkOoDNdxQSuqzFgeVqlk'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);