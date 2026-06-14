import MDNS from "mdns";
import config from "mc/config";

type AddFn = (payload: Record<string, any>) => void;
type Callback = (this: { add: AddFn }, message: number, value?: string) => void;

const CLAIMED = 1;
const hostName = config["code"] || "node-mcu"; // Becomes node-mcu.local

const callback: Callback = function (message: number, value?: string) {
  if (message === CLAIMED && value) {
    this.add({
      name: "http",
      protocol: "tcp",
      port: 80,
      txt: {
        url: `/index.html`,
      },
    });
  }
};

export const claimLocalDomain = () => new MDNS({ hostName }, callback);
