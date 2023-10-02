import axios from 'axios';
import { dotAccessor } from './support/object';

let appDefinition: null | object = null;

const app = {
    init: async () => {

        const { data } = await axios.get('/api/admin/init');
    
        appDefinition = data;
    
        return data;
    },
    getDefinition: (path: string) => dotAccessor(appDefinition, path),
};

export default app;

