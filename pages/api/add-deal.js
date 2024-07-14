import { DealsApi } from 'pipedrive';
import logger from '../../shared/logger';
import { getAPIClient } from '../../shared/oauth';

const log = logger('Add Deal 📝');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      log.info('Received request body:', req.body);

      log.info('Getting API client');
      const client = getAPIClient(req, res);

      log.info('Initializing Deals API');
      const api = new DealsApi(client);

      const {
        firstName,
        lastName,
        phone,
        email,
        jobType,
        jobSource,
        jobDescription,
        address,
        city,
        state,
        zipCode,
        area,
        startDate,
        startTime,
        endTime,
        technician,
      } = req.body;

      // Ensure that all required fields are defined or set default values
      const dealData = {
        title: `${jobType} - ${firstName} ${lastName}`,
        value: 0,
        currency: 'USD',
        person_id: null,
        org_id: 1,
        stage_id: 1,
        status: 'open',
        add_time: new Date().toISOString(),
        "e158b4e8f07d4c057a3003b82841719d4dfe5196": firstName || '',
        "9151c7c54e7733159c72d691fa67f6e1445ca6fa": lastName || '',
        "685cc9c841df2db735acd4c9bc497a766d69d27e": phone || '',
        "63d1d9b18d273fcb804112c2008cb3a2744c78b2": jobType || '',
        "9846a72dfa96bf2d4bb84b7e14d0be94fc5973e6": email || '',
        "23f00f4412a65cee3569c7150088bafd901b92a6": jobSource || '',
        "509d68ce0b095cca6dd2103808227a9d4ee7e4d1": jobDescription || '',
        "933830c0d24b9d8765689935fa6a88ad15704b3a": address || '',
        "f1564598d08cba545d77ca7963b1d528ccb2220f": city || '',
        "77fc9d7c4bdd0029c2dde50aeb02de7c6a5b1ee3": state || '',
        "34bfe1e8a3f2d74bf67107ab260ebdeda47fec74": zipCode || '',
        "f83e3c352f3f2c040ef5f9c6719d0c267c10973f": area || '',
        "a9cc5e8655a22d96eef7a3d5b3ce8137a28a5005": startDate || '',
        "55cbc09a6ab0ed21bdd852f5012650e953e42e56": startTime || '',
        "0d78e86fc8eb5b23d0236110588e9c586ed5b8f0": endTime || '',
        "4d0422efa136a93a8b391dce1f1d6aec13fe7bc4": technician || '',
      };

      log.info('Adding deal to Pipedrive:', dealData);
      const response = await api.addDeal(dealData);

      log.info('Deal added successfully:', response);
      res.status(200).json({ message: 'Deal added successfully!', response });
    } catch (error) {
      log.error('Failed to add deal:', error);
      res.status(500).json({ error: 'Failed to add deal', details: error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
