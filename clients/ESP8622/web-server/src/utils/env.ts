import config from "mc/config";

export const env = {
  is: {
    get production() {
      return config["environment"] === "production";
    },
  },
};
