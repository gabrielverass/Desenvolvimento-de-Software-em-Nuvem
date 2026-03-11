import {createClient} from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();


//Cria o cliente do Supabase usando as credenciais do .env;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

//exporta o cliente para ser usado em outros arquivos.
export default supabase;
