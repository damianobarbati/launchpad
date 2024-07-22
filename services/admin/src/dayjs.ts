import dayjs from 'dayjs';
import dayjsLocaleData from 'dayjs/plugin/localeData';
import dayjsLocalizedFormat from 'dayjs/plugin/localizedFormat';
import '@admin/safari-date-polyfill';

dayjs.extend(dayjsLocalizedFormat);
dayjs.extend(dayjsLocaleData);

export default dayjs;
