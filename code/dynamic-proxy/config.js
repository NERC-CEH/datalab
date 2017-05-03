import convict from 'convict';

// Define a schema
var config = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  proxyPort: {
    doc: "The port for the Proxy service.",
    format: "port",
    default: 8080,
    env: "PROXY_PORT",
  },
  apiPort: {
    doc: "The port for the API service.",
    format: "port",
    default: 3000,
    env: "PROXY_API_PORT",
  },
  etcdHost: {
    doc: "The IP address for the ETCD host",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "PROXY_ETCD_IP_ADDRESS",
  },
  etcdPort: {
    doc: "The port for the ETCD service.",
    format: "port",
    default: 2379,
    env: "PROXY_ETCD_PORT",
  },
  redbirdEtcdKey: {
    doc: "Redbird Base ETCD key",
    format: String,
    default: 'redbird',
    env: "PROXY_REDBIRD_ETCD_KEY",
  }
});

export default config;
