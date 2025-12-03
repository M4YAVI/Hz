const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase environment variables.');
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function keepAlive() {
    console.log('Running keep-alive check...');

    // Query the 'songs' table, fetching just one row to minimize load
    const { data, error } = await supabase
        .from('songs')
        .select('id')
        .limit(1);

    if (error) {
        console.error('Error querying Supabase:', error.message);
        process.exit(1);
    }

    console.log('Success: Supabase is active.');
    console.log('Data received:', data);
}

keepAlive();
