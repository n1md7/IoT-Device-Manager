import { schedulesController } from "controllers/index";
import { Router } from "server/router";
import {
  assertBoolean,
  assertKeys,
  assertNumber,
  assertObject,
  assertTimePayload,
  assertWeekPayload,
  isDefined,
} from "utils/validations";

export const routeSchedules = new Router("/schedules")
  .get((ctx) => ctx.apiSend(200, schedulesController.fetch()))
  .post((ctx) => {
    assertObject(ctx.body, "Invalid body");
    assertKeys(
      ctx.body,
      "Missing isActive, startTime, endTime, weekdays or controlPin",
      "isActive",
      "startTime",
      "endTime",
      "weekdays",
      "controlPin",
    );

    assertBoolean(ctx.body.isActive, "Invalid isActive value");
    assertTimePayload(ctx.body.startTime, "Invalid start time");
    assertTimePayload(ctx.body.endTime, "Invalid end time");
    assertWeekPayload(ctx.body.weekdays, "Invalid weekdays");
    assertNumber(ctx.body.controlPin, "Invalid control pin");

    return ctx.apiSend(
      201,
      schedulesController.create({
        isActive: ctx.body.isActive,
        startTime: ctx.body.startTime,
        endTime: ctx.body.endTime,
        weekdays: ctx.body.weekdays,
        controlPin: ctx.body.controlPin,
      }),
    );
  })
  .patch((ctx) => {
    const id = ctx.intParam("id");

    assertObject(ctx.body, "Invalid body");

    const { isActive, startTime, endTime, weekdays, controlPin } = ctx.body;

    // Optional fields
    if (isDefined(isActive)) assertBoolean(isActive, "Invalid isActive");
    if (isDefined(startTime)) assertTimePayload(startTime, "Invalid startTime");
    if (isDefined(endTime)) assertTimePayload(endTime, "Invalid endTime");
    if (isDefined(weekdays)) assertWeekPayload(weekdays, "Invalid weekdays");
    if (isDefined(controlPin)) assertNumber(controlPin, "Invalid controlPin");

    schedulesController.updateBy(id, {
      isActive: ctx.body.isActive,
      startTime: ctx.body.startTime,
      endTime: ctx.body.endTime,
      weekdays: ctx.body.weekdays,
      controlPin: ctx.body.controlPin,
    });

    return ctx.apiSend(202);
  })
  .delete((ctx) => {
    schedulesController.removeBy(ctx.intParam("id"));

    return ctx.apiSend(204);
  });
