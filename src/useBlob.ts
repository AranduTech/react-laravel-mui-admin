
import axios from 'axios';

import route from './route';
import config from './config';
import toast from './toast';


const defaultDownloadRoute = 'api.file.download';

export type UploadedFile = {
    filename: string,
} & File;

export default () => {

    const downloadBlob = async (
        file: UploadedFile,
        folder: string = 'files',
        driver: string = 'public',
    ) => {
        const apiRoute = config('routes')
            ? config('routes.api.download', defaultDownloadRoute)
            : defaultDownloadRoute;

        const response = await axios({
            method: 'GET',
            url: route(
                apiRoute, 
                { 
                    driver, 
                    folder, 
                    filename: file.filename 
                }
            ),
            responseType: 'blob',
        });

        if (response.status !== 200) {
            toast.error(response.data.message || 'Error downloading file');
        }

        const filename = file.name.split('.')[0];
        const fileBlob = response.data;

        return {
            filename,
            fileBlob,
        };
    };

    const mountBlob = (
        data: BlobPart,
        filename: string = 'new_file', 
        fileext: string = 'pdf',
        downloadType: string = 'application/octetstream' 
    ) => {
        const blob = new Blob(
            [data], 
            { type: downloadType }
        );
    
        /**
         * Convert your blob into a Blob URL
         * (a special url that points to an object in the browser's memory)
         */
        const blobUrl = URL.createObjectURL(blob);
    
        // Create a link element
        const link = document.createElement('a');
    
        // Set link's href to point to the Blob URL
        link.href = blobUrl;
        link.download = `${filename}.${fileext}`;
    
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
    };

    return {
        downloadBlob,
        mountBlob,
    };
}
