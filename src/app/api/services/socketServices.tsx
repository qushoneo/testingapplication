import axios from 'axios';
import { endpoints } from '../lib/clientEndpoints';

type EndpointValue = (typeof endpoints)[keyof typeof endpoints];

class SocketServices {
  async sendToSocket<T>(data: T, endPoint: EndpointValue) {
    axios.post(`${process.env.PUBLIC_APP_URL}/api/${endPoint}`, {
      data,
    });
  }
}

export default new SocketServices();
