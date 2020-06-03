import * as fs from 'fs';
import * as path from 'path';

const adminUserId = 'admin';
const adminSecret = 'adminpw';

const systemMspId = 'Org1MSP';
const systemCaUri = 'ca.org1.pkrstudio.com';

const peerConfigPath = path.resolve(__dirname, "./connection-org1.json");
const nodeUser = process.env.NODE_USER_ID;

const getNetworkConfig = (nodeConfigPath) =>
  JSON.parse(fs.readFileSync(nodeConfigPath, 'utf8'));

export default async () => ({
  peerConfigPath,
  networkConfig: getNetworkConfig(peerConfigPath),
  adminUserId,
  adminSecret,
  systemMspId,
  systemCaUri,
});
