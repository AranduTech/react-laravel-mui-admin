import axios from "axios";

import route from "./route";

import { FormState } from "./types/form";

export default () => ({
    download: async (dashboardUri: string, filter?: FormState) => {
        const response = await axios({
            method: 'GET',
            url: route('admin.bi.export', { dashboard: dashboardUri }),
            data: { filters: filter },
            responseType: 'blob',
        });
        
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        /**
         * Convert your blob into a Blob URL
         * (a special url that points to an object in the browser's memory)
         */
        const blobUrl = URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');

        // Set link's href to point to the Blob URL
        link.href = blobUrl;
        link.download = `${dashboardUri}.xlsx`;

        // Append link to the body
        document.body.appendChild(link);

        // Dispatch click event on the link
        // This is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        }));

        // Remove link from body
        document.body.removeChild(link);

        return response;
    }
});
