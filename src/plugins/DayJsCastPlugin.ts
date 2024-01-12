import config from "../config";
import macros from "../internals/singletons/MacroService";
import { ModelSchema } from "../types/model";
import { LaravelMuiAdminPlugin } from "../types/plugin";
import dayjs from 'dayjs';

const DayJsAdapter: LaravelMuiAdminPlugin = {

    macros: () => {

        const schema: ModelSchema = config('boot.models');

        const models = Object.keys(schema);

        models.forEach((model) => {

            const { casts = { } } = schema[model];

            Object.entries(casts).forEach(([field, cast]) => {
                if (['date', 'datetime', 'immutable_date', 'immutable_datetime'].includes(cast)) {
                    macros.addFilter(
                        `model_${model}_get_${field}_attribute`,
                        (value: any) => {
                            if (value) {
                                return dayjs(value);
                            }
                            return value;
                        },
                        8
                    );
                }
            });
        });

    }

};


export default DayJsAdapter;
