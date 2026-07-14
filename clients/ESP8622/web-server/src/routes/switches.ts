import { switchController } from "controllers/index";
import { Router } from "express/router";
import {
  assertKeys,
  assertLength,
  assertNumber,
  assertObject,
  assertString,
} from "utils/validations";

export const routeSwitches = new Router("/switches")
  .post("/control", (ctx) => {
    assertObject(ctx.body, "Invalid body");
    assertKeys(
      ctx.body,
      "Missing digitalPin or action",
      "digitalPin",
      "action",
    );

    assertNumber(ctx.body.digitalPin, "Invalid digitalPin");
    assertString(ctx.body.action, "Invalid action");

    switchController.manualControl({
      digitalPin: ctx.body.digitalPin,
      action: ctx.body.action,
      stopAt: ctx.body.stopAt,
    });

    return ctx.apiSend(200);
  })
  // CRUD operations
  .get((ctx) => ctx.apiSend(200, switchController.fetch()))
  .post((ctx) => {
    assertObject(ctx.body, "Invalid body");
    assertKeys(
      ctx.body,
      "Missing digitalPin or control",
      "digitalPin",
      "control",
      "name",
    );
    assertNumber(ctx.body.digitalPin, "Invalid digitalPin");
    assertNumber(ctx.body.control, "Invalid control");
    assertString(ctx.body.name, "Invalid name");
    assertLength(ctx.body.name, 2, 16);

    return ctx.apiSend(
      201,
      switchController.create({
        name: ctx.body.name,
        control: ctx.body.control,
        digitalPin: ctx.body.digitalPin,
      }),
    );
  })
  .patch((ctx) => {
    assertObject(ctx.body, "Invalid body");
    assertKeys(ctx.body, "Missing control in body", "control");
    assertNumber(ctx.body.control, "Invalid control value");
    assertString(ctx.body.name, "Invalid name");
    assertLength(ctx.body.name, 2, 16);

    switchController.updateBy(ctx.intParam("pin"), {
      control: ctx.body.control,
      name: ctx.body.name,
    });

    return ctx.apiSend(202);
  })
  .delete((ctx) => {
    switchController.removeBy(ctx.intParam("pin"));

    return ctx.apiSend(204);
  });
