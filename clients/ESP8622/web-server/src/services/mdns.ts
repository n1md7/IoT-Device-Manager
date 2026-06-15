import MDNS from "mdns";
import { console } from "utils/console";
import { code, port } from "utils/config";

type AddFn = (payload: Record<string, any>) => void;
type Callback = (this: { add: AddFn }, message: number, value?: string) => void;

const CLAIMED = 1;
export const hostName = code.toLowerCase() || "node-mcu"; // Becomes node-mcu.local

const callback: Callback = function (message: number, value?: string) {
  if (message === CLAIMED && value) {
    this.add({
      port,
      name: "http",
      protocol: "tcp",
      txt: {
        url: `/index.html`,
      },
    });

    console.info(`Local domain claimed: http://${hostName}.local`);
  }
};

export const claimLocalDomain = () => new MDNS({ hostName }, callback);
