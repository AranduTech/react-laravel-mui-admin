import axios from "axios";
import route from "./route";

import useBlob from "./useBlob";

import { FormState } from "./types/form";

export default () => ({
    download: async (dashboardUri: string, filter?: FormState) => {

        const { mountBlob } = useBlob();

        const response = await axios({
            method: 'GET',
            url: route('admin.bi.export', { dashboard: dashboardUri }),
            data: { filters: filter },
            responseType: 'blob',
        });
        
        mountBlob(
            response.data, 
            dashboardUri, 
            'xlsx', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

        return response;
    }
});
