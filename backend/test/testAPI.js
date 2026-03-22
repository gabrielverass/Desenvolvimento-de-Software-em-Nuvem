import newman from 'newman';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do .env
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar collection do arquivo JSON
const collectionPath = join(__dirname, 'collections', 'TESTE API POSTMAN.json');
const collection = JSON.parse(readFileSync(collectionPath, 'utf-8'));

// Definir variáveis de ambiente
const environmentVariables = [
    { key: 'HOST', value: process.env.HOST || 'localhost' },
    { key: 'PORT', value: process.env.PORT || '3000' },
    { key: 'USER_EMAIL', value: process.env.TEST_USER_EMAIL },
    { key: 'USER_PASSWORD', value: process.env.TEST_USER_PASSWORD },
    { key: 'ADMIN_EMAIL', value: process.env.TEST_ADMIN_EMAIL },
    { key: 'ADMIN_PASSWORD', value: process.env.TEST_ADMIN_PASSWORD },
    { key: 'PATRIMONIO', value: process.env.PATRIMONIO_TESTE },
];

newman.run({
    collection: collection,
    environment: {
        name: 'Environment',
        values: environmentVariables
    },
    reporters: ['cli', 'json'],
    reporter: {
        json: {
            export: join(__dirname, 'results', 'test-results.json')
        }
    }
}, function (err, summary) {
    if (err) {
        console.error('Erro ao executar testes:', err);
        process.exit(1);
    }
    
    if (summary.error && summary.error.length > 0) {
        console.error('Testes falharam!');
        process.exit(1);
    }
    
    console.log('✓ Todos os testes foram executados com sucesso!');
    process.exit(0);
});