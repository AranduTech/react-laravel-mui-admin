// import _ from 'lodash';
import { diff } from 'deep-object-diff';

export const createObjectWithKeys = (keys: Array<string>, obj: any) => Object.keys(obj)
    .filter((key) => keys.includes(key))
    .reduce((acc: any, key) => {
        acc[key] = obj[key];
        return acc;
    }, {});

export const createObjectWithoutKeys = (keys: Array<string>, obj: any) => Object.keys(obj)
    .filter((key) => !keys.includes(key))
    .reduce((acc: any, key) => {
        acc[key] = obj[key];
        return acc;
    }, {});

export const objectDiff = (original: any, modified: any) => {
    try {
        return diff(original, modified);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('objectDiff error: ', error);
        return false;
    }
    // try {
    //     const r = {};
    //     _.each(b, (v, k) => {
    //         if (a[k] === v) {
    //             return;
    //         }
    //         // but what if it returns an empty object? still attach?
    //         r[k] = _.isObject(v)
    //             ? objectDiff(v, a[k])
    //             : v
    //         ;
    //     });
    //     return r;
    // } catch (error) {
    //     console.error('objectDiff error: ', error);
    //     return false;
    // }

    // try {
    //     const diff = {};
    //     Object.keys(original).forEach((key) => {
    //         if (original[key] instanceof Date) {
    //             if (original[key].getTime() !== modified[key].getTime()) {
    //                 diff[key] = modified[key];
    //             }
    //             return;
    //         }
    //         if (typeof original[key] === 'object') {
    //             if (original[key] === null && modified[key] === null) {
    //                 return;
    //             }
    //             if (original[key] === null || modified[key] === null) {
    //                 diff[key] = modified[key];
    //                 return;
    //             }
    //             if (Array.isArray(original[key]) && Array.isArray(modified[key])) {
    //                 if (original[key].length !== modified[key].length) {
    //                     diff[key] = modified[key];
    //                     return;
    //                 }
    //             }

    //             const nestedDiff = objectDiff(original[key], modified[key]);
    //             if (Object.keys(nestedDiff).length > 0) {
    //                 diff[key] = nestedDiff;
    //             }
    //             return;
    //         }
    //         if (original[key] !== modified[key]) {
    //             diff[key] = modified[key];
    //         }
    //     });
    //     return Object.keys(diff).length > 0 ? diff : false;
    // } catch (error) {
    //     // console.warn('objectDiff error: ', error);
    //     return false;
    // }
};

export const dotAccessor = (obj: any, path: string) => {
    try {
        return path.split('.').reduce((acc, key) => acc[key], obj);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return undefined;
    }
};

export const dotSetter = (obj: any, path: string, value: any) => {
    try {
        const pathArray = path.split('.'); // user.name.first
        const lastKey = pathArray.pop(); // first || pathArray = ['user', 'name']
        // const lastObj = pathArray.reduce((acc, key) => acc[key], obj);

        if (!lastKey) {
            return obj;
        }

        const lastObj = pathArray.reduce((acc, key) => {
            if (!acc[key]) {
                acc[key] = {};
            }
            return acc[key];
        }, obj);
        lastObj[lastKey] = value;
        return obj;
    } catch (error) {
        console.error(error);
        return obj;
    }
};

export const dotExists = (obj: any, path: string) => {
    try {
        return dotAccessor(obj, path) !== undefined;
    } catch (error) {
        return false;
    }
};
